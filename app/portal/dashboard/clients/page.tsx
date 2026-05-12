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
  Plus,
  MoreVertical,
  CheckCircle,
  XCircle,
  Loader2,
  User,
  Shield,
} from "lucide-react"
import { getMe } from "@/app/Services/api"

interface UserData {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  organization_id: string
  organization_name: string
  created_at: string
}

const COMPANY_STYLES: Record<string, string> = {
  samsung: "border-blue-500",
  lg: "border-red-500",
  compuspar: "border-red-600",
}

const COMPANIES = [
  { id: "samsung", name: "Samsung", color: "#1428A0" },
  { id: "lg", name: "LG", color: "#A50034" },
  { id: "compuspar", name: "Compuspar", color: "#E31837" },
]

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard" },
  { icon: FileSpreadsheet, label: "Subir Excel", href: "/portal/dashboard/upload" },
  { icon: ClipboardList, label: "Órdenes", href: "/portal/dashboard/orders" },
  { icon: Settings, label: "Configuración", href: "/portal/dashboard/settings" },
]

const emptyForm = {
  name: "",
  email: "",
  password: "",
  company: "",
  role: "user",
}

export default function ClientsPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    role: "user",
  })
  const [formError, setFormError] = useState("")

  useEffect(() => {
    async function loadData() {
      const userData = await getMe()
      if (!userData) {
        router.push("/portal")
        return
      }
      setUser(userData.user)
      await loadUsers()
      setLoading(false)
    }
    loadData()
  }, [router])

  const loadUsers = async () => {
    try {
      const response = await fetch("/api/users/list", { credentials: "include" })
      const data = await response.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Error loading users:", error)
    }
  }

  const isSuperadmin = user?.role === "superadmin" || user?.organization_id === null

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError("")

    console.log("Creating user with data:", formData)

    try {
      const response = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      console.log("Create response:", response.status, data)

      if (!response.ok) {
        setFormError(data.error || "Error al crear usuario")
        setSubmitting(false)
        return
      }

      setFormData(emptyForm)
      setShowForm(false)
      await loadUsers()
    } catch (error) {
      console.error("Create user error:", error)
      setFormError("Error de conexión")
    }

    setSubmitting(false)
  }

  const handleToggleActive = async (userData: UserData) => {
    try {
      const response = await fetch("/api/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ id: userData.id, active: !userData.active }),
      })
      if (response.ok) {
        await loadUsers()
      }
    } catch (error) {
      console.error("Error toggling active:", error)
    }
  }

  const getCompanyStyle = (orgName: string) => {
    const normalized = orgName.toLowerCase()
    if (normalized.includes("samsung")) return COMPANY_STYLES.samsung
    if (normalized.includes("lg")) return COMPANY_STYLES.lg
    if (normalized.includes("compuspar")) return COMPANY_STYLES.compuspar
    return "border-border"
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.organization_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleLogout = () => {
    localStorage.removeItem("fermaj_session")
    router.push("/portal")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
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
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
              {(user?.role === "superadmin" || user?.role === "admin") && (
                <li>
                  <Link
                    href="/portal/dashboard/admin/orders"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/portal/dashboard/clients"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary"
                >
                  <Users className="w-5 h-5" />
                  Clientes
                </Link>
              </li>
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
                Usuarios
              </h1>
            </div>
            {isSuperadmin && (
              <Button
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
                onClick={() => {
                  setFormData(emptyForm)
                  setFormError("")
                  setShowForm(true)
                }}
              >
                <Plus className="w-4 h-4" />
                Nuevo Usuario
              </Button>
            )}
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          {/* Search */}
          <Card className="bg-card border-border mb-6">
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o empresa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-background border-border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Empty state */}
          {filteredUsers.length === 0 && !searchTerm && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {COMPANIES.map((company) => (
                <Card
                  key={company.id}
                  className={`bg-card border-2 ${getCompanyStyle(company.name)}`}
                >
                  <CardContent className="p-6 text-center">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                      style={{ backgroundColor: company.color + "20" }}
                    >
                      <User className="w-8 h-8" style={{ color: company.color }} />
                    </div>
                    <h3 className="font-semibold text-foreground">{company.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {users.filter(
                        (u) =>
                          u.organization_name.toLowerCase() === company.name.toLowerCase()
                      ).length === 0
                        ? "Sin usuarios"
                        : `${users.filter(
                            (u) =>
                              u.organization_name.toLowerCase() === company.name.toLowerCase()
                          ).length} usuario(s)`}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Users Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredUsers.length === 0 && searchTerm ? (
              <Card className="bg-card border-border col-span-full">
                <CardContent className="p-8 text-center">
                  <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No se encontraron usuarios</p>
                </CardContent>
              </Card>
            ) : (
              filteredUsers.map((userData) => (
                <Card
                  key={userData.id}
                  className={`bg-card border-border hover:border-primary/50 transition-colors ${getCompanyStyle(
                    userData.organization_name
                  )}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-lg font-medium text-primary">
                            {userData.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{userData.name}</h3>
                          <p className="text-xs text-muted-foreground">{userData.email}</p>
                        </div>
                      </div>
                      <button 
                        className={`p-1 ${isSuperadmin ? 'text-muted-foreground hover:text-foreground cursor-pointer' : 'text-muted-foreground/50 cursor-not-allowed'}`}
                        onClick={() => isSuperadmin && handleToggleActive(userData)}
                        title={isSuperadmin ? "Menú" : "Solo disponible para superadmin"}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Empresa</span>
                        <span className="font-medium">{userData.organization_name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Rol</span>
                        <span className="capitalize">{userData.role}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Creado</span>
                        <span>
                          {new Date(userData.created_at).toLocaleDateString("es-CO")}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {userData.active ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm text-green-500">Activo</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-red-500" />
                            <span className="text-sm text-red-500">Inactivo</span>
                          </>
                        )}
                      </div>
                      {isSuperadmin && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(userData)}
                        >
                          {userData.active ? "Desactivar" : "Activar"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => {
              setFormData(emptyForm)
              setFormError("")
              setShowForm(false)
            }}
          />
          <Card className="relative z-10 w-full max-w-md bg-card">
            <CardHeader>
              <CardTitle>Crear Usuario</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Nombre
                  </label>
                  <Input
                    placeholder="Juan Perez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="juan@empresa.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Contraseña
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={4}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Empresa
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  >
                    <option value="">Seleccionar empresa</option>
                    {COMPANIES.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Rol
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                {formError && <p className="text-sm text-red-500">{formError}</p>}
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setFormData(emptyForm)
                      setFormError("")
                      setShowForm(false)
                    }}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Crear Usuario"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}