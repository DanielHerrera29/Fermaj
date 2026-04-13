"use client"

import { MapPin, Check, TrendingUp } from "lucide-react"

const cities = [
  { name: "Bogotá", region: "Cundinamarca", status: "Operativo" },
  { name: "Medellín", region: "Antioquia", status: "Operativo" },
  { name: "Cali", region: "Valle del Cauca", status: "Operativo" },
]

const features = [
  "10 colaboradores especializados",
  "Experiencia operativa continua",
  "Enfoque en eficiencia y eficacia",
  "Trato profesional y ejecución precisa",
  "Proyección de expansión nacional",
  "Capacitación constante del equipo",
]

export function CoverageSection() {
  return (
    <section id="cobertura" className="py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Cobertura Nacional</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6 text-balance">
              Presentes en las principales ciudades de Colombia
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contamos con una red de técnicos certificados estratégicamente ubicados 
              en todo el país para garantizar tiempos de respuesta óptimos y 
              servicios de la más alta calidad.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cities Grid */}
          <div className="bg-card rounded-2xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Ciudades con presencia activa
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {cities.map((city) => (
                <div 
                  key={city.name}
                  className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <p className="font-medium text-foreground text-sm">{city.name}</p>
                  <p className="text-xs text-muted-foreground">{city.region}</p>
                  <p className="text-xs text-primary mt-1">{city.technicians} técnicos</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
