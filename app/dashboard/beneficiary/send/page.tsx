"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Send, CheckCircle2, User } from "lucide-react"

export default function BeneficiarySendPage() {
  const router = useRouter()
  const [step, setStep] = useState<"recipient" | "amount" | "confirm" | "success">("recipient")
  const [recipient, setRecipient] = useState("")
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleContinueToAmount = () => {
    if (!recipient) return
    setStep("amount")
  }

  const handleContinueToConfirm = () => {
    if (!amount || Number.parseFloat(amount) <= 0) return
    setStep("confirm")
  }

  const handleSendMoney = async () => {
    setIsProcessing(true)
    console.log("[v0] Sending money:", { recipient, amount })
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
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
        <h1 className="text-xl font-semibold">Enviar dinero</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20 max-w-md mx-auto">
        {step === "recipient" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Send className="w-10 h-10 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold">¿A quién envías?</h2>
              <p className="text-muted-foreground">Ingresa el teléfono o correo del destinatario</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Destinatario</CardTitle>
                <CardDescription>Teléfono o correo electrónico</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Teléfono o correo</Label>
                  <Input
                    id="recipient"
                    type="text"
                    placeholder="555-123-4567 o correo@ejemplo.com"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="h-12"
                  />
                </div>

                {/* Recent recipients */}
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Recientes</Label>
                  <div className="space-y-2">
                    {["Ana Martínez", "Carmen López"].map((name) => (
                      <Button
                        key={name}
                        variant="outline"
                        className="w-full justify-start bg-transparent"
                        onClick={() => setRecipient(name)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={handleContinueToAmount} disabled={!recipient} className="w-full" size="lg">
              Continuar
            </Button>
          </div>
        )}

        {step === "amount" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Send className="w-10 h-10 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold">¿Cuánto envías?</h2>
              <p className="text-muted-foreground">Ingresa el monto a enviar</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monto a enviar</CardTitle>
                <CardDescription>A {recipient}</CardDescription>
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
                  {[50, 100, 200, 500, 1000, 2000].map((quickAmount) => (
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

                <div className="pt-2 text-sm text-muted-foreground">
                  <p>Tu saldo disponible: $3,250.50</p>
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
              <Button onClick={() => setStep("recipient")} variant="outline" className="w-full">
                Atrás
              </Button>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Send className="w-10 h-10 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Confirmar envío</h2>
              <p className="text-muted-foreground">Revisa los detalles antes de enviar</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detalles del envío</CardTitle>
                <CardDescription>Verifica que la información sea correcta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Destinatario</Label>
                  <p className="text-lg font-semibold">{recipient}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Monto a enviar</Label>
                  <p className="text-3xl font-bold text-primary">${Number.parseFloat(amount).toFixed(2)}</p>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tu saldo actual</span>
                    <span className="font-medium">$3,250.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saldo después del envío</span>
                    <span className="font-semibold text-primary">
                      ${(3250.5 - Number.parseFloat(amount)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleSendMoney} disabled={isProcessing} className="w-full" size="lg">
                {isProcessing ? "Enviando..." : "Confirmar envío"}
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
              <h2 className="text-2xl font-bold">Envío exitoso</h2>
              <p className="text-muted-foreground">Tu dinero se ha enviado correctamente</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Enviaste a</p>
                  <p className="text-xl font-semibold">{recipient}</p>
                </div>

                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-primary">${Number.parseFloat(amount).toFixed(2)}</p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fecha</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString("es-MX", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Hora</span>
                    <span className="font-medium">
                      {new Date().toLocaleTimeString("es-MX", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">ID de transacción</span>
                    <span className="font-medium font-mono text-xs">TXN-{Date.now()}</span>
                  </div>
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
