"use client"

import { useState, useEffect, useCallback } from "react"
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
  Loader2,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Shield,
  XCircle,
  Save,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { getMe, getServiceOrders, createServiceOrder, updateServiceOrder, deleteServiceOrder } from "@/app/Services/api"
import type { OrdenServicio } from "@/app/Services/api"

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pendiente: { label: "Pendiente", bg: "bg-yellow-500/20", text: "text-yellow-400" },
  en_progreso: { label: "En Progreso", bg: "bg-blue-500/20", text: "text-blue-400" },
  finalizado: { label: "Finalizado", bg: "bg-green-500/20", text: "text-green-400" },
  cancelado: { label: "Cancelado", bg: "bg-red-500/20", text: "text-red-400" },
  reprogramado: { label: "Reprogramado", bg: "bg-purple-500/20", text: "text-purple-400" },
}

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard" },
  { icon: FileSpreadsheet, label: "Subir Excel", href: "/portal/dashboard/upload" },
  { icon: ClipboardList, label: "Órdenes", href: "/portal/dashboard/orders" },
  { icon: Shield, label: "Admin", href: "/portal/dashboard/admin/orders", active: true },
  { icon: Settings, label: "Configuración", href: "/portal/dashboard/settings" },
]

const ESTADOS = ["", "pendiente", "en_progreso", "finalizado", "cancelado", "reprogramado"]

const DEFAULT_ORDER: Partial<OrdenServicio> = {
  nui: "",
  modelo: "",
  direccion: "",
  telefono: "",
  estado: "pendiente",
  plataforma: "",
  novedad: "",
  tecnico: "",
  numero_orden: "",
  ciudad: "",
  nombre_cliente: "",
}

function OrderForm({ order, onSave, onCancel }: {
  order: Partial<OrdenServicio>
  onSave: (data: Partial<OrdenServicio>) => Promise<void>
  onCancel: () => void
}) {
  const [form, setForm] = useState<Partial<OrdenServicio>>({ ...order })
  const [saving, setSaving] = useState(false)

  const handleChange = (field: keyof OrdenServicio, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nui || !form.direccion || !form.tecnico) {
      alert("Campos obligatorios: nui, direccion, tecnico")
      return
    }
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">NUI *</label>
          <Input value={form.nui || ""} onChange={(e) => handleChange("nui", e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">Número de Orden</label>
          <Input value={form.numero_orden || ""} onChange={(e) => handleChange("numero_orden", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Cliente</label>
          <Input value={form.nombre_cliente || ""} onChange={(e) => handleChange("nombre_cliente", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Teléfono</label>
          <Input value={form.telefono || ""} onChange={(e) => handleChange("telefono", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Dirección *</label>
          <Input value={form.direccion || ""} onChange={(e) => handleChange("direccion", e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">Ciudad</label>
          <Input value={form.ciudad || ""} onChange={(e) => handleChange("ciudad", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Modelo</label>
          <Input value={form.modelo || ""} onChange={(e) => handleChange("modelo", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Técnico *</label>
          <Input value={form.tecnico || ""} onChange={(e) => handleChange("tecnico", e.target.value)} required />
        </div>
        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            value={form.estado || "pendiente"}
            onChange={(e) => handleChange("estado", e.target.value)}
            className="w-full h-10 px-3 rounded-md bg-background border border-border text-foreground text-sm"
          >
            {ESTADOS.filter(Boolean).map((e) => (
              <option key={e} value={e}>{e.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Plataforma</label>
          <Input value={form.plataforma || ""} onChange={(e) => handleChange("plataforma", e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Novedad</label>
          <Input value={form.novedad || ""} onChange={(e) => handleChange("novedad", e.target.value)} />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          <XCircle className="w-4 h-4 mr-1" />
          Cancelar
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
          Guardar
        </Button>
      </div>
    </form>
  )
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const [orders, setOrders] = useState<OrdenServicio[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(20)

  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("")
  const [filtroCiudad, setFiltroCiudad] = useState("")
  const [filtroTecnico, setFiltroTecnico] = useState("")
  const [filtroNumeroOrden, setFiltroNumeroOrden] = useState("")
  const [sortField, setSortField] = useState("created_at")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const [selectedOrder, setSelectedOrder] = useState<OrdenServicio | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<OrdenServicio | null>(null)

  const isAuthorized = user?.role === "superadmin" || user?.role === "admin"

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getServiceOrders({
        page,
        pageSize,
        search: searchInput,
        estado: filtroEstado,
        ciudad: filtroCiudad,
        tecnico: filtroTecnico,
        numero_orden: filtroNumeroOrden,
        sortField,
        sortOrder,
      })
      setOrders(result.orders)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch (e) {
      console.error(e)
    }
    setLoading(false)
  }, [page, pageSize, searchInput, filtroEstado, filtroCiudad, filtroTecnico, filtroNumeroOrden, sortField, sortOrder])

  useEffect(() => {
    async function init() {
      const userData = await getMe()
      if (!userData) { router.push("/portal"); return }
      setUser(userData.user)
      if (userData.user.role !== "superadmin" && userData.user.role !== "admin") {
        router.push("/portal/dashboard")
        return
      }
    }
    init()
  }, [router])

  useEffect(() => {
    if (user) fetchOrders()
  }, [user, fetchOrders])

  const handleSearch = () => {
    setPage(1)
    setSearchInput(search)
  }

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
    setPage(1)
  }

  const handleEdit = async (data: Partial<OrdenServicio>) => {
    if (!selectedOrder) return
    const result = await updateServiceOrder(selectedOrder.id, data)
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
      return
    }
    toast({ title: "Orden actualizada" })
    setShowEditModal(false)
    setSelectedOrder(null)
    fetchOrders()
  }

  const handleCreate = async (data: Partial<OrdenServicio>) => {
    const result = await createServiceOrder(data)
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
      return
    }
    toast({ title: "Orden creada" })
    setShowCreateModal(false)
    fetchOrders()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const result = await deleteServiceOrder(deleteTarget.id)
    if (result.error) {
      toast({ title: "Error", description: result.error, variant: "destructive" })
      return
    }
    toast({ title: "Orden eliminada" })
    setDeleteTarget(null)
    fetchOrders()
  }

  const handleLogout = () => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
    localStorage.removeItem("fermaj_session")
    router.push("/portal")
  }

  const getStatusBadge = (estado: string) => {
    const config = STATUS_CONFIG[estado] || { label: estado, bg: "bg-gray-500/20", text: "text-gray-400" }
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const SortHeader = ({ field, label }: { field: string; label: string }) => (
    <button onClick={() => toggleSort(field)} className="flex items-center gap-1 hover:text-foreground transition-colors">
      {label}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-primary" : "opacity-50"}`} />
    </button>
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-bold">Acceso Denegado</h2>
          <p className="text-muted-foreground">Solo administradores pueden acceder a esta sección</p>
          <p className="text-xs text-muted-foreground mt-2">
            Rol detectado: {user?.role || "ninguno"}
          </p>
          <Link href="/portal/dashboard">
            <Button className="mt-4">Volver al Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4yX0MySL8JwRWLy6HNVo15DHVDqngh.png"
              alt="Fermaj Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
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
            {isAuthorized && (
              <Link
                href="/portal/dashboard/clients"
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Clientes</span>
              </Link>
            )}
          </nav>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-primary font-medium">{user?.name?.[0]?.toUpperCase() || "?"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user?.name || "Usuario"}</p>
                <p className="text-xs text-muted-foreground truncate uppercase">{user?.role}</p>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Órdenes de Servicio</h1>
                <p className="text-sm text-muted-foreground">{total} órdenes registradas</p>
              </div>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Orden
            </Button>
          </div>
        </header>

        <main className="p-6 space-y-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar por NUI, cliente, dirección, técnico..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-9"
                  />
                </div>
                <select
                  value={filtroEstado}
                  onChange={(e) => { setFiltroEstado(e.target.value); setPage(1) }}
                  className="h-10 px-3 rounded-md bg-background border border-border text-foreground text-sm min-w-[140px]"
                >
                  <option value="">Todos los estados</option>
                  {ESTADOS.filter(Boolean).map((e) => (
                    <option key={e} value={e}>{e.replace("_", " ")}</option>
                  ))}
                </select>
                <Input
                  placeholder="Ciudad..."
                  value={filtroCiudad}
                  onChange={(e) => { setFiltroCiudad(e.target.value); setPage(1) }}
                  className="min-w-[120px]"
                />
                <Input
                  placeholder="Técnico..."
                  value={filtroTecnico}
                  onChange={(e) => { setFiltroTecnico(e.target.value); setPage(1) }}
                  className="min-w-[120px]"
                />
                <Input
                  placeholder="N. Orden..."
                  value={filtroNumeroOrden}
                  onChange={(e) => { setFiltroNumeroOrden(e.target.value); setPage(1) }}
                  className="min-w-[120px]"
                />
                <Button onClick={handleSearch}>
                  <Search className="w-4 h-4 mr-1" />
                  Buscar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{total} órdenes encontradas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <ClipboardList className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No hay órdenes de servicio</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-xs text-muted-foreground uppercase">
                        <th className="text-left py-3 px-4"><SortHeader field="id" label="ID" /></th>
                        <th className="text-left py-3 px-4"><SortHeader field="numero_orden" label="N. Orden" /></th>
                        <th className="text-left py-3 px-4"><SortHeader field="nombre_cliente" label="Cliente" /></th>
                        <th className="text-left py-3 px-4"><SortHeader field="nui" label="NUI" /></th>
                        <th className="text-left py-3 px-4"><SortHeader field="direccion" label="Dirección" /></th>
                        <th className="text-left py-3 px-4"><SortHeader field="ciudad" label="Ciudad" /></th>
                        <th className="text-left py-3 px-4">Teléfono</th>
                        <th className="text-left py-3 px-4"><SortHeader field="tecnico" label="Técnico" /></th>
                        <th className="text-left py-3 px-4"><SortHeader field="estado" label="Estado" /></th>
                        <th className="text-left py-3 px-4"><SortHeader field="created_at" label="Creado" /></th>
                        <th className="text-right py-3 px-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-border hover:bg-secondary/30 transition-colors text-sm">
                          <td className="py-3 px-4 font-mono text-xs">{order.id}</td>
                          <td className="py-3 px-4">{order.numero_orden || "-"}</td>
                          <td className="py-3 px-4 font-medium">{order.nombre_cliente || "-"}</td>
                          <td className="py-3 px-4 font-mono text-xs">{order.nui}</td>
                          <td className="py-3 px-4 max-w-[150px] truncate">{order.direccion}</td>
                          <td className="py-3 px-4">{order.ciudad || "-"}</td>
                          <td className="py-3 px-4">{order.telefono || "-"}</td>
                          <td className="py-3 px-4">{order.tecnico}</td>
                          <td className="py-3 px-4">{getStatusBadge(order.estado)}</td>
                          <td className="py-3 px-4 text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("es-CO")}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => { setSelectedOrder(order); setShowEditModal(true) }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-500 hover:text-red-600"
                                onClick={() => setDeleteTarget(order)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-4 border-t border-border">
                      <p className="text-sm text-muted-foreground">
                        Página {page} de {totalPages} ({total} órdenes)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page <= 1}
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={page >= totalPages}
                          onClick={() => setPage((p) => p + 1)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Orden #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>Modifica los campos de la orden de servicio</DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <OrderForm
              order={selectedOrder}
              onSave={handleEdit}
              onCancel={() => setShowEditModal(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Orden de Servicio</DialogTitle>
            <DialogDescription>Completa los campos para crear una nueva orden</DialogDescription>
          </DialogHeader>
          <OrderForm
            order={DEFAULT_ORDER}
            onSave={handleCreate}
            onCancel={() => setShowCreateModal(false)}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar orden?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminará la orden #{deleteTarget?.id} ({deleteTarget?.nui}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}