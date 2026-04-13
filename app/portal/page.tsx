"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, ArrowLeft } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

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

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email && password) {
      // Store demo session
      localStorage.setItem("fermaj_session", JSON.stringify({ 
        email, 
        name: "Cliente Demo",
        company: "Empresa Demo S.A.S."
      }))
      router.push("/portal/dashboard")
    } else {
      setError("Por favor ingrese sus credenciales")
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
              <label className="text-sm font-medium text-foreground mb-2 block">
                Correo Electrónico
              </label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@empresa.com"
                required
                className="bg-card border-border h-11"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-card border-border h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-sm text-muted-foreground">Recordarme</span>
              </label>
              <Link href="#" className="text-sm text-primary hover:underline">
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

          {/* Demo Notice */}
          <div className="mt-8 p-4 rounded-lg bg-secondary/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Modo Demo:</strong> Ingrese cualquier correo y contraseña para acceder al portal.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Lottie Animation */}
      <div className="hidden lg:flex flex-1 relative bg-gradient-to-br from-secondary via-background to-secondary items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(200,255,0,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(200,255,0,0.05),transparent_50%)]" />
        
        <div className="relative z-10 w-full max-w-lg px-8">
          <DotLottieReact
            src="https://lottie.host/4db68bbd-31f6-4cd8-84eb-189571aa9c10/7SwMGdv3hC.lottie"
            loop
            autoplay
            className="w-full"
          />
          
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
