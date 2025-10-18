"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, QrCode, CheckCircle2, Loader2 } from "lucide-react"

export default function CommerceReceivePage() {
  const router = useRouter()
  const [step, setStep] = useState<"amount" | "qr" | "waiting" | "success">("amount")
  const [amount, setAmount] = useState("")
  const [qrCode, setQrCode] = useState("")
  const [paymentData, setPaymentData] = useState({
    customerName: "",
    amount: 0,
    transactionId: "",
  })

  // Generate QR code when amount is set
  useEffect(() => {
    if (step === "qr" && amount) {
      // In production, this would generate a real QR code with payment data
      const paymentInfo = {
        merchantId: "merchant_123",
        merchantName: "Tienda La Esperanza",
        amount: Number.parseFloat(amount),
        timestamp: Date.now(),
      }
      setQrCode(JSON.stringify(paymentInfo))
    }
  }, [step, amount])

  const handleGenerateQR = () => {
    if (!amount || Number.parseFloat(amount) <= 0) {
      return
    }
    setStep("qr")
  }

  const handleWaitForPayment = () => {
    setStep("waiting")
    // Simulate payment received
    setTimeout(() => {
      setPaymentData({
        customerName: "María González",
        amount: Number.parseFloat(amount),
        transactionId: `TXN-${Date.now()}`,
      })
      setStep("success")
    }, 3000)
  }

  const handleNewPayment = () => {
    setAmount("")
    setQrCode("")
    setStep("amount")
  }

  const handleDone = () => {
    router.push("/dashboard/commerce")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="p-4 flex items-center gap-4 border-b bg-background/95 backdrop-blur">
        <Link href="/dashboard/commerce">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Cobrar con QR</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20 max-w-md mx-auto">
        {step === "amount" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <QrCode className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Ingresa el monto</h2>
              <p className="text-muted-foreground">Especifica cuánto deseas cobrar</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monto a cobrar</CardTitle>
                <CardDescription>El cliente escaneará el código QR para pagar</CardDescription>
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
              </CardContent>
            </Card>

            <Button
              onClick={handleGenerateQR}
              disabled={!amount || Number.parseFloat(amount) <= 0}
              className="w-full"
              size="lg"
            >
              Generar código QR
            </Button>
          </div>
        )}

        {step === "qr" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Código QR generado</h2>
              <p className="text-muted-foreground">Muestra este código al cliente</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Monto a cobrar</p>
                  <p className="text-4xl font-bold text-primary">${Number.parseFloat(amount).toFixed(2)}</p>
                </div>

                {/* QR Code Display */}
                <div className="aspect-square bg-white rounded-xl p-6 flex items-center justify-center border-4 border-primary/20">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-primary" />
                  </div>
                </div>

                <p className="text-xs text-center text-muted-foreground">
                  El cliente debe escanear este código con la app Malintzin
                </p>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleWaitForPayment} className="w-full" size="lg">
                Esperar pago
              </Button>
              <Button onClick={() => setStep("amount")} variant="outline" className="w-full">
                Cambiar monto
              </Button>
            </div>
          </div>
        )}

        {step === "waiting" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
              <h2 className="text-2xl font-bold">Esperando pago</h2>
              <p className="text-muted-foreground">El cliente está procesando el pago</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Monto</p>
                  <p className="text-4xl font-bold text-primary">${Number.parseFloat(amount).toFixed(2)}</p>
                </div>

                <div className="flex items-center justify-center py-8">
                  <div className="space-y-2 text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Procesando...</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button onClick={() => setStep("qr")} variant="outline" className="w-full">
              Cancelar
            </Button>
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Pago recibido</h2>
              <p className="text-muted-foreground">La transacción se completó exitosamente</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Recibiste de</p>
                  <p className="text-xl font-semibold">{paymentData.customerName}</p>
                </div>

                <div className="text-center py-4">
                  <p className="text-4xl font-bold text-primary">${paymentData.amount.toFixed(2)}</p>
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
                    <span className="font-medium font-mono text-xs">{paymentData.transactionId}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleNewPayment} className="w-full" size="lg">
                Nuevo cobro
              </Button>
              <Button onClick={handleDone} variant="outline" className="w-full bg-transparent">
                Volver al inicio
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
