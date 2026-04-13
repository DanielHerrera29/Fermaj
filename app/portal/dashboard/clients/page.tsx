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
  Plus,
  Phone,
  Mail,
  MapPin,
  Building,
  MoreVertical,
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard" },
  { icon: FileSpreadsheet, label: "Subir Excel", href: "/portal/dashboard/upload" },
  { icon: ClipboardList, label: "Órdenes", href: "/portal/dashboard/orders" },
  { icon: Users, label: "Clientes", href: "/portal/dashboard/clients", active: true },
  { icon: Settings, label: "Configuración", href: "/portal/dashboard/settings" },
]

const clients = [
  {
    id: "CLI-001",
    name: "María García",
    email: "maria.garcia@email.com",
    phone: "+57 315 123 4567",
    city: "Bogotá",
    address: "Calle 123 #45-67, Chapinero",
    orders: 5,
    lastOrder: "2024-01-15",
  },
  {
    id: "CLI-002",
    name: "Carlos López",
    email: "carlos.lopez@email.com",
    phone: "+57 310 987 6543",
    city: "Medellín",
    address: "Carrera 70 #50-30, El Poblado",
    orders: 3,
    lastOrder: "2024-01-15",
  },
  {
    id: "CLI-003",
    name: "Ana Martínez",
    email: "ana.martinez@email.com",
    phone: "+57 320 456 7890",
    city: "Cali",
    address: "Avenida 6N #25-50, Granada",
    orders: 2,
    lastOrder: "2024-01-14",
  },
  {
    id: "CLI-004",
    name: "Pedro Ramírez",
    email: "pedro.ramirez@email.com",
    phone: "+57 318 234 5678",
    city: "Barranquilla",
    address: "Calle 84 #51-20, Alto Prado",
    orders: 8,
    lastOrder: "2024-01-14",
  },
  {
    id: "CLI-005",
    name: "Laura Sánchez",
    email: "laura.sanchez@email.com",
    phone: "+57 300 567 8901",
    city: "Bogotá",
    address: "Calle 100 #15-20, Usaquén",
    orders: 1,
    lastOrder: "2024-01-13",
  },
  {
    id: "CLI-006",
    name: "Constructora Urbana S.A.S.",
    email: "proyectos@constructoraurbana.com",
    phone: "+57 601 234 5678",
    city: "Bogotá",
    address: "Carrera 11 #93-52, Of. 301",
    orders: 45,
    lastOrder: "2024-01-12",
    isCompany: true,
  },
]

export default function ClientsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <div className="flex items-center justify-between px-4 h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-foreground ml-4 lg:ml-0">
                Clientes
              </h1>
            </div>
            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" />
              Nuevo Cliente
            </Button>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Search */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, correo o ciudad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Clients Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className="bg-card border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        {client.isCompany ? (
                          <Building className="w-6 h-6 text-primary" />
                        ) : (
                          <span className="text-lg font-medium text-primary">
                            {client.name.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{client.name}</h3>
                        <p className="text-xs text-muted-foreground">{client.id}</p>
                      </div>
                    </div>
                    <button className="p-1 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{client.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{client.city}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-primary font-medium">{client.orders}</span>
                      <span className="text-muted-foreground"> órdenes</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
