"use client"

import { Tv, Monitor, Refrigerator, Wind, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const services = [
  {
    icon: Tv,
    title: "Televisores",
    description: "Instalación profesional de televisores de todas las marcas y tamaños, incluido montaje en pared y configuración completa de Smart TV.",
    features: ["Montaje en pared", "Configuración Smart TV", "Ocultar cableado"],
  },
  {
    icon: Monitor,
    title: "Pantallas Publicitarias",
    description: "Instalación de pantallas LED y displays publicitarios para puntos de venta, centros comerciales y espacios corporativos.",
    features: ["Pantallas LED", "Video walls", "Señalización digital"],
  },
  {
    icon: Wind,
    title: "Lavadoras",
    description: "Instalación de lavadoras de todas las marcas con conexiones hidráulicas y eléctricas certificadas.",
    features: ["Conexión hidráulica", "Nivelación", "Pruebas de funcionamiento"],
  },
  {
    icon: Refrigerator,
    title: "Neveras",
    description: "Instalación y configuración de neveras y refrigeradores domésticos e industriales.",
    features: ["Nivelación", "Conexión eléctrica", "Verificación térmica"],
  },
]

export function ServicesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="servicios" className="py-24 bg-secondary/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(200,255,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(200,255,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs text-primary font-medium uppercase tracking-wider">Nuestros Servicios</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Soluciones integrales de{" "}
            <span className="text-primary">instalación</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Somos especialistas en la instalación de productos tecnológicos y electrodomésticos. 
            Nos proyectamos a ampliar nuestro portafolio mediante capacitación continua.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className={`relative h-full p-6 rounded-2xl border transition-all duration-500 ${
                hoveredIndex === index 
                  ? "bg-card border-primary/50 shadow-xl shadow-primary/10 -translate-y-2" 
                  : "bg-card/50 border-border hover:bg-card"
              }`}>
                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 ${
                  hoveredIndex === index
                    ? "bg-primary text-primary-foreground scale-110"
                    : "bg-primary/10 text-primary"
                }`}>
                  <service.icon className="h-7 w-7" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {service.features.map((feature) => (
                    <span 
                      key={feature}
                      className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <Link 
                  href="#contacto"
                  className={`inline-flex items-center gap-1 text-sm font-medium transition-all duration-300 ${
                    hoveredIndex === index ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Solicitar
                  <ArrowRight className={`w-4 h-4 transition-transform duration-300 ${
                    hoveredIndex === index ? "translate-x-1" : ""
                  }`} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            ¿Necesitas un servicio que no está listado?
          </p>
          <Link 
            href="#contacto"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
          >
            Contáctanos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
