"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type ListingRow = {
  id: string
  title: string
  price: number
  seller_id: string
  status: string
  created_at: string
}

export default function ListingsPage() {
  const [listings, setListings] = useState<ListingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("id, title, price, seller_id, status, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setListings(data as ListingRow[])
    setLoading(false)
  }

  const inactivateListing = async (listing: ListingRow) => {
    const confirmAction = confirm(
      "Are you sure you want to deactivate this listing?"
    )
    if (!confirmAction) return

    // 1️⃣ Update status
    const { error: updateError } = await supabase
      .from("listings")
      .update({ status: "inactive" })
      .eq("id", listing.id)

    if (updateError) {
      alert("Failed to deactivate listing")
      return
    }

    // 2️⃣ Send automated system message
    await supabase.from("messages").insert({
      sender_id: null,
      recipient_id: listing.seller_id,
      body:
        "Your listing has been deactivated for violating one or more policies. Please review our listing policies for more information.",
    })

    // 3️⃣ Refresh table
    fetchListings()
  }

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <button
        onClick={() => window.history.back()}
        className="border border-black px-3 py-1 mb-6"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold mb-8">Listings</h1>

      {loading && <p>Loading listings...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="border border-black overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-black">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-b border-black">
                  <td className="p-3">{listing.title}</td>
                  <td className="p-3">${listing.price}</td>
                  <td className="p-3 capitalize">
                    {listing.status}
                  </td>
                  <td className="p-3">
                    {listing.status === "active" && (
                      <button
                        onClick={() => inactivateListing(listing)}
                        className="border border-black px-3 py-1 hover:bg-black hover:text-white transition"
                      >
                        Inactivate
                      </button>
                    )}
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
