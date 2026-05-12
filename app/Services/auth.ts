import { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export interface CurrentUser {
  id: string
  email: string
  name: string
  role: string
  organization_id: string | null
  active?: boolean
}

export async function getCurrentUser(request: NextRequest): Promise<CurrentUser | null> {
  const sessionToken = request.cookies.get("session")?.value
  if (!sessionToken) return null

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: session } = await supabase
    .from("web_sessions")
    .select("*, user:web_users(*)")
    .eq("token", sessionToken)
    .gte("expires_at", new Date().toISOString())
    .single()

  if (!session?.user) return null

  const userData = session.user
  return {
    id: userData.id,
    email: userData.email,
    name: userData.nombre || userData.name,
    role: userData.role,
    organization_id: userData.organization_id,
    active: userData.active,
  }
}

export async function requireSuperAdmin(request: NextRequest): Promise<{ user: CurrentUser; error: null } | { user: null; error: Response }> {
  const user = await getCurrentUser(request)

  if (!user) {
    return {
      user: null,
      error: Response.json({ error: "No autenticado" }, { status: 401 }),
    }
  }

  if (user.role !== "superadmin") {
    return {
      user: null,
      error: Response.json({ error: "Acceso denegado" }, { status: 403 }),
    }
  }

  return { user, error: null }
}