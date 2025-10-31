"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function CommerceAuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    ownerName: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Commerce auth attempt:", { isLogin, email: formData.email })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to commerce dashboard
    router.push("/dashboard/commerce")
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="p-6 flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Cuenta de comercio</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">{isLogin ? "Iniciar sesión" : "Registrar negocio"}</CardTitle>
            <CardDescription>
              {isLogin ? "Accede a tu panel de comercio" : "Registra tu negocio para aceptar pagos digitales"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nombre del negocio</Label>
                    <Input
                      id="businessName"
                      type="text"
                      placeholder="Tienda La Esperanza"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                      required={!isLogin}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Nombre del propietario</Label>
                    <Input
                      id="ownerName"
                      type="text"
                      placeholder="Juan Pérez"
                      value={formData.ownerName}
                      onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                      required={!isLogin}
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="negocio@correo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 8 caracteres"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required={!isLogin}
                  />
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                {isLogin ? "Iniciar sesión" : "Registrar negocio"}
              </Button>

              <div className="text-center text-sm">
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
                  {isLogin ? "¿Nuevo negocio? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
