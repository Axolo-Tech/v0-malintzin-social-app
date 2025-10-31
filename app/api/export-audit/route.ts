import { NextResponse } from "next/server"

// Mock transaction data - in production, this would come from your database
const mockAuditData = [
  {
    id: "TXN-1729180800000",
    date: "2025-10-15T10:30:00Z",
    type: "deposit",
    from: "system",
    to: "user_maria_gonzalez",
    amount: 2500,
    currency: "MXN",
    status: "completed",
    solanaHash: "5KJp4XWbGEa8rJZvdnRyFXuPasGbeAPDZNAtzNiYqHvitRXSpAfv4RKj2S6DHUvYUqKrHJXZBkgCm2id6csVj8DyKJp",
    description: "Apoyo mensual - Gobierno",
  },
  {
    id: "TXN-1729094400000",
    date: "2025-10-14T15:45:00Z",
    type: "payment",
    from: "user_maria_gonzalez",
    to: "merchant_tienda_esperanza",
    amount: 350,
    currency: "MXN",
    status: "completed",
    solanaHash: "3NZvdnRyFXuPasGbeAPDZNAtzNiYqHvitRXSpAfv4RKj2S6DHUvYUqKrHJXZBkgCm2id6csVj8DyKJp4XWbGEa8rJ",
    description: "Pago en Tienda La Esperanza",
  },
  {
    id: "TXN-1729008000000",
    date: "2025-10-13T12:20:00Z",
    type: "payment",
    from: "user_maria_gonzalez",
    to: "merchant_farmacia_san_jose",
    amount: 180,
    currency: "MXN",
    status: "completed",
    solanaHash: "8rJZvdnRyFXuPasGbeAPDZNAtzNiYqHvitRXSpAfv4RKj2S6DHUvYUqKrHJXZBkgCm2id6csVj8DyKJp4XWbGEa",
    description: "Pago en Farmacia San José",
  },
  {
    id: "TXN-1728921600000",
    date: "2025-10-12T09:15:00Z",
    type: "refund",
    from: "merchant_tienda_esperanza",
    to: "user_maria_gonzalez",
    amount: 50,
    currency: "MXN",
    status: "completed",
    solanaHash: "2S6DHUvYUqKrHJXZBkgCm2id6csVj8DyKJp4XWbGEa8rJZvdnRyFXuPasGbeAPDZNAtzNiYqHvitRXSpAfv4RKj",
    description: "Reembolso",
  },
  {
    id: "TXN-1728835200000",
    date: "2025-10-11T16:30:00Z",
    type: "payment",
    from: "user_maria_gonzalez",
    to: "merchant_mercado_central",
    amount: 420,
    currency: "MXN",
    status: "completed",
    solanaHash: "9DyKJp4XWbGEa8rJZvdnRyFXuPasGbeAPDZNAtzNiYqHvitRXSpAfv4RKj2S6DHUvYUqKrHJXZBkgCm2id6csVj8",
    description: "Pago en Mercado Central",
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get("format") || "csv"
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Filter data by date range if provided
    let filteredData = mockAuditData
    if (startDate) {
      filteredData = filteredData.filter((tx) => new Date(tx.date) >= new Date(startDate))
    }
    if (endDate) {
      filteredData = filteredData.filter((tx) => new Date(tx.date) <= new Date(endDate))
    }

    if (format === "csv") {
      // Generate CSV
      const headers = [
        "ID Transacción",
        "Fecha",
        "Tipo",
        "Origen",
        "Destino",
        "Monto",
        "Moneda",
        "Estado",
        "Hash Solana",
        "Descripción",
      ]

      const rows = filteredData.map((tx) => [
        tx.id,
        new Date(tx.date).toISOString(),
        tx.type,
        tx.from,
        tx.to,
        tx.amount.toString(),
        tx.currency,
        tx.status,
        tx.solanaHash,
        `"${tx.description}"`,
      ])

      const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="malintzin-audit-${Date.now()}.csv"`,
        },
      })
    }

    // Return JSON by default
    return NextResponse.json({
      success: true,
      count: filteredData.length,
      transactions: filteredData,
    })
  } catch (error) {
    console.error("[v0] Error exporting audit data:", error)
    return NextResponse.json({ success: false, error: "Failed to export audit data" }, { status: 500 })
  }
}
