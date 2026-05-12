"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  FileSpreadsheet,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  MessageSquare,
  Shield,
} from "lucide-react"
import { getMe, startChatContact } from "@/app/Services/api"

interface Order {
  id: string
  nui: string
  client_name: string
  client_phone: string
  address: string
  city: string
  model?: string
  service_type: string
  description?: string
  priority: number
  status: string
  organization_id: string
  created_by: string
  created_at: string
  updated_at?: string
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard" },
  { icon: FileSpreadsheet, label: "Subir Excel", href: "/portal/dashboard/upload" },
  { icon: ClipboardList, label: "Órdenes", href: "/portal/dashboard/orders", active: true },
  { icon: Settings, label: "Configuración", href: "/portal/dashboard/settings" },
]

const ESTADO_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  nuevo: { label: "Nuevo", bg: "bg-gray-500/20", text: "text-gray-400" },
  contactado: { label: "Contactado", bg: "bg-blue-500/20", text: "text-blue-400" },
  sugerido: { label: "Sugerido", bg: "bg-purple-500/20", text: "text-purple-400" },
  programado: { label: "Programado", bg: "bg-amber-500/20", text: "text-amber-400" },
  cancelado: { label: "Cancelado", bg: "bg-red-500/20", text: "text-red-400" },
}

export default function OrdersPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [startingContact, setStartingContact] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      const userData = await getMe()
      if (!userData) {
        router.push("/portal")
        return
      }
      setUser(userData.user)
      await fetchOrders()
      setLoading(false)
    }
    loadData()
  }, [router])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/list", { credentials: "include" })
      const data = await res.json()
      if (data.orders) {
        setOrders(data.orders)
      }
    } catch (err) {
      console.error("Error fetching orders:", err)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.nui?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const canInitiateContact = (status: string) => {
    return status === "nuevo" || status === "contactado"
  }

  const getStatusBadge = (status: string) => {
    const config = ESTADO_CONFIG[status] || ESTADO_CONFIG.nuevo
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getPriorityBadge = (priority: number) => {
    if (priority === 2) {
      return <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-red-500/20 text-red-400">Urgente</span>
    }
    return <span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-gray-500/20 text-gray-400">Normal</span>
  }

  const handleLogout = () => {
    localStorage.removeItem("fermaj_session")
    router.push("/portal")
  }

  const handleStartContact = async (orderId: string) => {
    setStartingContact(orderId)
    try {
      const result = await startChatContact(orderId)
      console.log("[_orders] startChatContact result:", result)
      if (result.success) {
        alert("Contacto iniciado correctamente")
        await fetchOrders()
      } else {
        alert(result.error || "Error al iniciar contacto")
        console.error("Error:", result.error)
      }
    } catch (e) {
      console.error("Error starting contact:", e)
      alert("Error al iniciar contacto")
    }
    setStartingContact(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const isSuperadmin = user?.role === "superadmin" || user?.organization_id === null

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4yX0MySL8JwRWLy6HNVo15DHVDqngh.png" alt="Fermaj Logo" width={120} height={40} className="h-10 w-auto" />
          </div>
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}>
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
              {(user?.role === "superadmin" || user?.role === "admin") && (
                <>
                  <li>
                    <Link href="/portal/dashboard/admin/orders" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      <Shield className="w-5 h-5" />
                      Admin
                    </Link>
                  </li>
                  <li>
                    <Link href="/portal/dashboard/clients" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                      <Users className="w-5 h-5" />
                      Clientes
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium">{user?.name?.[0]?.toUpperCase() || "?"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name || "Usuario"}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.organization?.name || "Fermaj"}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Cerrar Sesión</Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Órdenes de Instalación</h1>
                <p className="text-sm text-muted-foreground">{orders.length} órdenes registradas</p>
              </div>
            </div>
            <Link href="/portal/dashboard/upload">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Nueva Carga
              </Button>
            </Link>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Buscar por cliente, NUI o ciudad..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9 bg-background border-border" />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-10 px-3 rounded-md bg-background border border-border text-foreground text-sm">
                  <option value="all">Todos los estados</option>
                  <option value="nuevo">Nuevo</option>
                  <option value="contactado">Contactado</option>
                  <option value="sugerido">Sugerido</option>
                  <option value="programado">Programado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">{filteredOrders.length} Órdenes encontradas</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay órdenes que mostrar</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-xs text-muted-foreground bg-background px-2 py-1 rounded">{order.nui}</span>
                            {getStatusBadge(order.status)}
                            {getPriorityBadge(order.priority)}
                          </div>
                          <h3 className="font-medium text-foreground">{order.client_name}</h3>
                          <p className="text-sm text-muted-foreground">{order.client_phone} · {order.city}</p>
                          <p className="text-sm text-muted-foreground mt-1">{order.address}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground capitalize">{order.service_type}</span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">{order.created_at ? new Date(order.created_at).toLocaleDateString("es-CO") : "-"}</span>
                        </div>
                        <div className="mt-2">
                          {canInitiateContact(order.status) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStartContact(order.id)
                              }}
                              disabled={startingContact === order.id}
                            >
                              {startingContact === order.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <MessageSquare className="w-4 h-4 mr-1" />
                              )}
                              Iniciar contacto
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}