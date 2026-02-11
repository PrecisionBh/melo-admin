"use client"

export const dynamic = "force-dynamic"


import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type DisputeRow = {
  id: string
  buyer_id: string
  seller_id: string
  amount_cents: number
  dispute_reason: string | null
  issue_reported_at: string | null
  escrow_status: string
  status: string
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState<DisputeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDisputes()
  }, [])

  const fetchDisputes = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select(`
        id,
        buyer_id,
        seller_id,
        amount_cents,
        dispute_reason,
        issue_reported_at,
        escrow_status,
        status
      `)
      .eq("is_disputed", true)
      .order("issue_reported_at", { ascending: false })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setDisputes(data as DisputeRow[])
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

      <h1 className="text-2xl font-semibold mb-8">Disputes</h1>

      {loading && <p>Loading disputes...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && disputes.length === 0 && (
        <p>No active disputes.</p>
      )}

      {!loading && !error && disputes.length > 0 && (
        <div className="border border-black overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black">
              <tr>
                <th className="p-2">Order</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Reason</th>
                <th className="p-2">Escrow</th>
                <th className="p-2">Status</th>
                <th className="p-2">Reported</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map((order) => (
                <tr key={order.id} className="border-b border-black">
                  <td className="p-2">{order.id.slice(0, 8)}...</td>

                  <td className="p-2">
                    ${(order.amount_cents / 100).toFixed(2)}
                  </td>

                  <td className="p-2">
                    {order.dispute_reason ?? "—"}
                  </td>

                  <td className="p-2 capitalize">
                    {order.escrow_status}
                  </td>

                  <td className="p-2 capitalize">
                    {order.status}
                  </td>

                  <td className="p-2">
                    {order.issue_reported_at
                      ? new Date(order.issue_reported_at).toLocaleDateString()
                      : "—"}
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
