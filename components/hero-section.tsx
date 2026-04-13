"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,255,0,0.12),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,255,0,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-sm text-primary font-medium">Desde 2020 en el mercado colombiano</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance leading-tight">
              Instalaciones profesionales{" "}
              <span className="relative">
                <span className="text-primary">a tiempo</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                  <path d="M2 10C50 4 150 4 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/50" />
                </svg>
              </span>
              {" "}y bien hecho
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Empresa colombiana especializada en instalación de productos tecnológicos y electrodomésticos. 
              Equipo calificado, servicios eficientes y resultados de alta calidad en Bogotá, Medellín y Cali.
            </p>

            {/* Feature List */}
            <div className="flex flex-wrap gap-4 mb-8">
              {["App propia de evidencias", "Herramientas de alto desempeño", "Procesos personalizados"].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="#contacto">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                  Solicitar Cotización
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#experiencia">
                <Button size="lg" variant="outline" className="gap-2 h-12 px-8 text-base border-border hover:bg-secondary">
                  <Play className="h-4 w-4" />
                  Ver Proyectos
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Clientes corporativos y marcas</p>
              <div className="flex flex-wrap items-center gap-6 opacity-60">
                {["Clientes Finales", "Marcas", "Corporativos"].map((brand) => (
                  <span key={brand} className="text-lg font-bold text-foreground/70">{brand}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Lottie Animation */}
          <div className="relative lg:pl-8">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-75" />
              
              {/* Main Lottie */}
              <div className="relative bg-card/50 backdrop-blur-sm rounded-3xl border border-border p-8 shadow-2xl">
                <DotLottieReact
                  src="https://lottie.host/f6ebe8a7-67ed-4c15-bca6-79a3adcf33c5/5VdXfuhb1J.lottie"
                  loop
                  autoplay
                  className="w-full h-auto"
                />
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -bottom-6 -left-6 bg-card rounded-2xl p-4 border border-border shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">10</span>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">Técnicos</p>
                    <p className="text-xs text-muted-foreground">Especializados</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-semibold shadow-lg">
                100% Calidad
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  )
}
