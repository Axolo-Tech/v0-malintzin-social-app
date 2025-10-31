"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, QrCode, Scan, CheckCircle2, Copy, ExternalLink } from "lucide-react"
import { createSolanaTransaction, getSolanaExplorerUrl, formatSolanaAddress } from "@/lib/solana"

export default function BeneficiaryPayPage() {
  const router = useRouter()
  const [step, setStep] = useState<"scan" | "confirm" | "success">("scan")
  const [isScanning, setIsScanning] = useState(false)
  const [paymentData, setPaymentData] = useState({
    merchantName: "",
    amount: 0,
    merchantId: "",
  })
  const [solanaHash, setSolanaHash] = useState("")
  const [copied, setCopied] = useState(false)

  // Simulate QR code scanning
  const handleScan = () => {
    setIsScanning(true)
    // Simulate scanning delay
    setTimeout(() => {
      setPaymentData({
        merchantName: "Tienda La Esperanza",
        amount: 350,
        merchantId: "merchant_123",
      })
      setIsScanning(false)
      setStep("confirm")
    }, 2000)
  }

  // Handle payment confirmation
  const handleConfirmPayment = async () => {
    console.log("[v0] Processing payment:", paymentData)

    const transaction = await createSolanaTransaction({
      from: "user_wallet_address",
      to: paymentData.merchantId,
      amount: paymentData.amount,
      type: "payment",
    })

    setSolanaHash(transaction.hash)
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
        <h1 className="text-xl font-semibold">Pagar con QR</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20 max-w-md mx-auto">
        {step === "scan" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <QrCode className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Escanear código QR</h2>
              <p className="text-muted-foreground">Apunta tu cámara al código QR del comercio</p>
            </div>

            {/* QR Scanner Placeholder */}
            <Card className="overflow-hidden">
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {isScanning ? (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-muted-foreground">Escaneando...</p>
                  </div>
                ) : (
                  <div className="space-y-4 text-center p-6">
                    <Scan className="w-16 h-16 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">Presiona el botón para activar la cámara</p>
                  </div>
                )}
                {/* Scanner frame overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-4 border-primary rounded-2xl opacity-50" />
                </div>
              </div>
            </Card>

            <Button onClick={handleScan} disabled={isScanning} className="w-full" size="lg">
              {isScanning ? "Escaneando..." : "Activar cámara"}
            </Button>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                También puedes ingresar el código manualmente si tienes problemas
              </p>
            </div>
          </div>
        )}

        {step === "confirm" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <QrCode className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Confirmar pago</h2>
              <p className="text-muted-foreground">Revisa los detalles antes de confirmar</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Detalles del pago</CardTitle>
                <CardDescription>Verifica que la información sea correcta</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Comercio</Label>
                  <p className="text-lg font-semibold">{paymentData.merchantName}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Monto a pagar</Label>
                  <p className="text-3xl font-bold text-primary">${paymentData.amount.toFixed(2)}</p>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tu saldo actual</span>
                    <span className="font-medium">$3,250.50</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saldo después del pago</span>
                    <span className="font-semibold text-primary">$2,900.50</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleConfirmPayment} className="w-full" size="lg">
                Confirmar pago
              </Button>
              <Button onClick={() => setStep("scan")} variant="outline" className="w-full" size="lg">
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
              <h2 className="text-2xl font-bold">Pago exitoso</h2>
              <p className="text-muted-foreground">Tu pago se ha procesado correctamente</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Pagaste a</p>
                  <p className="text-xl font-semibold">{paymentData.merchantName}</p>
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
                    <span className="font-medium font-mono text-xs">TXN-{Date.now()}</span>
                  </div>
                </div>

                {solanaHash && (
                  <div className="pt-4 border-t space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Comprobante blockchain</Label>
                      <p className="text-xs text-muted-foreground">
                        Este pago está registrado en Solana Devnet para total transparencia
                      </p>
                      <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex-1 space-y-1">
                          <p className="text-xs text-muted-foreground">Hash de transacción:</p>
                          <code className="text-xs font-mono block overflow-hidden text-ellipsis">
                            {formatSolanaAddress(solanaHash)}
                          </code>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(solanaHash)
                            setCopied(true)
                            setTimeout(() => setCopied(false), 2000)
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      {copied && <p className="text-xs text-primary text-center">✓ Hash copiado</p>}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => window.open(getSolanaExplorerUrl(solanaHash), "_blank")}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver en Solana Explorer
                    </Button>
                  </div>
                )}
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
