import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUser } from "@/app/Services/auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)

  if (!user || !user.active) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const estado = searchParams.get("estado") || undefined
    const limit = parseInt(searchParams.get("limit") || "50")

    const isSuperadmin = user.role === "superadmin" || user.organization_id === null

    let query = supabase
      .from("chat_sessions")
      .select(`
        id,
        external_order_id,
        organization_id,
        telefono,
        estado,
        modo_test,
        created_at,
        updated_at,
        closed_at,
        external_order:external_orders(
          id,
          nombre_cliente,
          tipo_servicio,
          ciudad,
          estado,
          created_at
        ),
        organization:organizations(
          id,
          name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (!isSuperadmin && user.organization_id) {
      query = query.eq("organization_id", user.organization_id)
    }

    if (estado) {
      query = query.eq("estado", estado)
    }

    const { data: sessions, error } = await query

    if (error) {
      console.error("[SESSIONS] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const mapped = sessions?.map((s: any) => ({
      id: s.id,
      external_order_id: s.external_order_id,
      organization_id: s.organization_id,
      telefono: s.telefono,
      estado: s.estado,
      modo_test: s.modo_test,
      created_at: s.created_at,
      updated_at: s.updated_at,
      closed_at: s.closed_at,
      client_name: s.external_order?.nombre_cliente,
      service_type: s.external_order?.tipo_servicio,
      city: s.external_order?.ciudad,
      order_estado: s.external_order?.estado,
      organization_name: s.organization?.name,
    })) || []

    return NextResponse.json({ sessions: mapped })
  } catch (error: any) {
    console.error("[SESSIONS] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser(req)

  if (!user || !user.active) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { session_id, action, message } = body as {
      session_id: string
      action: "close" | "confirm" | "responder"
      message?: string
    }

    if (!session_id || !action) {
      return NextResponse.json({ error: "Parámetros requeridos" }, { status: 400 })
    }

    const { data: session } = await supabase
      .from("chat_sessions")
      .select("*, external_order:external_orders(id, organization_id)")
      .eq("id", session_id)
      .single()

    if (!session) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 })
    }

    if (user.organization_id && session.organization_id !== user.organization_id) {
      return NextResponse.json({ error: "No tienes acceso" }, { status: 403 })
    }

    if (action === "close") {
      await supabase
        .from("chat_sessions")
        .update({
          estado: "cerrado",
          closed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", session_id)

      return NextResponse.json({ success: true, message: "Sesión cerrada" })
    }

    if (action === "confirm") {
      await supabase
        .from("chat_sessions")
        .update({
          estado: "confirmado",
          updated_at: new Date().toISOString(),
        })
        .eq("id", session_id)

      await supabase
        .from("external_orders")
        .update({
          estado: "confirmado",
          updated_at: new Date().toISOString(),
        })
        .eq("id", session.external_order_id)

      return NextResponse.json({ success: true, message: "Orden confirmada" })
    }

    if (action === "responder" && message) {
      const { sendWhatsAppMessage } = await import("@/app/Services/whatsapp")

      const result = await sendWhatsAppMessage({
        to: session.telefono,
        message: message,
      })

      if (result.success) {
        await supabase
          .from("chat_messages")
          .insert({
            session_id: session_id,
            sender: "bot",
            message: message,
            twilio_sid: result.sid,
            direction: "outbound",
          })

        await supabase
          .from("chat_sessions")
          .update({
            estado: "respondido",
            updated_at: new Date().toISOString(),
          })
          .eq("id", session_id)

        return NextResponse.json({ success: true, sid: result.sid })
      }

      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
  } catch (error: any) {
    console.error("[SESSIONS PATCH] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}