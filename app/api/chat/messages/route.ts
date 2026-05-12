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
    const session_id = searchParams.get("session_id")

    if (!session_id) {
      return NextResponse.json({ error: "session_id requerido" }, { status: 400 })
    }

    const { data: session } = await supabase
      .from("chat_sessions")
      .select("organization_id")
      .eq("id", session_id)
      .single()

    if (!session) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 })
    }

    const isSuperadmin = user.role === "superadmin" || user.organization_id === null
    if (!isSuperadmin && user.organization_id !== session.organization_id) {
      return NextResponse.json({ error: "No tienes acceso" }, { status: 403 })
    }

    const { data: messages, error } = await supabase
      .from("chat_messages")
      .select("*")
      .eq("session_id", session_id)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("[MESSAGES] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const mapped = messages?.map((m: any) => ({
      id: m.id,
      session_id: m.session_id,
      sender: m.sender,
      message: m.message,
      direction: m.direction,
      created_at: m.created_at,
    })) || []

    return NextResponse.json({ messages: mapped })
  } catch (error: any) {
    console.error("[MESSAGES] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}