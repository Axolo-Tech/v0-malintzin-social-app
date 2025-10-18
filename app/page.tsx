import Link from "next/link"
import { Card } from "@/components/ui/card"
import { User, Store } from "lucide-react"

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="p-6 flex justify-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary-foreground">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.8" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Malintzin</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        <div className="w-full max-w-md space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold text-balance leading-tight">Tu dinero digital, sin complicaciones</h2>
            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              Recibe tus apoyos y paga en comercios locales de forma segura y sin comisiones
            </p>
          </div>

          {/* User Type Selection Cards */}
          <div className="space-y-4 pt-4">
            <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
              <Link href="/auth/beneficiary" className="block">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <User className="w-7 h-7 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold">Soy madre o tutora</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Recibe tus apoyos sociales y paga en comercios locales
                    </p>
                  </div>
                </div>
              </Link>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow border-2 hover:border-primary/50">
              <Link href="/auth/commerce" className="block">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <Store className="w-7 h-7 text-accent-foreground" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <h3 className="text-xl font-semibold">Soy comercio</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Acepta pagos digitales y haz crecer tu negocio
                    </p>
                  </div>
                </div>
              </Link>
            </Card>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 space-y-3">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <span>Seguro y encriptado</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <span>Sin comisiones ocultas</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-3 h-3">
                  <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>
              <span>Tu dinero crece con el tiempo</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-sm text-muted-foreground">
        <p>Impulsando comunidades locales</p>
      </footer>
    </div>
  )
}
