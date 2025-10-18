"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, CreditCard, CheckCircle2, Building2, Smartphone, Copy, ExternalLink } from "lucide-react"
import { createSolanaTransaction, getSolanaExplorerUrl, formatSolanaAddress } from "@/lib/solana"

export default function BeneficiaryDepositPage() {
  const router = useRouter()
  const [step, setStep] = useState<"method" | "amount" | "instructions" | "success">("method")
  const [depositMethod, setDepositMethod] = useState("bank")
  const [amount, setAmount] = useState("")
  const [copied, setCopied] = useState(false)
  const [solanaHash, setSolanaHash] = useState("")

  const handleContinueToAmount = () => {
    setStep("amount")
  }

  const handleContinueToInstructions = () => {
    if (!amount || Number.parseFloat(amount) <= 0) return
    setStep("instructions")
  }

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleConfirmDeposit = async () => {
    console.log("[v0] Deposit confirmed:", { depositMethod, amount })

    const transaction = await createSolanaTransaction({
      from: "system",
      to: "user_wallet_address",
      amount: Number.parseFloat(amount),
      type: "deposit",
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
        <h1 className="text-xl font-semibold">Agregar saldo</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20 max-w-md mx-auto">
        {step === "method" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CreditCard className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Método de depósito</h2>
              <p className="text-muted-foreground">Elige cómo quieres agregar dinero</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Selecciona un método</CardTitle>
                <CardDescription>Tu saldo se actualizará automáticamente</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={depositMethod} onValueChange={setDepositMethod} className="space-y-3">
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Building2 className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Transferencia bancaria</p>
                        <p className="text-sm text-muted-foreground">SPEI o transferencia</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">Tarjeta de débito/crédito</p>
                        <p className="text-sm text-muted-foreground">Pago instantáneo</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50">
                    <RadioGroupItem value="oxxo" id="oxxo" />
                    <Label htmlFor="oxxo" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium">OXXO</p>
                        <p className="text-sm text-muted-foreground">Pago en efectivo</p>
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
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CreditCard className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">¿Cuánto agregas?</h2>
              <p className="text-muted-foreground">Ingresa el monto a depositar</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Monto a agregar</CardTitle>
                <CardDescription>
                  {depositMethod === "bank"
                    ? "Transferencia bancaria"
                    : depositMethod === "card"
                      ? "Tarjeta de débito/crédito"
                      : "Pago en OXXO"}
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
                  {[100, 500, 1000, 2000, 3000, 5000].map((quickAmount) => (
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
                    <span className="text-muted-foreground">Comisión</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                  <div className="flex justify-between text-sm font-semibold">
                    <span>Total a pagar</span>
                    <span className="text-primary">${amount ? Number.parseFloat(amount).toFixed(2) : "0.00"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                onClick={handleContinueToInstructions}
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

        {step === "instructions" && (
          <div className="space-y-6 pt-8">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CreditCard className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">Instrucciones de pago</h2>
              <p className="text-muted-foreground">Sigue estos pasos para completar tu depósito</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Datos para transferencia</CardTitle>
                <CardDescription>Usa estos datos para hacer tu depósito</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">CLABE</p>
                      <p className="font-mono font-semibold">012345678901234567</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard("012345678901234567")}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Banco</p>
                      <p className="font-semibold">Banco Malintzin</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Beneficiario</p>
                      <p className="font-semibold">Malintzin SA de CV</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Monto a transferir</p>
                      <p className="text-2xl font-bold text-primary">${Number.parseFloat(amount).toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {copied && <div className="text-center text-sm text-primary">✓ Copiado al portapapeles</div>}

                <div className="bg-secondary/50 rounded-lg p-4 mt-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong>Importante:</strong> Tu saldo se actualizará automáticamente una vez que recibamos tu
                    transferencia. Esto puede tomar de 5 minutos a 24 horas.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button onClick={handleConfirmDeposit} className="w-full" size="lg">
                Ya hice la transferencia
              </Button>
              <Button onClick={() => setStep("amount")} variant="outline" className="w-full">
                Atrás
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
              <h2 className="text-2xl font-bold">Depósito registrado</h2>
              <p className="text-muted-foreground">Estamos esperando tu transferencia</p>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Monto esperado</p>
                  <p className="text-4xl font-bold text-primary">${Number.parseFloat(amount).toFixed(2)}</p>
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Método</span>
                    <span className="font-medium">
                      {depositMethod === "bank"
                        ? "Transferencia bancaria"
                        : depositMethod === "card"
                          ? "Tarjeta"
                          : "OXXO"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Estado</span>
                    <span className="font-medium text-amber-600">Pendiente</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tiempo estimado</span>
                    <span className="font-medium">5 min - 24 horas</span>
                  </div>
                </div>

                {solanaHash && (
                  <div className="pt-4 border-t space-y-3">
                    <div className="space-y-2">
                      <Label className="text-sm text-muted-foreground">Hash de transacción (Solana Devnet)</Label>
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
                    Te notificaremos cuando tu saldo se haya actualizado. Puedes revisar el estado en tu historial de
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
