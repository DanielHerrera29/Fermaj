"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft, ClipboardList, TrendingUp, Shield } from "lucide-react"

export default function PortalLoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión")
        setIsLoading(false)
        return
      }

      localStorage.setItem("fermaj_session", JSON.stringify({
        ...data.user,
        token: data.session?.token,
      }))

      router.push("/portal/dashboard")
    } catch {
      setError("Error de conexión")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="w-full max-w-md mx-auto">
          {/* Back Button */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          {/* Logo */}
          <div className="mb-8">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4yX0MySL8JwRWLy6HNVo15DHVDqngh.png"
              alt="Fermaj Logo"
              width={140}
              height={50}
              className="h-12 w-auto"
              priority
              fetchPriority="high"
            />
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Portal de Clientes
            </h1>
            <p className="text-muted-foreground">
              Ingrese sus credenciales para acceder al panel de administración
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="text-sm font-medium text-foreground mb-2 block">
                Correo Electrónico
              </label>
              <Input
                id="login-email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@empresa.com"
                required
                autoComplete="email"
                className="bg-card border-border h-11"
              />
            </div>

            <div>
              <label htmlFor="login-password" className="text-sm font-medium text-foreground mb-2 block">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="bg-card border-border h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary rounded"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" aria-label="Recordarme" />
                <span className="text-sm text-muted-foreground">Recordarme</span>
              </label>
              <Link href="#" className="text-sm text-primary hover:underline" aria-label="Recuperar contraseña">
                Olvidé mi contraseña
              </Link>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>
        </div>
      </div>

      {/* Right Side - Lottie Animation */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-secondary via-background to-secondary items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(200,255,0,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(200,255,0,0.05),transparent_50%)]" />
        
        <div className="relative z-10 w-full max-w-lg px-8">
          <div className="flex items-center justify-center">
            <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary flex items-center justify-center shadow-2xl">
              <ClipboardList className="w-24 h-24 text-primary" />
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Gestiona tus instalaciones
            </h2>
            <p className="text-muted-foreground">
              Accede a reportes, seguimiento de órdenes y gestión de clientes en tiempo real
            </p>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-12 right-12 z-20">
          <div className="bg-card/80 backdrop-blur-sm rounded-xl p-6 border border-border">
            <p className="text-lg font-medium text-foreground mb-2">
              &ldquo;El portal de Fermaj nos ha facilitado enormemente la gestión de nuestras instalaciones.&rdquo;
            </p>
            <p className="text-sm text-muted-foreground">
              — Director de Operaciones, Samsung Colombia
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
