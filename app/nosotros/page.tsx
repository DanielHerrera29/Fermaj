import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Users, Award, Target, Heart, Shield, Zap } from "lucide-react"
import Image from "next/image"

const values = [
  {
    icon: Target,
    title: "Compromiso",
    description: "Nos comprometemos con cada proyecto como si fuera propio, garantizando resultados excepcionales.",
  },
  {
    icon: Shield,
    title: "Responsabilidad",
    description: "Asumimos la responsabilidad total de nuestro trabajo con garantía y respaldo.",
  },
  {
    icon: Zap,
    title: "Eficiencia",
    description: "Optimizamos cada proceso para entregar a tiempo sin comprometer la calidad.",
  },
  {
    icon: Heart,
    title: "Pasión",
    description: "Amamos lo que hacemos y eso se refleja en cada instalación que realizamos.",
  },
]

const team = [
  {
    name: "Carlos Rodríguez",
    role: "Director General",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "María González",
    role: "Directora de Operaciones",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "Andrés Martínez",
    role: "Jefe de Logística",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60",
  },
  {
    name: "Laura Sánchez",
    role: "Coordinadora de Calidad",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60",
  },
]

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-16 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-primary uppercase tracking-wider mb-3">Sobre Nosotros</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 text-balance">
              Más de una década transformando espacios en Colombia
            </h1>
            <p className="text-lg text-muted-foreground">
              Fermaj nació en 2014 con una visión clara: revolucionar el sector de las instalaciones 
              técnicas en Colombia ofreciendo servicios profesionales, puntuales y de la más alta calidad.
            </p>
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-24 bg-background" style={{ contentVisibility: 'auto' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Nuestra Historia</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Comenzamos como un pequeño equipo de técnicos apasionados en Bogotá, 
                  atendiendo instalaciones residenciales con un compromiso inquebrantable con la calidad.
                </p>
                <p>
                  Hoy, somos una red de más de 50 técnicos certificados presentes en las principales 
                  ciudades del país, atendiendo clientes corporativos como Samsung, Compupar, Ceser, 
                  Visual Seven y Home Service.
                </p>
                <p>
                  Nuestro crecimiento ha sido impulsado por la confianza de nuestros clientes y 
                  nuestra constante inversión en tecnología, capacitación y herramientas profesionales.
                </p>
              </div>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-card border border-border">
              <Image
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&auto=format&fit=crop&q=60"
                alt="Equipo Fermaj"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-secondary/30" style={{ contentVisibility: 'auto' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Nuestros Valores</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Los principios que guían cada una de nuestras acciones
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-background" style={{ contentVisibility: 'auto' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">Equipo Directivo</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Profesionales comprometidos con la excelencia
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mx-auto mb-4 border-2 border-border group-hover:border-primary transition-colors">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="160px"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 bg-secondary/30" style={{ contentVisibility: 'auto' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-8 h-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Certificaciones</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Contamos con las certificaciones necesarias para garantizar servicios 
                de la más alta calidad y cumplimiento normativo.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Certificación Técnico ICONTEC</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Certificación Gas Natural</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Certificación RETIE</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Trabajo Seguro en Alturas</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Primeros Auxilios y Emergencias</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="w-32 h-32 rounded-lg bg-card border border-border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground text-center p-2">ICONTEC</span>
                </div>
                <div className="w-32 h-32 rounded-lg bg-card border border-border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground text-center p-2">Gas Natural</span>
                </div>
                <div className="w-32 h-32 rounded-lg bg-card border border-border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground text-center p-2">RETIE</span>
                </div>
                <div className="w-32 h-32 rounded-lg bg-card border border-border flex items-center justify-center">
                  <span className="text-xs text-muted-foreground text-center p-2">SST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
