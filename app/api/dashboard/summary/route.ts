import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function getUserFromSession(request: NextRequest, supabase: any) {
  const sessionToken = request.cookies.get("session")?.value
  if (!sessionToken) return null

  const { data: session } = await supabase
    .from("web_sessions")
    .select("*, user:web_users(*)")
    .eq("token", sessionToken)
    .gte("expires_at", new Date().toISOString())
    .single()

  return session?.user || null
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    const user = await getUserFromSession(request, supabase)

    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const isSuperadmin = user.role === "superadmin" || user.organization_id === null

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

    let orgFilter = {}
    if (!isSuperadmin && user.organization_id) {
      orgFilter = { organization_id: user.organization_id }
    }

    let ordersQuery = supabase
      .from("external_orders")
      .select("id, estado")
      .gte("created_at", startOfMonth)
      .lte("created_at", endOfMonth)

    if (!isSuperadmin && user.organization_id) {
      ordersQuery = ordersQuery.eq("organization_id", user.organization_id)
    }

    const { data: ordersThisMonth } = await ordersQuery

    let serviceOrders: any[] = []
    try {
      if (isSuperadmin) {
        const { data } = await supabase.from("ordenes_servicio").select("id, estado")
        serviceOrders = data || []
      } else {
        const { data: extOrders } = await supabase
          .from("external_orders")
          .select("id")
          .eq("organization_id", user.organization_id)
        const extIds = extOrders?.map((o: any) => o.id) || []
        if (extIds.length > 0) {
          const { data } = await supabase
            .from("ordenes_servicio")
            .select("id, estado")
            .in("orden_externa_id", extIds)
          serviceOrders = data || []
        }
      }
    } catch (e) {
      console.log("ordenes_servicio table not accessible:", e)
    }

    const completedCount = serviceOrders?.filter((o: any) => o.estado === "finalizado").length || 0
    const inProgressCount = serviceOrders?.filter((o: any) =>
      ["pendiente", "en_progreso", "reprogramado"].includes(o.estado)
    ).length || 0
    const cancelledCount = serviceOrders?.filter((o: any) => o.estado === "cancelado").length || 0

    let activeClients = 0
    if (isSuperadmin) {
      const { count } = await supabase
        .from("organizations")
        .select("*", { count: "exact", head: true })
        .eq("active", true)
      activeClients = count || 0
    }

    const totalOrders = ordersThisMonth?.length || 0
    const totalService = serviceOrders?.length || 0

    const summary = {
      ordersThisMonth: totalOrders,
      completed: completedCount,
      inProgress: inProgressCount,
      cancelled: cancelledCount,
      activeClients,
      stats: {
        total: totalService,
        completedPercent: totalService > 0 ? Math.round((completedCount / totalService) * 100) : 0,
        inProgressPercent: totalService > 0 ? Math.round((inProgressCount / totalService) * 100) : 0,
        cancelledPercent: totalService > 0 ? Math.round((cancelledCount / totalService) * 100) : 0,
      },
    }

    return NextResponse.json(summary)
  } catch (error) {
    console.error("Dashboard summary error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}