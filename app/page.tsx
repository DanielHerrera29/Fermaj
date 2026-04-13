import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ExperienceSection } from "@/components/experience-section"
import { CoverageSection } from "@/components/coverage-section"
import { TechnologySection } from "@/components/technology-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ServicesSection />
      <ExperienceSection />
      <CoverageSection />
      <TechnologySection />
      <ContactSection />
      <Footer />
    </main>
  )
}
