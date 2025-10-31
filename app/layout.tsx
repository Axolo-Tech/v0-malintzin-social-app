import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

// Definiciones de fuente simplificadas para evitar dependencias
// En un proyecto real, se usaría next/font/google
const customFont = "font-sans antialiased"

export const metadata: Metadata = {
  title: "Malintzin - Pagos 0% Comisión",
  description:
    "Convierte tus apoyos sociales en dinero digital usable en comercios locales con tecnología Solana.",
  generator: "v0.app",
}

// ESTE ES EL ARCHIVO MÁS SIMPLE POSIBLE PARA EL LAYOUT
// ELIMINAMOS TODAS LAS DEPENDENCIAS ROTAS COMO SolanaProviders
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={customFont}>
        {/*
          IMPORTANTE: El componente SolanaProviders fue removido de este layout
          para que la aplicación compile, ya que toda la lógica cripto (wallet, fees)
          se maneja internamente en app/page.tsx (Abstracción de Cuenta).
        */}
        {children}
        <Analytics />
      </body>
    </html>
  )
}
