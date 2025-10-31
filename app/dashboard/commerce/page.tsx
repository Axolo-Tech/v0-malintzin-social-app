"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  QrCode,
  TrendingUp,
  Menu,
  Bell,
  Settings,
  LogOut,
  Eye,
  EyeOff,
  DollarSign,
  ShoppingBag,
  BarChart3,
  Download,
} from "lucide-react"

// Mock data for commerce dashboard
const mockSales = [
  {
    id: "1",
    customer: "María González",
    amount: 350,
    date: "2025-10-17 14:32",
    status: "completed",
    paymentMethod: "QR",
  },
  {
    id: "2",
    customer: "Ana Martínez",
    amount: 180,
    date: "2025-10-17 12:15",
    status: "completed",
    paymentMethod: "QR",
  },
  {
    id: "3",
    customer: "Carmen López",
    amount: 420,
    date: "2025-10-17 10:45",
    status: "completed",
    paymentMethod: "QR",
  },
  {
    id: "4",
    customer: "Rosa Hernández",
    amount: 275,
    date: "2025-10-16 16:20",
    status: "completed",
    paymentMethod: "QR",
  },
  {
    id: "5",
    customer: "Laura Ramírez",
    amount: 520,
    date: "2025-10-16 14:10",
    status: "completed",
    paymentMethod: "QR",
  },
]

const mockStats = {
  todaySales: 950,
  todayTransactions: 8,
  weekSales: 6420,
  monthSales: 24350,
  growthRate: 12.5,
  averageTicket: 312,
}

export default function CommerceDashboard() {
  const [showBalance, setShowBalance] = useState(true)
  const [showMenu, setShowMenu] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  // Mock business data
  const business = {
    name: "Tienda La Esperanza",
    owner: "Juan Pérez",
    email: "tienda@correo.com",
    balance: 24350.75,
    pendingBalance: 950,
  }

  const handleExportAudit = async () => {
    setIsExporting(true)
    try {
      const response = await fetch("/api/export-audit?format=csv")
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `malintzin-audit-${Date.now()}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("[v0] Error exporting audit:", error)
    } finally {
      setIsExporting(false)
    }
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
              <AvatarImage src="/store-profile.jpg" alt={business.name} />
              <AvatarFallback>LE</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 pb-20 space-y-6 max-w-6xl mx-auto">
        {/* Welcome Section */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <p className="text-muted-foreground">Panel de control de tu negocio</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ventas de hoy</CardDescription>
              <CardTitle className="text-2xl">${mockStats.todaySales.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="w-3 h-3" />
                <span>{mockStats.todayTransactions} transacciones</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Esta semana</CardDescription>
              <CardTitle className="text-2xl">${mockStats.weekSales.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="w-3 h-3" />
                <span>+{mockStats.growthRate}% vs anterior</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Este mes</CardDescription>
              <CardTitle className="text-2xl">${mockStats.monthSales.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={65} className="h-1" />
              <p className="text-xs text-muted-foreground mt-2">65% del objetivo mensual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Ticket promedio</CardDescription>
              <CardTitle className="text-2xl">${mockStats.averageTicket.toFixed(2)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ShoppingBag className="w-3 h-3" />
                <span>Por transacción</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-accent/80 to-accent text-accent-foreground border-0">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardDescription className="text-accent-foreground/80">Saldo total</CardDescription>
                <CardTitle className="text-4xl font-bold">
                  {showBalance ? `$${business.balance.toFixed(2)}` : "••••••"}
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBalance(!showBalance)}
                className="text-accent-foreground hover:bg-accent-foreground/20"
              >
                {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4" />
              <span className="text-accent-foreground/90">${business.pendingBalance.toFixed(2)} pendiente (hoy)</span>
            </div>
            <Button asChild className="w-full bg-accent-foreground text-accent hover:bg-accent-foreground/90">
              <Link href="/dashboard/commerce/withdraw">Retirar fondos</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/commerce/receive" className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <QrCode className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Cobrar con QR</h3>
                <p className="text-sm text-muted-foreground">Genera código QR</p>
              </div>
            </Link>
          </Card>

          <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/commerce/reports" className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                <BarChart3 className="w-7 h-7 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Ver reportes</h3>
                <p className="text-sm text-muted-foreground">Análisis de ventas</p>
              </div>
            </Link>
          </Card>
        </div>

        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Ventas recientes</CardTitle>
                <CardDescription>Últimas transacciones de tu negocio</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExportAudit} disabled={isExporting}>
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? "Exportando..." : "Exportar CSV"}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/commerce/sales">Ver todas</Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSales.map((sale) => (
                  <TableRow key={sale.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {sale.customer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{sale.customer}</p>
                          <Badge variant="outline" className="text-xs">
                            {sale.status === "completed" ? "Completado" : "Pendiente"}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(sale.date).toLocaleString("es-MX", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {sale.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-primary">${sale.amount.toFixed(2)}</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Consejo del día
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Los negocios que ofrecen promociones especiales los fines de semana aumentan sus ventas en promedio un
              23%. Considera crear ofertas especiales para tus clientes.
            </p>
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
                <AvatarImage src="/store-profile.jpg" alt={business.name} />
                <AvatarFallback>LE</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{business.name}</p>
                <p className="text-sm text-muted-foreground">{business.owner}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/commerce">
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/commerce/sales">
                  <ShoppingBag className="w-4 h-4" />
                  Ventas
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/commerce/reports">
                  <BarChart3 className="w-4 h-4" />
                  Reportes
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link href="/dashboard/commerce/settings">
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
