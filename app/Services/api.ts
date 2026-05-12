export interface User {
  id: string
  email: string
  name: string
  role: string
  organization_id: string | null
}

export interface Organization {
  id: string
  name: string
  logo_url: string
}

export interface AuthResponse {
  user: User
  organization: Organization | null
  isSuperadmin: boolean
}

export interface DashboardSummary {
  ordersThisMonth: number
  completed: number
  inProgress: number
  cancelled: number
  activeClients: number
  stats: {
    total: number
    completedPercent: number
    inProgressPercent: number
    cancelledPercent: number
  }
}

export interface Order {
  id: string
  nui?: string
  client: string
  service: string
  city: string
  status: string
  date: string
  organization_id?: string
}

export interface DashboardStats {
  recentOrders: Order[]
  totalOrders: number
}

export async function getMe(): Promise<AuthResponse | null> {
  try {
    const response = await fetch("/api/auth/me", { credentials: "include" })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function getDashboardSummary(): Promise<DashboardSummary | null> {
  try {
    const response = await fetch("/api/dashboard/summary", { credentials: "include" })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const response = await fetch("/api/dashboard/stats", { credentials: "include" })
    if (!response.ok) return null
    return await response.json()
  } catch {
    return null
  }
}

export interface OrganizationData {
  id: string
  name: string
  logo_url: string
  primary_color: string
  active: boolean
  created_at: string
}

export interface OrdenServicio {
  id: number
  nui: string
  modelo: string | null
  direccion: string
  telefono: string | null
  estado: string
  plataforma: string | null
  novedad: string | null
  tecnico: string
  created_at: string
  updated_at: string
  numero_orden: string | null
  ciudad: string | null
  mensaje_en_camino: boolean
  hora_mensaje_en_camino: string | null
  nombre_cliente: string | null
}

export async function getOrganizations(): Promise<OrganizationData[]> {
  try {
    const response = await fetch("/api/organizations/list", { credentials: "include" })
    const data = await response.json()
    return data.organizations || []
  } catch {
    return []
  }
}

export async function createOrganization(data: { name: string; logo_url: string; primary_color: string }): Promise<{ success: boolean; organization?: OrganizationData; error?: string }> {
  try {
    const response = await fetch("/api/organizations/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
    return await response.json()
  } catch {
    return { success: false, error: "Error de conexión" }
  }
}

export async function updateOrganization(id: string, data: Partial<OrganizationData>): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/organizations/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id, ...data }),
    })
    return await response.json()
  } catch {
    return { success: false, error: "Error de conexión" }
  }
}

export interface ChatSession {
  id: string
  external_order_id: string
  organization_id: string
  telefono: string
  estado: string
  modo_test: boolean
  created_at: string
  client_name?: string
  service_type?: string
  city?: string
  order_estado?: string
  organization_name?: string
}

export interface ChatMessage {
  id: string
  session_id: string
  sender: "bot" | "user"
  message: string
  direction: "outbound" | "inbound"
  created_at: string
}

export async function getChatSessions(estado?: string): Promise<ChatSession[]> {
  try {
    const params = new URLSearchParams()
    if (estado) params.set("estado", estado)
    const response = await fetch(`/api/chat/sessions?${params}`, { credentials: "include" })
    const data = await response.json()
    return data.sessions || []
  } catch {
    return []
  }
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const response = await fetch(`/api/chat/messages?session_id=${sessionId}`, { credentials: "include" })
    const data = await response.json()
    return data.messages || []
  } catch {
    return []
  }
}

export async function startChatContact(externalOrderId: string, message?: string): Promise<{ success: boolean; session_id?: string; error?: string }> {
  try {
    const response = await fetch("/api/chat/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ external_order_id: externalOrderId, message }),
    })
    return await response.json()
  } catch {
    return { success: false, error: "Error de conexión" }
  }
}

export async function updateChatSession(sessionId: string, action: "close" | "confirm" | "responder", message?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("/api/chat/sessions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ session_id: sessionId, action, message }),
    })
    return await response.json()
  } catch {
    return { success: false, error: "Error de conexión" }
  }
}

// =========================================
// ADMIN - SERVICE ORDERS (ordenes_servicio)
// =========================================

export interface ServiceOrderQueryParams {
  page?: number
  pageSize?: number
  search?: string
  estado?: string
  ciudad?: string
  tecnico?: string
  numero_orden?: string
  sortField?: string
  sortOrder?: "asc" | "desc"
}

export interface ServiceOrderListResponse {
  orders: OrdenServicio[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export async function getServiceOrders(params: ServiceOrderQueryParams = {}): Promise<ServiceOrderListResponse> {
  try {
    const searchParams = new URLSearchParams()
    if (params.page) searchParams.set("page", String(params.page))
    if (params.pageSize) searchParams.set("pageSize", String(params.pageSize))
    if (params.search) searchParams.set("search", params.search)
    if (params.estado) searchParams.set("estado", params.estado)
    if (params.ciudad) searchParams.set("ciudad", params.ciudad)
    if (params.tecnico) searchParams.set("tecnico", params.tecnico)
    if (params.numero_orden) searchParams.set("numero_orden", params.numero_orden)
    if (params.sortField) searchParams.set("sortField", params.sortField)
    if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder)

    const response = await fetch(`/api/admin/service-orders?${searchParams}`, { credentials: "include" })
    return await response.json()
  } catch {
    return { orders: [], total: 0, page: 1, pageSize: 20, totalPages: 0 }
  }
}

export async function getServiceOrder(id: number): Promise<{ order?: OrdenServicio; error?: string }> {
  try {
    const response = await fetch(`/api/admin/service-orders/${id}`, { credentials: "include" })
    return await response.json()
  } catch {
    return { error: "Error de conexión" }
  }
}

export async function createServiceOrder(data: Partial<OrdenServicio>): Promise<{ order?: OrdenServicio; error?: string }> {
  try {
    const response = await fetch("/api/admin/service-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
    return await response.json()
  } catch {
    return { error: "Error de conexión" }
  }
}

export async function updateServiceOrder(id: number, data: Partial<OrdenServicio>): Promise<{ order?: OrdenServicio; error?: string }> {
  try {
    const response = await fetch(`/api/admin/service-orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    })
    return await response.json()
  } catch {
    return { error: "Error de conexión" }
  }
}

export async function deleteServiceOrder(id: number): Promise<{ success?: boolean; error?: string }> {
  try {
    const response = await fetch(`/api/admin/service-orders/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    return await response.json()
  } catch {
    return { error: "Error de conexión" }
  }
}