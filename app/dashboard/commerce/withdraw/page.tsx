"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  Building2,
  CreditCard,
  ArrowRightLeft,
  ExternalLink,
  Copy,
} from "lucide-react"
import { createSolanaTransaction, getSolanaExplorerUrl, formatSolanaAddress } from "@/lib/solana"

export default function CommerceWithdrawPage() {
  const router = useRouter()
  const [step, setStep] = useState<"method" | "amount" | "confirm" | "success">("method")
  const [withdrawMethod, setWithdrawMethod] = useState("bank")
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [solanaHash, setSolanaHash] = useState("")
  const [copied, setCopied] = useState(false)

  const businessBalance = 24350.75
  const usdcToMxnRate = 20.15

  const handleContinueToAmount = () => {
    setStep("amount")
  }

  const handleContinueToConfirm = () => {
    if (!amount || Number.parseFloat(amount) <= 0) return
    setStep("confirm")
  }

  const handleWithdraw = async () => {
    setIsProcessing(true)
    console.log("[v0] Processing commerce withdrawal:", { withdrawMethod, amount })

    const transaction = await createSolanaTransaction({
      from: "merchant_wallet_address",
      to: "system",
      amount: Number.parseFloat(amount),
      type: "withdrawal",
    })

    setSolanaHash(transaction.hash)
    setIsProcessing(false)
    setStep("success")
  }

  const handleDone = () => {
    router.push("/dashboard/commerce")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="p-4 flex items-center gap-4 border-b bg-background/95 backdrop-blur">
        <Link href="/dashboard/commerce">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-semibold">Retirar fondos</h1>
      </header>

      <main className="p-4 pb-20 max-w-md mx-auto">
        {step === "method" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Download className="w-10 h-10 text-accent-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Método de retiro</h2>
              <p className="text-muted-foreground">Elige cómo quieres recibir tus fondos</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Selecciona un método</CardTitle>
                <CardDescription>Tus fondos llegarán en 1-3 días hábiles</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={withdrawMethod} onValueChange={setWithdrawMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Transferencia bancaria</p>
                        <p className="text-sm text-muted-foreground">A tu cuenta de negocio</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Tarjeta de débito</p>
                        <p className="text-sm text-muted-foreground">Termina en 8765</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Saldo disponible</span>
                <span className="text-lg font-bold text-primary">${businessBalance.toFixed(2)}</span>
              </div>
            </div>

            <Button onClick={handleContinueToAmount} className="w-full" size="lg">
              Continuar
            </Button>
          </div>
        )}

        {step === "amount" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Download className="w-10 h-10 text-accent-foreground" />
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
                      max={businessBalance}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1000, 5000, 10000, 15000, 20000].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount.toString())}
                      disabled={quickAmount > businessBalance}
                    >
                      ${quickAmount}
                    </Button>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => setAmount(businessBalance.toString())}>
                    Todo
                  </Button>
                </div>

                <div className="pt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Saldo disponible</span>
                    <span className="font-medium">${businessBalance.toFixed(2)}</span>
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
                disabled={!amount || Number.parseFloat(amount) <= 0 || Number.parseFloat(amount) > businessBalance}
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
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto">
                <Download className="w-10 h-10 text-accent-foreground" />
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
                  <Label className="text-muted-foreground">Negocio</Label>
                  <p className="text-lg font-semibold">Tienda La Esperanza</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground">Método de retiro</Label>
                  <p className="text-lg font-semibold">
                    {withdrawMethod === "bank" ? "Transferencia bancaria" : "Tarjeta de débito"}
                  </p>
                </div>

                <div className="space-y-3 p-4 bg-secondary/50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ArrowRightLeft className="w-4 h-4" />
                    <span>Conversión USDC → MXN</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Monto en USDC</span>
                      <span className="font-mono font-medium">
                        {(Number.parseFloat(amount) / usdcToMxnRate).toFixed(2)} USDC
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tasa de cambio</span>
                      <span className="font-medium">1 USDC = ${usdcToMxnRate} MXN</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold pt-2 border-t">
                      <span>Recibirás en MXN</span>
                      <span className="text-primary">${Number.parseFloat(amount).toFixed(2)}</span>
                    </div>
                  </div>
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
                    <span className="text-muted-foreground">Saldo restante</span>
                    <span className="font-medium">${(businessBalance - Number.parseFloat(amount)).toFixed(2)}</span>
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
                    <span className="text-muted-foreground">Negocio</span>
                    <span className="font-medium">Tienda La Esperanza</span>
                  </div>
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
                    <span className="font-medium font-mono text-xs">WTH-COM-{Date.now()}</span>
                  </div>
                </div>

                {solanaHash && (
                  <div className="pt-4 border-t space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Comprobante blockchain</Label>
                      <p className="text-xs text-muted-foreground">Conversión USDC → MXN registrada en Solana Devnet</p>
                      <div className="flex items-center gap-2 p-3 bg-secondary/50 rounded-lg">
                        <code className="text-xs font-mono flex-1 overflow-hidden text-ellipsis">
                          {formatSolanaAddress(solanaHash)}
                        </code>
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

                <div className="bg-secondary/50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-center text-muted-foreground leading-relaxed">
                    Te notificaremos cuando el dinero llegue a tu cuenta. Puedes revisar el estado en tu historial de
                    ventas.
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
