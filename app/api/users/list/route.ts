import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUser, CurrentUser } from "@/app/Services/auth"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request)
    
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from("web_users")
      .select("*, organization:organizations(name)")
      .order("created_at", { ascending: false })
      .neq("role", "superadmin")

    const isSuperadmin = user.role === "superadmin"

    if (!isSuperadmin && user.organization_id) {
      query = query.eq("organization_id", user.organization_id)
    }

    const { data: users, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    const formattedUsers = (users || []).map((user: any) => ({
      id: user.id,
      name: user.nombre,
      email: user.email,
      role: user.role,
      active: user.active,
      organization_id: user.organization_id,
      organization_name: user.organization?.name || "Sin asignar",
      created_at: user.created_at,
    }))

    return NextResponse.json({ 
      users: formattedUsers,
      isSuperadmin,
    })
  } catch (error) {
    console.error("List users error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}