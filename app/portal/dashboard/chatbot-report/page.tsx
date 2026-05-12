"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  FileSpreadsheet,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  MessageSquare,
  ArrowLeft,
  Send,
  CheckCircle,
  XCircle,
  Phone,
  Clock,
  User,
  Shield,
} from "lucide-react"
import { getMe } from "@/app/Services/api"

interface ChatSession {
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

interface ChatMessage {
  id: string
  session_id: string
  sender: "bot" | "user"
  message: string
  direction: "outbound" | "inbound"
  created_at: string
}

export default function ChatbotReportPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [sending, setSending] = useState(false)
  const [filterEstado, setFilterEstado] = useState<string>("")

  useEffect(() => {
    async function loadData() {
      const userData = await getMe()
      if (!userData) {
        router.push("/portal")
        return
      }
      setUser(userData.user)
      await loadSessions()
      setLoading(false)
    }
    loadData()
  }, [router])

  async function loadSessions() {
    try {
      const params = new URLSearchParams()
      if (filterEstado) params.set("estado", filterEstado)
      
      const res = await fetch(`/api/chat/sessions?${params}`, { credentials: "include" })
      const data = await res.json()
      if (data.sessions) setSessions(data.sessions)
    } catch (e) {
      console.error("Error loading sessions:", e)
    }
  }

  async function loadMessages(sessionId: string) {
    try {
      const res = await fetch(`/api/chat/messages?session_id=${sessionId}`, { credentials: "include" })
      const data = await res.json()
      if (data.messages) setMessages(data.messages)
    } catch (e) {
      console.error("Error loading messages:", e)
    }
  }

  async function handleSelectSession(session: ChatSession) {
    setSelectedSession(session)
    await loadMessages(session.id)
  }

  async function handleSendReply() {
    if (!replyMessage.trim() || !selectedSession) return
    
    setSending(true)
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          session_id: selectedSession.id,
          action: "responder",
          message: replyMessage,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setReplyMessage("")
        await loadMessages(selectedSession.id)
        await loadSessions()
      }
    } catch (e) {
      console.error("Error sending reply:", e)
    }
    setSending(false)
  }

  async function handleConfirm() {
    if (!selectedSession) return
    
    setSending(true)
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          session_id: selectedSession.id,
          action: "confirm",
        }),
      })
      const data = await res.json()
      if (data.success) {
        await loadSessions()
        if (selectedSession) await loadMessages(selectedSession.id)
      }
    } catch (e) {
      console.error("Error confirming:", e)
    }
    setSending(false)
  }

  async function handleClose() {
    if (!selectedSession) return
    
    setSending(true)
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          session_id: selectedSession.id,
          action: "close",
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSelectedSession(null)
        setMessages([])
        await loadSessions()
      }
    } catch (e) {
      console.error("Error closing:", e)
    }
    setSending(false)
  }

  const handleLogout = async () => {
    document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
    localStorage.removeItem("fermaj_session")
    router.push("/portal")
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge variant="secondary">Pendiente</Badge>
      case "contactado":
        return <Badge className="bg-blue-500">Contactado</Badge>
      case "respondido":
        return <Badge className="bg-yellow-500">Respondido</Badge>
      case "confirmado":
        return <Badge className="bg-green-500">Confirmado</Badge>
      case "cerrado":
        return <Badge className="bg-gray-500">Cerrado</Badge>
      default:
        return <Badge>{estado}</Badge>
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("es-CO", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
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
            <Link
              href="/portal/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </Link>
            <Link
              href="/portal/dashboard/upload"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <FileSpreadsheet className="w-5 h-5" />
              <span className="font-medium">Subir Excel</span>
            </Link>
            <Link
              href="/portal/dashboard/orders"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <ClipboardList className="w-5 h-5" />
              <span className="font-medium">Órdenes</span>
            </Link>
            <Link
              href="/portal/dashboard/chatbot-report"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary"
            >
              <MessageSquare className="w-5 h-5" />
              <span className="font-medium">Chatbot</span>
            </Link>
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
              <Link href="/portal/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Centro de Operaciones
                </h1>
                <p className="text-sm text-muted-foreground">
                  Chatbot WhatsApp
                </p>
              </div>
            </div>
            <select
              className="px-3 py-2 border rounded-md"
              value={filterEstado}
              onChange={(e) => {
                setFilterEstado(e.target.value)
                loadSessions()
              }}
            >
              <option value="">Todas</option>
              <option value="pendiente">Pendiente</option>
              <option value="contactado">Contactado</option>
              <option value="respondido">Respondido</option>
              <option value="confirmado">Confirmado</option>
              <option value="cerrado">Cerrado</option>
            </select>
          </div>
        </header>

        <main className="flex h-[calc(100vh-73px)]">
          <div className="w-80 border-r border-border bg-card overflow-y-auto">
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold">Conversaciones ({sessions.length})</h2>
            </div>
            <div className="divide-y">
              {sessions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No hay conversaciones
                </div>
              ) : (
                sessions.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className={`w-full p-4 text-left hover:bg-secondary transition-colors ${
                      selectedSession?.id === session.id ? "bg-secondary" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="font-medium truncate">
                        {session.client_name || session.telefono}
                      </div>
                      {getEstadoBadge(session.estado)}
                    </div>
                    <div className="text-sm text-muted-foreground truncate mt-1">
                      {session.service_type} • {session.city}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(session.created_at)}
                    </div>
                    {session.modo_test && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        TEST
                      </Badge>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedSession ? (
              <>
                <div className="p-4 border-b border-border bg-card">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">
                        {selectedSession.client_name || selectedSession.telefono}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedSession.service_type} • {selectedSession.city}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {selectedSession.telefono}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {selectedSession.estado !== "confirmado" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={handleConfirm}
                          disabled={sending}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Confirmar
                        </Button>
                      )}
                      {selectedSession.estado !== "cerrado" && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={handleClose}
                          disabled={sending}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Cerrar
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "bot" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.sender === "bot"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {msg.sender === "bot" ? "🤖" : "👤"} •{" "}
                          {formatDate(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-border bg-card">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Escribir mensaje..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                    />
                    <Button onClick={handleSendReply} disabled={sending || !replyMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Selecciona una conversación</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}