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

export default function BeneficiaryAuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })
  const [passwordStrength, setPasswordStrength] = useState(0)

  const checkPasswordStrength = (password: string) => {
    let strength = 0
    if (password.length >= 8) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    setPasswordStrength(strength)
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value
    setFormData({ ...formData, password: newPassword })
    if (!isLogin) {
      checkPasswordStrength(newPassword)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Mock authentication - in production, this would call your API
    console.log("[v0] Auth attempt:", { isLogin, email: formData.email })

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Redirect to beneficiary dashboard
    router.push("/dashboard/beneficiary")
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
        <h1 className="text-xl font-semibold">Cuenta de beneficiaria</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">{isLogin ? "Iniciar sesión" : "Crear cuenta"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Ingresa a tu cuenta para gestionar tus apoyos"
                : "Crea tu cuenta para empezar a recibir apoyos"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="María González"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required={!isLogin}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
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
                    onChange={handlePasswordChange}
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
                {!isLogin && formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= passwordStrength
                              ? passwordStrength <= 1
                                ? "bg-destructive"
                                : passwordStrength <= 2
                                  ? "bg-accent"
                                  : "bg-primary"
                              : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {passwordStrength <= 1 && "Contraseña débil"}
                      {passwordStrength === 2 && "Contraseña media"}
                      {passwordStrength === 3 && "Contraseña fuerte"}
                      {passwordStrength === 4 && "Contraseña muy fuerte"}
                    </p>
                  </div>
                )}
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
                  {!isLogin && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-destructive">Las contraseñas no coinciden</p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                {isLogin ? "Iniciar sesión" : "Crear cuenta"}
              </Button>

              <div className="text-center text-sm">
                <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
                  {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
