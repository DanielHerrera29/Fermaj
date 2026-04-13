"use client"

import { useState } from "react"
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
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Calendar,
  Eye,
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard" },
  { icon: FileSpreadsheet, label: "Subir Excel", href: "/portal/dashboard/upload" },
  { icon: ClipboardList, label: "Órdenes", href: "/portal/dashboard/orders", active: true },
  { icon: Users, label: "Clientes", href: "/portal/dashboard/clients" },
  { icon: Settings, label: "Configuración", href: "/portal/dashboard/settings" },
]

const orders = [
  {
    id: "ORD-2024-001",
    client: "María García",
    phone: "+57 315 123 4567",
    service: "Instalación Aire Acondicionado Samsung 12000 BTU",
    city: "Bogotá",
    address: "Calle 123 #45-67, Chapinero",
    status: "completed",
    date: "2024-01-15",
    technician: "Juan Pérez",
  },
  {
    id: "ORD-2024-002",
    client: "Carlos López",
    phone: "+57 310 987 6543",
    service: "Instalación Televisor Samsung 65'' QLED",
    city: "Medellín",
    address: "Carrera 70 #50-30, El Poblado",
    status: "in_progress",
    date: "2024-01-15",
    technician: "Pedro Ramírez",
  },
  {
    id: "ORD-2024-003",
    client: "Ana Martínez",
    phone: "+57 320 456 7890",
    service: "Instalación Lavadora LG 20kg",
    city: "Cali",
    address: "Avenida 6N #25-50, Granada",
    status: "pending",
    date: "2024-01-14",
    technician: "Sin asignar",
  },
  {
    id: "ORD-2024-004",
    client: "Pedro Ramírez",
    phone: "+57 318 234 5678",
    service: "Mantenimiento Aire Acondicionado",
    city: "Barranquilla",
    address: "Calle 84 #51-20, Alto Prado",
    status: "completed",
    date: "2024-01-14",
    technician: "Luis García",
  },
  {
    id: "ORD-2024-005",
    client: "Laura Sánchez",
    phone: "+57 300 567 8901",
    service: "Instalación Estufa a Gas Whirlpool",
    city: "Bogotá",
    address: "Calle 100 #15-20, Usaquén",
    status: "in_progress",
    date: "2024-01-13",
    technician: "Andrés Mora",
  },
  {
    id: "ORD-2024-006",
    client: "Roberto Díaz",
    phone: "+57 311 678 9012",
    service: "Instalación Nevera Samsung Side by Side",
    city: "Bucaramanga",
    address: "Carrera 33 #48-10, Cabecera",
    status: "pending",
    date: "2024-01-13",
    technician: "Sin asignar",
  },
]

export default function OrdersPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.city.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-primary/20 text-primary">
            <CheckCircle className="w-3 h-3" />
            Completada
          </span>
        )
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">
            <Clock className="w-3 h-3" />
            En Proceso
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400">
            <AlertCircle className="w-3 h-3" />
            Pendiente
          </span>
        )
      default:
        return null
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("fermaj_session")
    router.push("/portal")
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <Link href="/">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4yX0MySL8JwRWLy6HNVo15DHVDqngh.png"
                alt="Fermaj Logo"
                width={100}
                height={35}
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      item.active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-2"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center px-4 h-16">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-semibold text-foreground ml-4 lg:ml-0">
              Órdenes de Instalación
            </h1>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Filters */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por cliente, ID o ciudad..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-background border-border"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 px-3 rounded-md bg-background border border-border text-foreground text-sm"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="pending">Pendientes</option>
                    <option value="in_progress">En Proceso</option>
                    <option value="completed">Completadas</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Orders List */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">
                {filteredOrders.length} Órdenes encontradas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-mono text-muted-foreground">
                            {order.id}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <h3 className="font-medium text-foreground mb-1">
                          {order.client}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {order.service}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {order.city}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {order.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {order.date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Ver Detalles
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
