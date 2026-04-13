"use client"

import { Smartphone, Cloud, BarChart3, Shield, Clock, Headphones } from "lucide-react"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

const technologies = [
  {
    icon: Smartphone,
    title: "App Móvil para Técnicos",
    description: "Aplicación móvil propia para gestión de órdenes de servicio, reportes fotográficos y firmas digitales.",
  },
  {
    icon: Cloud,
    title: "Plataforma en la Nube",
    description: "Sistema de gestión centralizado con acceso 24/7 para clientes y administradores.",
  },
  {
    icon: BarChart3,
    title: "Dashboard de Reportes",
    description: "Reportes en tiempo real de instalaciones, métricas de rendimiento y KPIs personalizados.",
  },
  {
    icon: Shield,
    title: "Trazabilidad Completa",
    description: "Seguimiento de cada instalación desde la asignación hasta la entrega con evidencia documental.",
  },
  {
    icon: Clock,
    title: "Programación Inteligente",
    description: "Sistema de asignación automática de técnicos según ubicación, disponibilidad y especialidad.",
  },
  {
    icon: Headphones,
    title: "Soporte Multicanal",
    description: "Atención al cliente por WhatsApp, teléfono, correo y portal web con tiempos de respuesta garantizados.",
  },
]

const tools = [
  "Herramientas Milwaukee y DeWalt profesionales",
  "Equipos de medición calibrados",
  "Vehículos identificados y equipados",
  "Uniformes y EPP completos",
  "Tablets para registro digital",
  "GPS en tiempo real",
]

export function TechnologySection() {
  return (
    <section id="tecnologia" className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(200,255,0,0.05),transparent_70%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs text-primary font-medium uppercase tracking-wider">Tecnología e Innovación</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Equipados con lo último en{" "}
            <span className="text-primary">tecnología</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Invertimos constantemente en herramientas y sistemas que nos permiten 
            ofrecer servicios de instalación más eficientes y de mayor calidad.
          </p>
        </div>

        {/* Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {technologies.map((tech, index) => (
            <div 
              key={tech.title}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <tech.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{tech.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tools Section with Lottie */}
        <div className="bg-gradient-to-br from-card via-card to-secondary/30 rounded-3xl border border-border p-8 lg:p-12 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(200,255,0,0.02)_50%,transparent_75%,transparent)] bg-[size:40px_40px]" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">
                Herramientas{" "}
                <span className="text-primary">profesionales</span>
              </h3>
              <p className="text-muted-foreground mb-8 text-lg leading-relaxed">
                Nuestros técnicos están equipados con las mejores herramientas del mercado 
                para garantizar instalaciones precisas, seguras y duraderas.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tools.map((tool) => (
                  <div key={tool} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    <span className="text-sm text-foreground">{tool}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Lottie Animation */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-75" />
              <div className="relative bg-secondary/50 rounded-2xl p-6 border border-border">
                <DotLottieReact
                  src="https://lottie.host/e59e8b0a-a773-4c66-b829-6c37383c3dc5/7lrTHVMjPk.lottie"
                  loop
                  autoplay
                  className="w-full h-auto"
                />
                <div className="mt-4 text-center">
                  <p className="font-semibold text-foreground">App Fermaj Técnicos</p>
                  <p className="text-sm text-muted-foreground">Disponible en iOS y Android</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
