import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireSuperAdmin } from "@/app/Services/auth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin(request)
    if (auth.error) {
      return auth.error
    }

    const body = await request.json()
    const { name, logo_url, primary_color } = body

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "El nombre es requerido" },
        { status: 400 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const id = `org-${Date.now().toString(36)}`

    const { data, error } = await supabase
      .from("organizations")
      .insert({
        id,
        name: name.trim(),
        logo_url: logo_url || "/logos/default.png",
        primary_color: primary_color || "#000000",
        active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({ success: true, organization: data })
  } catch (error) {
    console.error("Create organization error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}