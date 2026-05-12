import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get("session")?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: "No autenticado" },
        { status: 401 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: session, error: sessionError } = await supabase
      .from("web_sessions")
      .select("*, user:web_users(*)")
      .eq("token", sessionToken)
      .gte("expires_at", new Date().toISOString())
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Sesión inválida" },
        { status: 401 }
      )
    }

    const user = session.user

    let organization = null
    if (user.organization_id) {
      const { data: org } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", user.organization_id)
        .single()
      organization = org
    }

    const isSuperadmin = user.role === "superadmin" || user.organization_id === null

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.nombre,
        role: user.role,
        organization_id: user.organization_id,
      },
      organization,
      isSuperadmin,
    })
  } catch (error) {
    console.error("Auth me error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}