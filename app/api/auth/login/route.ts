import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcrypt"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
console.log("ENV URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log("SERVICE KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "MISSING")
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log("EMAIL:", email)
    console.log("PASSWORD:", password)

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data: user, error: userError } = await supabase
      .from("web_users")
      .select("*")
      .eq("email", email.trim())
      .single()

    console.log("USER FROM DB:", user)
    console.log("USER ERROR:", userError)

    if (userError || !user) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    console.log("PASSWORD HASH:", user.password_hash)

    const isValid = await bcrypt.compare(password, user.password_hash)

    console.log("COMPARE RESULT:", isValid)

    if (!isValid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: sessionData, error: sessionError } = await supabase
      .from("web_sessions")
      .insert({
        user_id: user.id,
        token: token,
        expires_at: expiresAt,
        ip_address: request.headers.get("x-forwarded-for") || "unknown",
        user_agent: request.headers.get("user-agent") || "unknown",
      })
      .select()
      .single()

    console.log("SESSION ERROR:", sessionError)

    const cookieStore = await cookies()
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.nombre,
        organization_id: user.organization_id,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}