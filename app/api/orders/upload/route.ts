import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getCurrentUser } from "@/app/Services/auth"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const user = await getCurrentUser(req)

  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  if (!user.active) {
    return NextResponse.json({ error: "Usuario inactivo" }, { status: 403 })
  }

  try {
    const body = await req.json()
    const { ordenes } = body as { ordenes: any[]; organization_id?: string }

    if (!ordenes || !Array.isArray(ordenes) || ordenes.length === 0) {
      return NextResponse.json({ error: "No hay órdenes para procesar" }, { status: 400 })
    }

    const organizationId =
      user.role === "superadmin" && body.organization_id
        ? body.organization_id
        : user.organization_id

    if (!organizationId) {
      return NextResponse.json({ error: "Sin organización asignada" }, { status: 400 })
    }

    // Mapeo inglés → español
    const nuis = ordenes.map((o) => String(o.nui ?? "")).filter(Boolean)

    const { data: existentes } = await supabase
      .from("external_orders")
      .select("nui")
      .in("nui", nuis)
      .eq("organization_id", organizationId)

    const nuisExistentes = new Set((existentes ?? []).map((e: any) => e.nui))
    const nuevas = ordenes.filter((o) => !nuisExistentes.has(String(o.nui ?? "")))
    const duplicadas = ordenes.length - nuevas.length

    if (nuevas.length === 0) {
      return NextResponse.json({
        message: "Todas las órdenes ya existen en la base de datos",
        insertadas: 0,
        duplicadas,
      })
    }

    // Mapeo: inglés → español para INSERT
    const rows = nuevas.map((o) => ({
      organization_id: organizationId,
      created_by: user.id,
      nui: String(o.nui ?? ""),
      nombre_cliente: String(o.client_name ?? ""),
      telefono: String(o.client_phone ?? ""),
      direccion: String(o.address ?? ""),
      ciudad: String(o.city ?? ""),
      modelo: o.model ? String(o.model) : null,
      tipo_servicio: String(o.service_type ?? "instalacion"),
      descripcion: o.description ? String(o.description) : null,
      prioridad: Number(o.priority ?? 1),
      estado: String(o.status ?? "nuevo"),
    }))

    const { data, error } = await supabase
      .from("external_orders")
      .insert(rows)
      .select()

    if (error) {
      console.error("[UPLOAD] Supabase error:", error)
      return NextResponse.json(
        { error: `Error al insertar en base de datos: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Órdenes cargadas correctamente",
      insertadas: data?.length ?? nuevas.length,
      duplicadas,
    })
  } catch (err: any) {
    console.error("[UPLOAD] Error inesperado:", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}