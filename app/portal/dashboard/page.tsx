"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  Upload,
  Search,
  Bell,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react"

interface Session {
  email: string
  name: string
  company: string
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard", active: true },
  { icon: FileSpreadsheet, label: "Subir Excel", href: "/portal/dashboard/upload" },
  { icon: ClipboardList, label: "Órdenes", href: "/portal/dashboard/orders" },
  { icon: Users, label: "Clientes", href: "/portal/dashboard/clients" },
  { icon: Settings, label: "Configuración", href: "/portal/dashboard/settings" },
]

const recentOrders = [
  {
    id: "ORD-2024-001",
    client: "María García",
    service: "Instalación Aire Acondicionado",
    city: "Bogotá",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "ORD-2024-002",
    client: "Carlos López",
    service: "Instalación Televisor",
    city: "Medellín",
    status: "in_progress",
    date: "2024-01-15",
  },
  {
    id: "ORD-2024-003",
    client: "Ana Martínez",
    service: "Instalación Lavadora",
    city: "Cali",
    status: "pending",
    date: "2024-01-14",
  },
  {
    id: "ORD-2024-004",
    client: "Pedro Ramírez",
    service: "Mantenimiento AC",
    city: "Barranquilla",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "ORD-2024-005",
    client: "Laura Sánchez",
    service: "Instalación Estufa Gas",
    city: "Bogotá",
    status: "in_progress",
    date: "2024-01-13",
  },
]

const stats = [
  {
    title: "Órdenes del Mes",
    value: "156",
    change: "+12%",
    trend: "up",
    icon: ClipboardList,
  },
  {
    title: "Instalaciones Completadas",
    value: "142",
    change: "+8%",
    trend: "up",
    icon: CheckCircle,
  },
  {
    title: "En Proceso",
    value: "14",
    change: "-5%",
    trend: "down",
    icon: Clock,
  },
  {
    title: "Clientes Activos",
    value: "48",
    change: "+3%",
    trend: "up",
    icon: Users,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("fermaj_session")
    if (stored) {
      setSession(JSON.parse(stored))
    } else {
      router.push("/portal")
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("fermaj_session")
    router.push("/portal")
  }

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

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    )
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
          {/* Logo */}
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

          {/* Navigation */}
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

          {/* User */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {session.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session.name}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.company}
                </p>
              </div>
            </div>
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
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar órdenes, clientes..."
                  className="pl-9 w-64 bg-secondary border-border"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Bienvenido, {session.name.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground">
              Aquí tienes un resumen de la actividad de tu cuenta
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <stat.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span
                      className={`text-sm flex items-center gap-1 ${
                        stat.trend === "up" ? "text-primary" : "text-red-400"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-foreground">Órdenes Recientes</CardTitle>
                    <CardDescription>Últimas instalaciones registradas</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver todas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{order.client}</p>
                          <p className="text-sm text-muted-foreground">{order.service}</p>
                        </div>
                      </div>
                      <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                          <MapPin className="w-3 h-3" />
                          {order.city}
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
                <CardDescription>Operaciones frecuentes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/portal/dashboard/upload">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Upload className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Subir Excel</p>
                      <p className="text-xs text-muted-foreground">Cargar órdenes masivas</p>
                    </div>
                  </Button>
                </Link>
                <Link href="/portal/dashboard/orders">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ClipboardList className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Revisar Órdenes</p>
                      <p className="text-xs text-muted-foreground">Estado de instalaciones</p>
                    </div>
                  </Button>
                </Link>
                <Link href="/portal/dashboard/clients">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">Clientes</p>
                      <p className="text-xs text-muted-foreground">Gestionar clientes</p>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
