import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { detectIntention } from "@/app/Services/chat"
import crypto from "crypto"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN

function verifyTwilioRequest(req: NextRequest): boolean {
  if (!TWILIO_AUTH_TOKEN) {
    console.warn("[RECEIVE] Twilio auth token not configured")
    return false
  }

  const url = req.url
  const formData = req.body
  const signature = req.headers.get("x-twilio-signature") || ""

  const params: Record<string, string> = {}
  
  return true
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const messageBody = formData.get("Body") as string
    const from = formData.get("From") as string
    const messageSid = formData.get("MessageSid") as string

    if (!messageBody || !from) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const normalizedPhone = from.replace(/^\+/, "").replace(/\D/g, "")

    const { data: session } = await supabase
      .from("chat_sessions")
      .select("*, external_order:external_orders(*), organization:organizations(*)")
      .eq("telefono", from)
      .in("estado", ["pendiente", "contactado", "respondido"])
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!session) {
      console.log("[RECEIVE] No active session found for:", from)
      return new Response('<Response></Response>', { 
        status: 200,
        headers: { "Content-Type": "text/xml" }
      })
    }

    const { data: existingMessage } = await supabase
      .from("chat_messages")
      .select("id")
      .eq("session_id", session.id)
      .eq("twilio_sid", messageSid)
      .single()

    if (existingMessage) {
      return new Response('<Response></Response>', { 
        status: 200,
        headers: { "Content-Type": "text/xml" }
      })
    }

    const { error: insertError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: session.id,
        sender: "user",
        message: messageBody,
        twilio_sid: messageSid,
        direction: "inbound",
      })

    if (insertError) {
      console.error("[RECEIVE] Error saving message:", insertError)
    }

    const intention = detectIntention(messageBody)
    let newSessionEstado = session.estado
    let newOrderEstado: string | null = null

    if (intention.isConfirmation) {
      newSessionEstado = "confirmado"
      newOrderEstado = "confirmado"

      await supabase
        .from("chat_sessions")
        .update({ 
          estado: "confirmado",
          updated_at: new Date().toISOString()
        })
        .eq("id", session.id)

      await supabase
        .from("external_orders")
        .update({ 
          estado: "confirmado",
          updated_at: new Date().toISOString()
        })
        .eq("id", session.external_order_id)

      console.log("[RECEIVE] Order confirmed:", session.external_order_id, "keyword:", intention.matchedKeyword)
    } else if (session.estado === "contactado") {
      newSessionEstado = "respondido"

      await supabase
        .from("chat_sessions")
        .update({ 
          estado: "respondido",
          updated_at: new Date().toISOString()
        })
        .eq("id", session.id)
    }

    return new Response('<Response></Response>', { 
      status: 200,
      headers: { "Content-Type": "text/xml" }
    })
  } catch (error: any) {
    console.error("[RECEIVE] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}