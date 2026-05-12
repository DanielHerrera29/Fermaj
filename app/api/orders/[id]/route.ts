import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUser } from "@/app/Services/auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mapeo español → inglés para SELECT
function mapOrderToEnglish(row: any) {
  if (!row) return null
  return {
    id: row.id,
    nui: row.nui,
    client_name: row.nombre_cliente,
    client_phone: row.telefono,
    address: row.direccion,
    city: row.ciudad,
    model: row.modelo,
    service_type: row.tipo_servicio,
    description: row.descripcion,
    priority: row.prioridad,
    status: row.estado,
    organization_id: row.organization_id,
    created_by: row.created_by,
    batch_id: row.batch_id,
    orden_servicio_id: row.orden_servicio_id,
    notas_internas: row.notas_internas,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const { data, error } = await supabase
    .from("external_orders")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 })
  }

  if (user.role !== "superadmin" && data.organization_id !== user.organization_id) {
    return NextResponse.json({ error: "Sin acceso a esta orden" }, { status: 403 })
  }

  return NextResponse.json({ order: mapOrderToEnglish(data) })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  if (user.role === "user") {
    return NextResponse.json({ error: "Sin permisos para modificar órdenes" }, { status: 403 })
  }

  const body = await req.json()
  
  // Mapeo inglés → español para UPDATE
  const updates: Record<string, any> = {}
  if ("status" in body) updates.estado = body.status
  if ("description" in body) updates.descripcion = body.description
  if ("priority" in body) updates.prioridad = body.priority
  if ("address" in body) updates.direccion = body.address
  if ("city" in body) updates.ciudad = body.city
  if ("service_type" in body) updates.tipo_servicio = body.service_type
  if ("model" in body) updates.modelo = body.model
  
  updates.updated_at = new Date().toISOString()

  const { data, error } = await supabase
    .from("external_orders")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ order: mapOrderToEnglish(data) })
}