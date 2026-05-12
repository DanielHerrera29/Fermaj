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
  MessageSquare,
  Shield,
} from "lucide-react"
import { getMe, getDashboardSummary, getDashboardStats } from "@/app/Services/api"

interface User {
  id: string
  email: string
  name: string
  role: string
  organization_id: string | null
  organization?: {
    id: string
    name: string
    logo_url: string
  }
}

interface DashboardSummary {
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

interface Order {
  id: string
  nui?: string
  client: string
  service: string
  city: string
  status: string
  date: string
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard", active: true },
  { icon: FileSpreadsheet, label: "Subir Excel", href: "/portal/dashboard/upload" },
  { icon: ClipboardList, label: "Órdenes", href: "/portal/dashboard/orders" },
  { icon: Settings, label: "Configuración", href: "/portal/dashboard/settings" },
]

const quickActions = [
  { icon: Upload, label: "Subir Órdenes", href: "/portal/dashboard/upload" },
  { icon: ClipboardList, label: "Ver Órdenes", href: "/portal/dashboard/orders" },
  { icon: MessageSquare, label: "Reporte Chatbot", href: "/portal/dashboard/chatbot-report" },
]

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [userData, summaryData, statsData] = await Promise.all([
        getMe(),
        getDashboardSummary(),
        getDashboardStats(),
      ])

      if (!userData) {
        router.push("/portal")
        return
      }

      setUser(userData.user)
      if (summaryData) setSummary(summaryData)
      if (statsData) setRecentOrders(statsData.recentOrders)
      setLoading(false)
    }

    loadData()
  }, [router])

  const handleLogout = async () => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
    localStorage.removeItem("fermaj_session")
    router.push("/portal")
  }

  const isSuperadmin = user?.role === "superadmin" || user?.organization_id === null

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
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-500">
            <Clock className="w-3 h-3" />
            En Progreso
          </span>
        )
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500">
            <Clock className="w-3 h-3" />
            Pendiente
          </span>
        )
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-red-500/20 text-red-500">
            <AlertCircle className="w-3 h-3" />
            Cancelada
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-500">
            {status}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Órdenes del Mes",
      value: summary?.ordersThisMonth?.toString() || "0",
      change: summary?.stats ? `${summary.stats.completedPercent}%` : "+0%",
      trend: summary?.stats && summary.stats.completedPercent > 0 ? "up" : "down",
      icon: ClipboardList,
    },
    {
      title: "Instalaciones Completadas",
      value: summary?.completed?.toString() || "0",
      change: summary?.stats ? `${summary.stats.completedPercent}%` : "0%",
      trend: summary?.stats && summary.stats.completedPercent > 50 ? "up" : "down",
      icon: CheckCircle,
    },
    {
      title: "En Proceso",
      value: summary?.inProgress?.toString() || "0",
      change: summary?.stats ? `${summary.stats.inProgressPercent}%` : "0%",
      trend: "down",
      icon: Clock,
    },
    {
      title: isSuperadmin ? "Clientes Activos" : "Órdenes Canceladas",
      value: isSuperadmin 
        ? (summary?.activeClients?.toString() || "0")
        : (summary?.cancelled?.toString() || "0"),
      change: isSuperadmin 
        ? (summary?.activeClients ? "+0%" : "0%")
        : (summary?.stats ? `${summary.stats.cancelledPercent}%` : "0%"),
      trend: "up",
      icon: isSuperadmin ? Users : AlertCircle,
    },
  ]

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4yX0MySL8JwRWLy6HNVo15DHVDqngh.png"
              alt="Fermaj Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            {(user?.role === "superadmin" || user?.role === "admin") && (
              <>
                <Link
                  href="/portal/dashboard/admin/orders"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Admin</span>
                </Link>
                <Link
                  href="/portal/dashboard/clients"
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Clientes</span>
                </Link>
              </>
            )}
          </nav>

          {/* User */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {user?.name?.[0]?.toUpperCase() || "?"}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.name || "Usuario"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.organization?.name || "Fermaj"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Bienvenido, {user?.name?.split(" ")[0] || "Usuario"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Aquí está el resumen de hoy
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  className="pl-10 w-64 bg-card"
                />
              </div>
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="pb-2">
                  <CardDescription>{stat.title}</CardDescription>
                  <CardTitle className="text-3xl">{stat.value}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">vs mes anterior</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <Link key={action.label} href={action.href}>
                <Card className="hover:bg-secondary/50 transition-colors cursor-pointer">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <action.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{action.label}</p>
                      <p className="text-sm text-muted-foreground">Acceso rápido</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Órdenes Recientes</CardTitle>
                  <CardDescription>
                    {recentOrders.length} órdenes este mes
                  </CardDescription>
                </div>
                <Link href="/portal/dashboard/orders">
                  <Button variant="outline" size="sm">
                    Ver Todas
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Orden
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Cliente
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Servicio
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Ciudad
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Estado
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Fecha
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No hay órdenes recientes
                        </td>
                      </tr>
                    ) : (
                      recentOrders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-border hover:bg-secondary/30"
                        >
                          <td className="py-3 px-4">
                            <span className="font-medium">{order.nui || order.id}</span>
                          </td>
                          <td className="py-3 px-4">{order.client}</td>
                          <td className="py-3 px-4 capitalize">{order.service}</td>
                          <td className="py-3 px-4">{order.city}</td>
                          <td className="py-3 px-4">{getStatusBadge(order.status)}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {new Date(order.date).toLocaleDateString("es-CO")}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}