import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import SolanaProviders from "./providers"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Malintzin - Tu dinero digital",
  description:
    "Convierte tus apoyos sociales en dinero digital usable en comercios locales",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        {/* 🔹 Aquí envolvemos TODO con el proveedor de Solana */}
        <SolanaProviders>
          {children}
          <Analytics />
        </SolanaProviders>
      </body>
    </html>
  )
}
