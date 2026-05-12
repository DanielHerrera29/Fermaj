import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://fermajsas.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Fermaj SAS | Instalaciones Profesionales en Colombia',
    template: '%s | Fermaj SAS',
  },
  description: 'Empresa colombiana especializada en instalación de productos tecnológicos y electrónicos. Servicio técnico profesional con cobertura nacional.',
  keywords: ['instalaciones', 'colombia', 'samsung', 'electrodomésticos', 'servicios técnicos', 'fermaj', 'instalación profesional', 'tecnología'],
  authors: [{ name: 'Fermaj SAS' }],
  creator: 'Fermaj SAS',
  publisher: 'Fermaj SAS',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    siteName: 'Fermaj SAS',
    title: 'Fermaj SAS | Instalaciones Profesionales en Colombia',
    description: 'Empresa colombiana especializada en instalación de productos tecnológicos y electrónicos. Servicio técnico profesional con cobertura nacional.',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fermaj SAS | Instalaciones Profesionales en Colombia',
    description: 'Empresa colombiana especializada en instalación de productos tecnológicos y electrónicos.',
  },
  alternates: {
    canonical: siteUrl,
    languages: {
      'es-CO': siteUrl,
    },
  },
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || '',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-CO">
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <a href="#main-content" className="visually-hidden focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[100] focus-visible:p-3 focus-visible:bg-primary focus-visible:text-primary-foreground focus-visible:rounded-lg focus-visible:not-sr-only focus-visible:w-auto focus-visible:h-auto focus-visible:clip-auto">
          Saltar al contenido principal
        </a>
        <div id="main-content">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  )
}
