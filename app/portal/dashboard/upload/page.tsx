"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  CheckCircle,
  AlertCircle,
  Download,
  Loader2,
  Shield,
} from "lucide-react"
import { getMe } from "@/app/Services/api"

interface OrderRow {
  nui: string
  client_name: string
  client_phone: string
  address: string
  city: string
  model?: string
  service_type: string
  description?: string
  priority: number
}

interface OrderRowSpanish {
  nui: string
  nombre_cliente: string
  telefono: string
  direccion: string
  ciudad: string
  modelo?: string
  tipo_servicio: string
  descripcion?: string
  prioridad: number
}

interface ParseError {
  fila: number
  campo: string
  mensaje: string
}

interface UploadResult {
  insertados: number
  errores: number
  duplicados: number
}

type Stage = "idle" | "parsing" | "preview" | "uploading" | "success" | "error"

const CIUDADES_VALIDAS = ["bogota", "medellin", "cali"]
const TIPOS_VALIDOS = ["instalacion", "reparacion", "mantenimiento", "configuracion"]
const COLUMNAS_REQUERIDAS = ["nui", "nombre_cliente", "telefono", "direccion", "ciudad", "tipo_servicio", "prioridad"]
const MAX_FILAS = 500

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard" },
  { icon: FileSpreadsheet, label: "Subir Excel", href: "/portal/dashboard/upload", active: true },
  { icon: ClipboardList, label: "Órdenes", href: "/portal/dashboard/orders" },
  { icon: Settings, label: "Configuración", href: "/portal/dashboard/settings" },
]

function validateRow(row: Record<string, unknown>, index: number): ParseError[] {
  const errors: ParseError[] = []
  const fila = index + 2

  for (const campo of COLUMNAS_REQUERIDAS) {
    if (!row[campo] || String(row[campo]).trim() === "") {
      errors.push({ fila, campo, mensaje: `El campo "${campo}" es requerido` })
    }
  }

  if (row.ciudad && !CIUDADES_VALIDAS.includes(String(row.ciudad).toLowerCase().trim())) {
    errors.push({ fila, campo: "ciudad", mensaje: `Ciudad inválida: "${row.ciudad}". Use: Bogota, Medellin o Cali` })
  }

  if (row.tipo_servicio && !TIPOS_VALIDOS.includes(String(row.tipo_servicio).toLowerCase().trim())) {
    errors.push({ fila, campo: "tipo_servicio", mensaje: `Tipo inválido: "${row.tipo_servicio}". Use: instalacion, reparacion, mantenimiento, configuracion` })
  }

  const prio = Number(row.prioridad)
  if (isNaN(prio) || ![1, 2].includes(prio)) {
    errors.push({ fila, campo: "prioridad", mensaje: `Prioridad inválida: "${row.prioridad}". Use 1 (normal) o 2 (urgente)` })
  }

  if (row.telefono) {
    const tel = String(row.telefono).replace(/\s/g, "")
    if (!/^\d{10}$/.test(tel)) {
      errors.push({ fila, campo: "telefono", mensaje: `Teléfono inválido: "${row.telefono}". Debe tener 10 dígitos` })
    }
  }

  return errors
}

export default function UploadPage() {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stage, setStage] = useState<Stage>("idle")
  const [fileName, setFileName] = useState("")
  const [rows, setRows] = useState<OrderRow[]>([])
  const [parseErrors, setParseErrors] = useState<ParseError[]>([])
  const [result, setResult] = useState<UploadResult | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  useEffect(() => {
    async function loadUser() {
      const userData = await getMe()
      if (!userData) {
        router.push("/portal")
        return
      }
      setUser(userData.user)
      setLoading(false)
    }
    loadUser()
  }, [router])

  const parseFile = useCallback((file: File) => {
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      alert("Solo se aceptan archivos .xlsx o .xls")
      return
    }

    setFileName(file.name)
    setStage("parsing")
    setParseErrors([])
    setRows([])

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: "array" })

        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        const raw: Record<string, unknown>[] = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false })

        if (raw.length === 0) {
          setParseErrors([{ fila: 1, campo: "archivo", mensaje: "El archivo está vacío o no tiene datos después del encabezado." }])
          setStage("error")
          return
        }

        if (raw.length > MAX_FILAS) {
          setParseErrors([{ fila: 1, campo: "archivo", mensaje: `El archivo tiene ${raw.length} filas. El máximo permitido es ${MAX_FILAS}.` }])
          setStage("error")
          return
        }

        const columnas = Object.keys(raw[0])
        const faltantes = COLUMNAS_REQUERIDAS.filter(c => !columnas.includes(c))
        if (faltantes.length > 0) {
          setParseErrors([{ fila: 1, campo: "encabezado", mensaje: `Columnas faltantes: ${faltantes.join(", ")}. ¿Usaste la plantilla oficial?` }])
          setStage("error")
          return
        }

        const allErrors: ParseError[] = []
        const validRows: OrderRow[] = []

        raw.forEach((row, i) => {
          const rowErrors = validateRow(row, i)
          if (rowErrors.length > 0) {
            allErrors.push(...rowErrors)
          } else {
            // Mapear columnas español → inglés para el API
            const rowES = row as unknown as OrderRowSpanish
            validRows.push({
              nui: String(rowES.nui).trim(),
              client_name: String(rowES.nombre_cliente).trim(),
              client_phone: String(rowES.telefono).replace(/\s/g, ""),
              address: String(rowES.direccion).trim(),
              city: String(rowES.ciudad).trim(),
              model: rowES.modelo ? String(rowES.modelo).trim() : undefined,
              service_type: String(rowES.tipo_servicio).toLowerCase().trim(),
              description: rowES.descripcion ? String(rowES.descripcion).trim() : undefined,
              priority: Number(rowES.prioridad),
            })
          }
        })

        setParseErrors(allErrors)
        setRows(validRows)
        setStage("preview")
      } catch {
        setParseErrors([{ fila: 0, campo: "archivo", mensaje: "No se pudo leer el archivo. Asegúrate de que no esté corrupto." }])
        setStage("error")
      }
    }
    reader.readAsArrayBuffer(file)
  }, [])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) parseFile(file)
  }, [parseFile])

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) parseFile(file)
  }

  const handleUpload = async () => {
    if (rows.length === 0) return
    setStage("uploading")
    setUploadProgress(0)

    const interval = setInterval(() => {
      setUploadProgress(p => Math.min(p + 12, 85))
    }, 200)

    try {
      const res = await fetch("/api/orders/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ordenes: rows }),
      })

      clearInterval(interval)
      setUploadProgress(100)

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.message || "Error al subir órdenes")
      }

      const data: UploadResult = await res.json()
      setResult(data)
      setStage("success")
    } catch (err) {
      clearInterval(interval)
      setParseErrors([{
        fila: 0,
        campo: "servidor",
        mensaje: err instanceof Error ? err.message : "Error de conexión"
      }])
      setStage("error")
    }
  }

  const reset = () => {
    setStage("idle")
    setFileName("")
    setRows([])
    setParseErrors([])
    setResult(null)
    setUploadProgress(0)
    if (fileRef.current) fileRef.current.value = ""
  }

  const handleLogout = () => {
    localStorage.removeItem("fermaj_session")
    router.push("/portal")
  }

  const isSuperadmin = user?.role === "superadmin" || user?.organization_id === null

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-500"><CheckCircle className="w-3 h-3" />Completada</span>
      case "pending":
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-500"><AlertCircle className="w-3 h-3" />Pendiente</span>
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-500/20 text-gray-500">{status}</span>
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 transition-transform`} aria-hidden={!sidebarOpen}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <Image src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4yX0MySL8JwRWLy6HNVo15DHVDqngh.png" alt="Fermaj Logo" width={120} height={40} className="h-10 w-auto" />
          </div>
          <nav className="flex-1 p-4 space-y-2" aria-label="Menú de navegación">
            {sidebarItems.map((item) => (
              <Link key={item.label} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${item.active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            {(user?.role === "superadmin" || user?.role === "admin") && (
              <>
                <Link href="/portal/dashboard/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Admin</span>
                </Link>
                <Link href="/portal/dashboard/clients" className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                  <Users className="w-5 h-5" />
                  <span className="font-medium">Clientes</span>
                </Link>
              </>
            )}
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
        <header className="sticky top-0 z-40 bg-background border-b border-border">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label={sidebarOpen ? "Cerrar menú lateral" : "Abrir menú lateral"} aria-expanded={sidebarOpen}>
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cargar Órdenes</h1>
                <p className="text-sm text-muted-foreground">Sube el archivo Excel con los registros a gestionar</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <span className="text-sm text-blue-700 dark:text-blue-300 flex-1">¿Primera vez? Descarga la plantilla oficial con ejemplos</span>
            <a href="/plantilla/fermaj_plantilla_ordenes.xlsx" download className="text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline flex items-center gap-1">
              Descargar plantilla <Download className="w-4 h-4" />
            </a>
          </div>

          {(stage === "idle" || stage === "parsing") && (
            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileRef.current?.click()}
              className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-16 cursor-pointer transition-all ${dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-border hover:border-blue-400 hover:bg-secondary/50"}`}
            >
              <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={onFileChange} aria-label="Seleccionar archivo Excel" />
              {stage === "parsing" ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <p className="text-sm text-muted-foreground">Leyendo archivo...</p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 bg-secondary rounded-2xl flex items-center justify-center mb-4">
                    <Upload className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="text-base font-medium text-foreground">Arrastra tu archivo aquí</p>
                  <p className="text-sm text-muted-foreground mt-1">o haz clic para seleccionar — .xlsx o .xls</p>
                </>
              )}
            </div>
          )}

          {stage === "preview" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{fileName}</p>
                    <p className="text-xs text-muted-foreground">{rows.length} registros válidos{parseErrors.length > 0 && ` · ${parseErrors.length} con errores (se omitirán)`}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={reset} className="text-xs text-muted-foreground underline">Cambiar archivo</Button>
              </div>

              {parseErrors.length > 0 && (
                <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-2">Filas con errores — se omitirán al cargar</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {parseErrors.slice(0, 10).map((e, i) => (
                      <p key={i} className="text-xs text-amber-700 dark:text-amber-400">Fila {e.fila} · {e.campo}: {e.mensaje}</p>
                    ))}
                    {parseErrors.length > 10 && <p className="text-xs text-amber-600">... y {parseErrors.length - 10} errores más</p>}
                  </div>
                </div>
              )}

              <div className="border border-border rounded-xl overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary border-b border-border">
                        {["NUI", "Cliente", "Teléfono", "Ciudad", "Tipo", "Prioridad"].map(h => (
                          <th key={h} scope="col" className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {rows.slice(0, 8).map((row, i) => (
                        <tr key={i} className="hover:bg-secondary/50">
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{row.nui}</td>
                          <td className="px-4 py-3">{row.client_name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.client_phone}</td>
                          <td className="px-4 py-3 text-muted-foreground">{row.city}</td>
                          <td className="px-4 py-3"><span className="inline-flex px-2 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{row.service_type}</span></td>
                          <td className="px-4 py-3"><span className={`inline-flex px-2 py-0.5 rounded-full text-xs ${row.priority === 2 ? "bg-red-500/20 text-red-500" : "bg-gray-500/20 text-gray-500"}`}>{row.priority === 2 ? "Urgente" : "Normal"}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {rows.length > 8 && <div className="px-4 py-2 bg-secondary text-xs text-muted-foreground">Mostrando 8 de {rows.length} registros</div>}
              </div>

              <div className="flex gap-3">
                <Button onClick={handleUpload} disabled={rows.length === 0} className="flex-1">
                  Cargar {rows.length} orden{rows.length !== 1 ? "es" : ""}
                </Button>
                <Button variant="outline" onClick={reset}>Cancelar</Button>
              </div>
            </div>
          )}

          {stage === "uploading" && (
            <div className="flex flex-col items-center py-16 gap-6">
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-border" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${2 * Math.PI * 28 * (1 - uploadProgress / 100)}`} strokeLinecap="round" className="text-primary transition-all" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">{uploadProgress}%</span>
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Cargando órdenes...</p>
                <p className="text-sm text-muted-foreground mt-1">Guardando {rows.length} registros</p>
              </div>
            </div>
          )}

          {stage === "success" && result && (
            <div className="flex flex-col items-center py-12 gap-6">
              <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-foreground">¡Órdenes cargadas correctamente!</p>
                <p className="text-sm text-muted-foreground mt-2">Las órdenes ya están en el sistema.</p>
              </div>
              <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
                <div className="text-center p-4 bg-green-500/10 rounded-xl">
                  <p className="text-2xl font-bold text-green-500">{result.insertados}</p>
                  <p className="text-xs text-green-600 mt-1">Insertadas</p>
                </div>
                <div className="text-center p-4 bg-amber-500/10 rounded-xl">
                  <p className="text-2xl font-bold text-amber-500">{result.duplicados}</p>
                  <p className="text-xs text-amber-600 mt-1">Duplicadas</p>
                </div>
                <div className="text-center p-4 bg-red-500/10 rounded-xl">
                  <p className="text-2xl font-bold text-red-500">{result.errores}</p>
                  <p className="text-xs text-red-600 mt-1">Con errores</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => router.push("/portal/dashboard/orders")}>Ver órdenes</Button>
                <Button variant="outline" onClick={reset}>Cargar otro archivo</Button>
              </div>
            </div>
          )}

          {stage === "error" && (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Error al procesar el archivo</p>
                {parseErrors[0] && <p className="text-sm text-red-500 mt-1">{parseErrors[0].mensaje}</p>}
              </div>
              <Button onClick={reset}>Intentar de nuevo</Button>
            </div>
          )}
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)} role="presentation" aria-hidden="true" />}
    </div>
  )
}