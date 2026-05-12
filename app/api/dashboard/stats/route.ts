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

    let extOrdersQuery = supabase
      .from("external_orders")
      .select("id, nui, organization_id, nombre_cliente, tipo_servicio, ciudad, estado, created_at")
      .order("created_at", { ascending: false })

    if (!isSuperadmin && user.organization_id) {
      extOrdersQuery = extOrdersQuery.eq("organization_id", user.organization_id)
    }

    extOrdersQuery = extOrdersQuery.limit(10)

    const { data: orders } = await extOrdersQuery

    const recentOrders = orders?.slice(0, 10).map((o: any) => ({
      id: o.id,
      nui: o.nui,
      client: o.nombre_cliente,
      service: o.tipo_servicio,
      city: o.ciudad,
      status: o.estado,
      date: o.created_at,
      organization_id: o.organization_id,
    })) || []

    return NextResponse.json({
      recentOrders,
      totalOrders: orders?.length || 0,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}