import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { requireSuperAdmin } from "@/app/Services/auth"
import bcrypt from "bcrypt"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const normalizeCompanyName = (input: string): string => {
  const lower = input.toLowerCase().trim()
  if (lower.includes("samsung")) return "Samsung"
  if (lower.includes("lg")) return "LG"
  if (lower.includes("compuspar")) return "Compuspar"
  return input.trim()
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireSuperAdmin(request)
    if (auth.error) {
      return auth.error
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const body = await request.json()
    const { name, email, password, company, role } = body

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "El nombre es requerido" }, { status: 400 })
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "El email es requerido" }, { status: 400 })
    }

    if (!password || password.length < 4) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 4 caracteres" },
        { status: 400 }
      )
    }

    if (!company) {
      return NextResponse.json({ error: "La empresa es requerida" }, { status: 400 })
    }

    const companyName = normalizeCompanyName(company)
    
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .ilike("name", companyName)
      .single()

    if (orgError || !org) {
      console.error("Org not found:", orgError, { companyName })
      return NextResponse.json(
        { error: "Empresa no encontrada en la base de datos" },
        { status: 400 }
      )
    }

    const organization_id = org.id

    console.log("Creating user:", { name, email, company: companyName, organization_id })
    const userRole = role === "admin" ? "admin" : "user"

    const hashedPassword = await bcrypt.hash(password, 12)

    const { data: existing } = await supabase
      .from("web_users")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un usuario con este email" },
        { status: 400 }
      )
    }

    const insertData = {
      email: email.trim().toLowerCase(),
      password_hash: hashedPassword,
      nombre: name.trim(),
      organization_id,
      role: userRole,
      active: true,
    }

    console.log("Inserting:", JSON.stringify(insertData))

    const { data, error } = await supabase
      .from("web_users")
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("Insert error:", error)
      return NextResponse.json({ error: error.message, code: error.code }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.id,
        email: data.email,
        name: data.nombre,
        role: data.role,
        organization_id: data.organization_id,
      },
    })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}