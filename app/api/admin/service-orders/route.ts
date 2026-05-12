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

export async function GET(req: NextRequest) {
  const { user, error } = await requireAdmin(req)
  if (error) return error

  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"))
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20")))
    const search = searchParams.get("search") || ""
    const estado = searchParams.get("estado") || ""
    const ciudad = searchParams.get("ciudad") || ""
    const tecnico = searchParams.get("tecnico") || ""
    const numeroOrden = searchParams.get("numero_orden") || ""
    const sortField = searchParams.get("sortField") || "created_at"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let countQuery = supabase.from("ordenes_servicio").select("*", { count: "exact", head: true })
    let dataQuery = supabase.from("ordenes_servicio").select("*")

    if (search) {
      const filter = `nui.ilike.%${search}%,nombre_cliente.ilike.%${search}%,direccion.ilike.%${search}%,ciudad.ilike.%${search}%,tecnico.ilike.%${search}%,numero_orden.ilike.%${search}%`
      countQuery = countQuery.or(filter)
      dataQuery = dataQuery.or(filter)
    }
    if (estado) {
      countQuery = countQuery.eq("estado", estado)
      dataQuery = dataQuery.eq("estado", estado)
    }
    if (ciudad) {
      countQuery = countQuery.ilike("ciudad", `%${ciudad}%`)
      dataQuery = dataQuery.ilike("ciudad", `%${ciudad}%`)
    }
    if (tecnico) {
      countQuery = countQuery.ilike("tecnico", `%${tecnico}%`)
      dataQuery = dataQuery.ilike("tecnico", `%${tecnico}%`)
    }
    if (numeroOrden) {
      countQuery = countQuery.ilike("numero_orden", `%${numeroOrden}%`)
      dataQuery = dataQuery.ilike("numero_orden", `%${numeroOrden}%`)
    }

    const { count, error: countError } = await countQuery
    if (countError) return NextResponse.json({ error: countError.message }, { status: 500 })

    const orderColumn: Record<string, string> = {
      id: "id",
      nui: "nui",
      nombre_cliente: "nombre_cliente",
      direccion: "direccion",
      ciudad: "ciudad",
      telefono: "telefono",
      tecnico: "tecnico",
      estado: "estado",
      plataforma: "plataforma",
      created_at: "created_at",
      updated_at: "updated_at",
      numero_orden: "numero_orden",
    }

    const dbColumn = orderColumn[sortField] || "created_at"

    const { data: orders, error: dataError } = await dataQuery
      .order(dbColumn, { ascending: sortOrder === "asc" })
      .range(from, to)

    if (dataError) return NextResponse.json({ error: dataError.message }, { status: 500 })

    return NextResponse.json({
      orders: orders || [],
      total: count || 0,
      page,
      pageSize,
      totalPages: Math.ceil((count || 0) / pageSize),
    })
  } catch (err: any) {
    console.error("[SERVICE ORDERS] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin(req)
  if (error) return error

  try {
    const body = await req.json()

    if (!body.nui || !body.direccion || !body.tecnico) {
      return NextResponse.json({ error: "Campos obligatorios: nui, direccion, tecnico" }, { status: 400 })
    }

    const { data, error: insertError } = await supabase
      .from("ordenes_servicio")
      .insert({
        nui: body.nui,
        modelo: body.modelo || null,
        direccion: body.direccion,
        telefono: body.telefono || null,
        estado: body.estado || "pendiente",
        plataforma: body.plataforma || null,
        novedad: body.novedad || null,
        tecnico: body.tecnico,
        numero_orden: body.numero_orden || null,
        ciudad: body.ciudad || null,
        nombre_cliente: body.nombre_cliente || null,
        mensaje_en_camino: body.mensaje_en_camino || false,
        hora_mensaje_en_camino: body.hora_mensaje_en_camino || null,
      })
      .select()
      .single()

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 })

    return NextResponse.json({ order: data })
  } catch (err: any) {
    console.error("[SERVICE ORDERS] Create error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}