"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreditCard, Gift } from "lucide-react"
import {
  ArrowUpRight,
  ArrowDownLeft,
  QrCode,
  Send,
  Download,
  TrendingUp,
  Menu,
  Bell,
  Settings,
  LogOut,
  Eye,
  EyeOff,
} from "lucide-react"

// Mock data - in production, this would come from your API/database
const mockTransactions = [
  {
    id: "1",
    type: "received",
    description: "Apoyo mensual - Gobierno",
    amount: 2500,
    date: "2025-10-15",
    status: "completed",
  },
  {
    id: "2",
    type: "sent",
    description: "Tienda La Esperanza",
    amount: -350,
    date: "2025-10-14",
    status: "completed",
  },
  {
    id: "3",
    type: "sent",
    description: "Farmacia San José",
    amount: -180,
    date: "2025-10-13",
    status: "completed",
  },
  {
    id: "4",
    type: "received",
    description: "Reembolso",
    amount: 50,
    date: "2025-10-12",
    status: "completed",
  },
  {
    id: "5",
    type: "sent",
    description: "Mercado Central",
    amount: -420,
    date: "2025-10-11",
    status: "completed",
  },
]

export default function BeneficiaryDashboard() {
  const [showBalance, setShowBalance] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  const user = {
    name: "María González", // This should come from your authentication system
    email: "maria@correo.com",
    balance: 3250.5,
    pendingBalance: 500,
    rewardPoints: 150,
    daysWithBalance: 32,
    qualifiesForReward: true,
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setShowMenu(!showMenu)}>
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-primary-foreground">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.8" />
                  <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-semibold">Malintzin</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Avatar className="w-9 h-9">
              <AvatarImage src="/woman-profile.png" alt={user.name} />
              <AvatarFallback>MG</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20 space-y-6 max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Hola, {user.name.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground">Aquí está el resumen de tu cuenta</p>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardDescription className="text-primary-foreground/80">Saldo disponible</CardDescription>
                <CardTitle className="text-4xl font-bold">
                  {showBalance ? `$${user.balance.toFixed(2)}` : "••••••"}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="text-primary-foreground hover:bg-primary-foreground/20"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span className="text-primary-foreground/90">${user.pendingBalance.toFixed(2)} pendiente de recibir</span>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/beneficiary/pay" className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <QrCode className="w-6 h-6 text-primary" />
              </div>
              <span className="text-sm font-medium">Pagar</span>
            </Link>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/beneficiary/send" className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                <Send className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-sm font-medium">Enviar</span>
            </Link>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/beneficiary/deposit" className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium">Agregar</span>
            </Link>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/beneficiary/withdraw" className="flex flex-col items-center gap-2 text-center">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Download className="w-6 h-6 text-secondary-foreground" />
              </div>
              <span className="text-sm font-medium">Retirar</span>
            </Link>
          </Card>
        </div>

        {/* Rewards Card */}
        {user.qualifiesForReward && (
          <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/20">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Gift className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">¡Felicidades! 🎉</CardTitle>
                  <CardDescription>Has ganado {user.rewardPoints} puntos de recompensa</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Días con saldo activo</p>
                  <p className="text-2xl font-bold text-amber-600">{user.daysWithBalance} días</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Puntos acumulados</p>
                  <p className="text-2xl font-bold text-amber-600">{user.rewardPoints}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Por mantener un saldo mayor a $1,000 por más de 30 días, has ganado puntos que puedes canjear por
                beneficios especiales.
              </p>
              <Button variant="outline" className="w-full border-amber-500/50 hover:bg-amber-500/10 bg-transparent">
                Ver mis recompensas
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Transacciones recientes</CardTitle>
                <CardDescription>Tus últimos movimientos</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/beneficiary/transactions">Ver todas</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === "received" ? "bg-primary/10" : "bg-muted"
                          }`}
                        >
                          {transaction.type === "received" ? (
                            <ArrowDownLeft className="w-4 h-4 text-primary" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{transaction.description}</p>
                          <Badge variant="outline" className="text-xs">
                            {transaction.status === "completed" ? "Completado" : "Pendiente"}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("es-MX", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={`font-semibold ${
                          transaction.type === "received" ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="bg-secondary/50">
          <CardHeader>
            <CardTitle className="text-lg">¿Necesitas ayuda?</CardTitle>
            <CardDescription>Estamos aquí para apoyarte en cada paso</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full bg-transparent">
              Contactar soporte
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Side Menu Overlay */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setShowMenu(false)}>
          <div
            className="fixed left-0 top-0 h-full w-72 bg-background border-r shadow-lg p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 pb-4 border-b">
              <Avatar className="w-12 h-12">
                <AvatarImage src="/woman-profile.png" alt={user.name} />
                <AvatarFallback>MG</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/beneficiary">
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/beneficiary/transactions">
                  <ArrowUpRight className="w-4 h-4" />
                  Transacciones
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/beneficiary/settings">
                  <Settings className="w-4 h-4" />
                  Configuración
                </Link>
              </Button>
            </nav>

            <div className="pt-4 border-t">
              <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive" asChild>
                <Link href="/">
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
