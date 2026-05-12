import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUser } from "@/app/Services/auth"
import { sendWhatsAppMessage, formatPhoneNumber } from "@/app/Services/whatsapp"
import { buildInitialMessage } from "@/app/Services/chat"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TEST_PHONE = "573223509469"

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  if (!user.active) {
    return NextResponse.json({ error: "Usuario inactivo" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { external_order_id, message: customMessage } = body as {
      external_order_id: string
      message?: string
    }

    if (!external_order_id) {
      return NextResponse.json({ error: "external_order_id requerido" }, { status: 400 })
    }

    const { data: order, error: orderError } = await supabase
      .from("external_orders")
      .select("id, telefono, nombre_cliente, tipo_servicio, estado, organization_id")
      .eq("id", external_order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    if (!order.organization_id) {
      return NextResponse.json({ error: "Orden sin organización válida" }, { status: 400 })
    }

    if (user.organization_id && order.organization_id !== user.organization_id) {
      return NextResponse.json({ error: "No tienes acceso a esta orden" }, { status: 403 })
    }

    const validStates = ["nuevo", "contactado", "cancelado"]
    if (!validStates.includes(order.estado)) {
      return NextResponse.json({ 
        error: `No se puede iniciar contacto. Estado actual: ${order.estado}` 
      }, { status: 400 })
    }

    const { data: organization } = await supabase
      .from("organizations")
      .select("id, name")
      .eq("id", order.organization_id)
      .single()

    if (!organization) {
      return NextResponse.json({ error: "Organización no encontrada" }, { status: 404 })
    }

    const { data: existingSession } = await supabase
      .from("chat_sessions")
      .select("id")
      .eq("external_order_id", external_order_id)
      .in("estado", ["pendiente", "contactado", "respondido"])
      .single()

    if (existingSession) {
      return NextResponse.json({ 
        error: "Ya existe una sesión activa para esta orden",
        session_id: existingSession.id
      }, { status: 400 })
    }

    const phone = order.telefono
    if (!phone) {
      return NextResponse.json({ error: "La orden no tiene teléfono" }, { status: 400 })
    }

    const targetPhone = TEST_PHONE

    const messageText = customMessage || buildInitialMessage({
      nombre_cliente: order.nombre_cliente,
      empresa: organization.name,
      tipo_servicio: order.tipo_servicio,
    })

    const twilioResult = await sendWhatsAppMessage({
      to: targetPhone,
      message: messageText,
    })

    console.log("[CHAT START] Twilio result:", twilioResult)

    const { data: session, error: sessionError } = await supabase
      .from("chat_sessions")
      .insert({
        external_order_id,
        organization_id: order.organization_id,
        telefono: targetPhone,
        estado: "contactado",
        modo_test: true,
      })
      .select()
      .single()

    if (sessionError) {
      console.error("[CHAT] Error creating session:", sessionError)
      return NextResponse.json({ error: "Error al crear sesión" }, { status: 500 })
    }

    await supabase
      .from("chat_messages")
      .insert({
        session_id: session.id,
        sender: "bot",
        message: messageText,
        twilio_sid: twilioResult.sid,
        direction: "outbound",
      })

    await supabase
      .from("external_orders")
      .update({ estado: "contactado", updated_at: new Date().toISOString() })
      .eq("id", external_order_id)

    return NextResponse.json({
      success: true,
      session_id: session.id,
      message: "Contacto iniciado",
      sent_to: targetPhone,
      modo_test: true,
      twilio_sid: twilioResult.sid,
    })
  } catch (error: any) {
    console.error("[CHAT START] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}