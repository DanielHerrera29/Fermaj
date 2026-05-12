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

export async function GET(req: NextRequest) {
  const user = await getCurrentUser(req)
  if (!user) return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")
    const city = searchParams.get("city")
    const search = searchParams.get("search")

    let query = supabase
      .from("external_orders")
      .select("*")
      .order("created_at", { ascending: false })

    if (user.role !== "superadmin") {
      query = query.eq("organization_id", user.organization_id)
    }

    if (status) query = query.eq("estado", status)
    if (city) query = query.ilike("ciudad", `%${city}%`)
    if (search) {
      query = query.or(
        `nombre_cliente.ilike.%${search}%,nui.ilike.%${search}%,direccion.ilike.%${search}%`
      )
    }

    const { data, error } = await query

    if (error) {
      console.error("[LIST] Supabase error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Mapear resultados a inglés
    const orders = (data ?? []).map(mapOrderToEnglish)

    return NextResponse.json({ orders })
  } catch (err: any) {
    console.error("[LIST] Error:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}