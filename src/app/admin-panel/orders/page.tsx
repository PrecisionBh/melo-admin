"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"

type OrderRow = {
  id: string
  buyer_id: string
  seller_id: string
  amount_cents: number
  escrow_status: string
  escrow_funded_at: string | null
  escrow_released_at: string | null
  is_disputed: boolean
  status: string
  paid_at: string | null
  created_at: string
}

export default function OrdersPage() {
  const supabase = getSupabase()

  const [orders, setOrders] = useState<OrderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        buyer_id,
        seller_id,
        amount_cents,
        escrow_status,
        escrow_funded_at,
        escrow_released_at,
        is_disputed,
        status,
        paid_at,
        created_at
      `)
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setOrders(data as OrderRow[])
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <button
        onClick={() => window.history.back()}
        className="border border-black px-3 py-1 mb-6"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold mb-8">Orders</h1>

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="border border-black overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black">
              <tr>
                <th className="p-2">Order</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
                <th className="p-2">Escrow</th>
                <th className="p-2">Disputed</th>
                <th className="p-2">Paid</th>
                <th className="p-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-black">
                  <td className="p-2">{order.id.slice(0, 8)}...</td>

                  <td className="p-2">
                    ${(order.amount_cents / 100).toFixed(2)}
                  </td>

                  <td className="p-2 capitalize">
                    {order.status}
                  </td>

                  <td className="p-2 capitalize">
                    {order.escrow_status}
                  </td>

                  <td className="p-2">
                    {order.is_disputed ? "Yes" : "No"}
                  </td>

                  <td className="p-2">
                    {order.paid_at
                      ? new Date(order.paid_at).toLocaleDateString()
                      : "—"}
                  </td>

                  <td className="p-2">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
