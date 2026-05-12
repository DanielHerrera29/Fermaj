"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Send, CheckCircle, MessageCircle, Clock, MessageSquare } from "lucide-react"

export function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section id="contacto" className="py-24 bg-secondary/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_left,rgba(200,255,0,0.08),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(200,255,0,0.05),transparent_50%)]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs text-primary font-medium uppercase tracking-wider">Contacto</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 text-balance">
            Hablemos de su{" "}
            <span className="text-primary">próximo proyecto</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Estamos listos para atender sus necesidades de instalación. 
            Contáctenos para una cotización personalizada.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <div>
            {/* Lottie Animation */}
            <div className="mb-8 max-w-sm mx-auto lg:mx-0 flex justify-center">
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-secondary flex items-center justify-center shadow-xl">
                <MessageSquare className="w-20 h-20 text-primary" />
              </div>
            </div>

            {/* Contact Cards */}
            <div className="grid gap-4">
              <div className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Phone className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Teléfono</p>
                  <p className="text-muted-foreground text-sm">+57 (1) 234 5678</p>
                  <p className="text-muted-foreground text-sm">+57 315 123 4567</p>
                </div>
              </div>

              <div className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Mail className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Correo Electrónico</p>
                  <p className="text-muted-foreground text-sm">contacto@fermaj.com.co</p>
                  <p className="text-muted-foreground text-sm">licitaciones@fermaj.com.co</p>
                </div>
              </div>

              <div className="group p-5 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <MapPin className="w-5 h-5 text-primary group-hover:text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground mb-1">Oficina Principal</p>
                  <p className="text-muted-foreground text-sm">Bogotá D.C., Colombia</p>
                  <p className="text-muted-foreground text-sm">Zona Norte, Cra 7 # 123-45</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-card border border-border flex items-center gap-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Lun - Vie</p>
                    <p className="text-sm font-medium text-foreground">7AM - 6PM</p>
                  </div>
                </div>
                <div className="p-5 rounded-2xl bg-card border border-border flex items-center gap-3">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">WhatsApp</p>
                    <p className="text-sm font-medium text-foreground">24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full scale-75" />
            <div className="relative bg-card rounded-3xl border border-border p-8 lg:p-10 shadow-2xl">
              <h3 className="text-xl font-bold text-foreground mb-2">Solicitar Cotización</h3>
              <p className="text-sm text-muted-foreground mb-6">Respuesta en menos de 24 horas</p>
              
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h4 className="text-xl font-bold text-foreground mb-2">Mensaje Enviado</h4>
                  <p className="text-muted-foreground">
                    Nos pondremos en contacto con usted en las próximas 24 horas.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Nombre</label>
                      <Input 
                        placeholder="Su nombre completo" 
                        required 
                        className="bg-secondary/50 border-border h-11"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Empresa</label>
                      <Input 
                        placeholder="Nombre de la empresa" 
                        className="bg-secondary/50 border-border h-11"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Email</label>
                      <Input 
                        type="email" 
                        placeholder="correo@empresa.com" 
                        required 
                        className="bg-secondary/50 border-border h-11"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">Teléfono</label>
                      <Input 
                        type="tel" 
                        placeholder="+57 300 123 4567" 
                        className="bg-secondary/50 border-border h-11"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Tipo de Servicio</label>
                    <select className="w-full h-11 px-3 rounded-md bg-secondary/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option value="">Seleccione un servicio</option>
                      <option value="aires">Aires Acondicionados</option>
                      <option value="televisores">Televisores</option>
                      <option value="linea-blanca">Línea Blanca</option>
                      <option value="gasodomesticos">Gasodomésticos</option>
                      <option value="electrico">Instalaciones Eléctricas</option>
                      <option value="plomeria">Plomería</option>
                      <option value="proyecto">Proyecto Especial / Licitación</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Mensaje</label>
                    <Textarea 
                      placeholder="Cuéntenos sobre su proyecto o necesidad de instalación..." 
                      rows={4}
                      className="bg-secondary/50 border-border resize-none"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 gap-2 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Solicitud
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
