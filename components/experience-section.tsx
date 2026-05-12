"use client"

import Image from "next/image"
import { Award } from "lucide-react"
import { useRef, useEffect, useState } from "react"

const partners = [
  { name: "Clientes Finales" },
  { name: "Marcas y Fabricantes" },
  { name: "Clientes Corporativos" },
]

const projects = [
  {
    title: "Instalaciones Residenciales",
    description: "Servicio personalizado para usuarios finales con instalación de televisores, lavadoras y neveras en hogares.",
    category: "Residencial",
    year: "2024",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "Proyectos Corporativos",
    description: "Instalación de pantallas publicitarias y equipos tecnológicos para empresas y oficinas.",
    category: "Corporativo",
    year: "2024",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&auto=format&fit=crop&q=60"
  },
  {
    title: "Marcas y Fabricantes",
    description: "Alianzas estratégicas con marcas para instalación de productos en puntos de venta y domicilios.",
    category: "Retail",
    year: "2024",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60"
  },
]

const stats = [
  { value: "5+", label: "Años de experiencia", suffix: "" },
  { value: "10", label: "Técnicos especializados", suffix: "" },
  { value: "3", label: "Ciudades con presencia", suffix: "" },
  { value: "100", label: "Satisfacción garantizada", suffix: "%" },
]

function useCountUp(end: number, duration: number = 2000, start: boolean = false) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (!start) return
    
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration, start])
  
  return count
}

export function ExperienceSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => observer.disconnect()
  }, [])

  return (
    <section id="experiencia" className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(200,255,0,0.08),transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,rgba(200,255,0,0.05),transparent_60%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs text-primary font-medium uppercase tracking-wider">Nuestra Experiencia</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Tipos de{" "}
            <span className="text-primary">clientes</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Adaptamos nuestros procesos y soluciones según las necesidades 
            específicas de cada tipo de cliente.
          </p>
        </div>

        {/* Partners Logos - Animated Marquee */}
        <div className="relative mb-20 py-8 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          
          <div className="flex animate-marquee">
            {[...partners, ...partners].map((partner, index) => (
              <div 
                key={`${partner.name}-${index}`}
                className="flex-shrink-0 mx-8 px-8 py-4 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <span className="text-xl font-bold text-foreground whitespace-nowrap">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {projects.map((project) => (
            <div 
              key={project.title}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={600}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
              </div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-primary-foreground bg-primary px-2 py-1 rounded-full">
                    {project.category}
                  </span>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded-full">{project.year}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row with Lottie */}
        <div ref={sectionRef} className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-3xl" />
          
          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-8 p-8 lg:p-12 rounded-3xl border border-border bg-card/50 backdrop-blur-sm">
            {/* Lottie Animation */}
            <div className="lg:col-span-1 flex items-center justify-center">
              <div className="w-32 h-32 flex items-center justify-center">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-secondary flex items-center justify-center shadow-xl">
                  <Award className="w-14 h-14 text-primary" />
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat) => {
                const numericValue = parseInt(stat.value.replace(/\D/g, ""))
                const hasPlus = stat.value.includes("+")
                const count = useCountUp(numericValue, 2000, isVisible)
                
                return (
                  <div key={stat.label} className="text-center">
                    <p className="text-4xl lg:text-5xl font-bold text-primary">
                      {count}{hasPlus && "+"}
                    </p>
                    <p className="text-muted-foreground mt-2 text-sm lg:text-base">{stat.label}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for marquee animation */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </section>
  )
}
