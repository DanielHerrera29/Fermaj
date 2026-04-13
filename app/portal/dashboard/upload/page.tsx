"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  Trash2,
} from "lucide-react"

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/portal/dashboard" },
  { icon: FileSpreadsheet, label: "Subir Excel", href: "/portal/dashboard/upload", active: true },
  { icon: ClipboardList, label: "Órdenes", href: "/portal/dashboard/orders" },
  { icon: Users, label: "Clientes", href: "/portal/dashboard/clients" },
  { icon: Settings, label: "Configuración", href: "/portal/dashboard/settings" },
]

interface UploadedFile {
  name: string
  size: string
  status: "uploading" | "success" | "error"
  rows?: number
}

export default function UploadPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(droppedFiles)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      processFiles(selectedFiles)
    }
  }

  const processFiles = (selectedFiles: File[]) => {
    const newFiles: UploadedFile[] = selectedFiles.map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
      status: "uploading" as const,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload
    newFiles.forEach((file, index) => {
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.name === file.name
              ? { ...f, status: "success" as const, rows: Math.floor(Math.random() * 100) + 20 }
              : f
          )
        )
      }, 1500 + index * 500)
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName))
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
              Subir Excel
            </h1>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {/* Instructions */}
            <Card className="bg-card border-border mb-6">
              <CardHeader>
                <CardTitle className="text-foreground">Cargar Órdenes de Instalación</CardTitle>
                <CardDescription>
                  Suba archivos Excel (.xlsx, .xls) o CSV con las órdenes de instalación
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4 p-4 rounded-lg bg-secondary/50">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground mb-1">Formato requerido:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Columnas: Nombre, Teléfono, Dirección, Ciudad, Servicio, Fecha</li>
                      <li>Primera fila debe contener los encabezados</li>
                      <li>Máximo 1000 registros por archivo</li>
                    </ul>
                    <Button variant="link" className="p-0 h-auto mt-2 text-primary">
                      <Download className="w-4 h-4 mr-1" />
                      Descargar plantilla
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Zone */}
            <Card className="bg-card border-border mb-6">
              <CardContent className="p-6">
                <div
                  className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    multiple
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                  />
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-lg font-medium text-foreground mb-2">
                    Arrastra archivos aquí
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Formatos aceptados: .xlsx, .xls, .csv
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Files */}
            {files.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-foreground">Archivos Cargados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {files.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.size}
                              {file.rows && ` • ${file.rows} registros`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {file.status === "uploading" && (
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          )}
                          {file.status === "success" && (
                            <CheckCircle className="w-5 h-5 text-primary" />
                          )}
                          {file.status === "error" && (
                            <AlertCircle className="w-5 h-5 text-destructive" />
                          )}
                          <button
                            onClick={() => removeFile(file.name)}
                            className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {files.some((f) => f.status === "success") && (
                    <div className="mt-6 flex justify-end gap-3">
                      <Button variant="outline">Cancelar</Button>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Procesar Órdenes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
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
