"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronRight } from "lucide-react"

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "#servicios" },
  { label: "Experiencia", href: "#experiencia" },
  { label: "Cobertura", href: "#cobertura" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "#contacto" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-background/95 backdrop-blur-lg border-b border-border shadow-lg" : "bg-transparent"
    }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4yX0MySL8JwRWLy6HNVo15DHVDqngh.png"
                alt="Fermaj Logo"
                width={130}
                height={45}
                className="h-10 lg:h-11 w-auto relative z-10"
                priority
                fetchPriority="high"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Navegación principal">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="relative px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-secondary rounded-lg scale-0 group-hover:scale-100 transition-transform" />
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/portal" aria-label="Ir al portal de clientes">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                Portal Clientes
              </Button>
            </Link>
            <Link href="#contacto" aria-label="Solicitar cotización">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 gap-1 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                Cotizar
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground rounded-lg hover:bg-secondary transition-colors focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
        mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}>
        <div className="bg-background/95 backdrop-blur-lg border-t border-border">
          <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Navegación móvil">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors py-3 px-4 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
              <Link href="/portal" onClick={() => setMobileMenuOpen(false)} aria-label="Ir al portal de clientes">
                <Button variant="outline" size="sm" className="w-full">
                  Portal Clientes
                </Button>
              </Link>
              <Link href="#contacto" onClick={() => setMobileMenuOpen(false)} aria-label="Solicitar cotización">
                <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Cotizar
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
