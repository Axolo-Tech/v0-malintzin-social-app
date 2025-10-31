"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Download, CheckCircle2, Building2, CreditCard } from "lucide-react"

export default function BeneficiaryWithdrawPage() {
  const router = useRouter()
  const [step, setStep] = useState<"method" | "amount" | "confirm" | "success">("method")
  const [withdrawMethod, setWithdrawMethod] = useState("bank")
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleContinueToAmount = () => {
    setStep("amount")
  }

  const handleContinueToConfirm = () => {
    if (!amount || Number.parseFloat(amount) <= 0) return
    setStep("confirm")
  }

  const handleWithdraw = async () => {
    setIsProcessing(true)
    console.log("[v0] Processing withdrawal:", { withdrawMethod, amount })
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setStep("success")
  }

  const handleDone = () => {
    router.push("/dashboard/beneficiary")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b bg-background/95 backdrop-blur">
        <Link href="/dashboard/beneficiary">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Retirar dinero</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20 max-w-md mx-auto">
        {step === "method" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto">
                <Download className="w-10 h-10 text-secondary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Método de retiro</h2>
              <p className="text-muted-foreground">Elige cómo quieres recibir tu dinero</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Selecciona un método</CardTitle>
                <CardDescription>Tu dinero llegará en 1-3 días hábiles</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={withdrawMethod} onValueChange={setWithdrawMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Transferencia bancaria</p>
                        <p className="text-sm text-muted-foreground">A tu cuenta registrada</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Tarjeta de débito</p>
                        <p className="text-sm text-muted-foreground">Termina en 4532</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Button onClick={handleContinueToAmount} className="w-full" size="lg">
              Continuar
            </Button>
          </div>
        )}

        {step === "amount" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto">
                <Download className="w-10 h-10 text-secondary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">¿Cuánto retiras?</h2>
              <p className="text-muted-foreground">Ingresa el monto a retirar</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monto a retirar</CardTitle>
                <CardDescription>
                  {withdrawMethod === "bank" ? "Transferencia bancaria" : "Tarjeta de débito"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Monto (MXN)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7 text-2xl h-14"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                {/* Quick amount buttons */}
                <div className="grid grid-cols-3 gap-2">
                  {[100, 500, 1000, 1500, 2000, 3000].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount.toString())}
                    >
                      ${quickAmount}
                    </Button>
                  ))}
                </div>

                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saldo disponible</span>
                    <span className="font-medium">$3,250.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Comisión</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={handleContinueToConfirm}
                disabled={!amount || Number.parseFloat(amount) <= 0}
                className="w-full"
                size="lg"
              >
                Continuar
              </Button>
              <Button onClick={() => setStep("method")} variant="outline" className="w-full">
                Atrás
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto">
                <Download className="w-10 h-10 text-secondary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Confirmar retiro</h2>
              <p className="text-muted-foreground">Revisa los detalles antes de confirmar</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detalles del retiro</CardTitle>
                <CardDescription>Verifica que la información sea correcta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Método de retiro</Label>
                  <p className="text-lg font-semibold">
                    {withdrawMethod === "bank" ? "Transferencia bancaria" : "Tarjeta de débito"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Monto a retirar</Label>
                  <p className="text-3xl font-bold text-primary">${Number.parseFloat(amount).toFixed(2)}</p>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Comisión</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total a recibir</span>
                    <span className="font-semibold text-primary">${Number.parseFloat(amount).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tiempo estimado</span>
                    <span className="font-medium">1-3 días hábiles</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleWithdraw} disabled={isProcessing} className="w-full" size="lg">
                {isProcessing ? "Procesando..." : "Confirmar retiro"}
              </Button>
              <Button onClick={() => setStep("amount")} variant="outline" className="w-full">
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Retiro en proceso</h2>
              <p className="text-muted-foreground">Tu solicitud se ha procesado correctamente</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Monto a recibir</p>
                  <p className="text-4xl font-bold text-primary">${Number.parseFloat(amount).toFixed(2)}</p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Método</span>
                    <span className="font-medium">
                      {withdrawMethod === "bank" ? "Transferencia bancaria" : "Tarjeta de débito"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fecha de solicitud</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tiempo estimado</span>
                    <span className="font-medium">1-3 días hábiles</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ID de transacción</span>
                    <span className="font-medium font-mono text-xs">WTH-{Date.now()}</span>
                  </div>
                </div>

                <div className="bg-secondary/50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-center text-muted-foreground leading-relaxed">
                    Te notificaremos cuando el dinero llegue a tu cuenta. Puedes revisar el estado en tu historial de
                    transacciones.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleDone} className="w-full" size="lg">
              Volver al inicio
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
