import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUser } from "@/app/Services/auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const ALLOWED_ROLES = ["superadmin", "admin"]

async function requireAdmin(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return { user: null, error: NextResponse.json({ error: "No autenticado" }, { status: 401 }) }
  if (!ALLOWED_ROLES.includes(user.role)) return { user: null, error: NextResponse.json({ error: "Acceso denegado" }, { status: 403 }) }
  return { user, error: null }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(req)
  if (error) return error

  try {
    const { id } = await params
    const numId = parseInt(id)
    if (isNaN(numId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const { data, error: fetchError } = await supabase
      .from("ordenes_servicio")
      .select("*")
      .eq("id", numId)
      .single()

    if (fetchError || !data) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
    }

    return NextResponse.json({ order: data })
  } catch (err: any) {
    console.error("[SERVICE ORDER] Get error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireAdmin(req)
  if (error) return error

  try {
    const { id } = await params
    const numId = parseInt(id)
    if (isNaN(numId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const body = await req.json()

    const { data: existing } = await supabase
      .from("ordenes_servicio")
      .select("id")
      .eq("id", numId)
      .single()

    if (!existing) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })

    const updates: Record<string, any> = {}
    const allowedFields = [
      "nui", "modelo", "direccion", "telefono", "estado", "plataforma",
      "novedad", "tecnico", "numero_orden", "ciudad", "nombre_cliente",
      "mensaje_en_camino", "hora_mensaje_en_camino",
    ]

    for (const field of allowedFields) {
      if (field in body) updates[field] = body[field]
    }

    updates.updated_at = new Date().toISOString()

    const { data, error: updateError } = await supabase
      .from("ordenes_servicio")
      .update(updates)
      .eq("id", numId)
      .select()
      .single()

    if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

    return NextResponse.json({ order: data })
  } catch (err: any) {
    console.error("[SERVICE ORDER] Update error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, error } = await requireAdmin(req)
  if (error) return error

  try {
    const { id } = await params
    const numId = parseInt(id)
    if (isNaN(numId)) return NextResponse.json({ error: "ID inválido" }, { status: 400 })

    const { data: existing } = await supabase
      .from("ordenes_servicio")
      .select("id")
      .eq("id", numId)
      .single()

    if (!existing) return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })

    const { error: deleteError } = await supabase
      .from("ordenes_servicio")
      .delete()
      .eq("id", numId)

    if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[SERVICE ORDER] Delete error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}