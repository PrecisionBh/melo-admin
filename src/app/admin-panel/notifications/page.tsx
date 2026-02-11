"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { getSupabase } from "@/lib/supabase"

export default function NotificationsPage() {
  const supabase = getSupabase()

  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const sendNotification = async () => {
    if (!title.trim() || !body.trim()) {
      alert("Title and body are required.")
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      // 1️⃣ Fetch all NON-system users
      const { data: users, error: userError } = await supabase
        .from("profiles")
        .select("id")
        .eq("is_system", false)

      if (userError || !users) {
        setMessage("Failed to fetch users.")
        setLoading(false)
        return
      }

      if (users.length === 0) {
        setMessage("No eligible users found.")
        setLoading(false)
        return
      }

      // 2️⃣ Build notification rows
      const notificationRows = users.map((user) => ({
        user_id: user.id,
        type: "broadcast",
        title,
        body,
        read: false,
      }))

      // 3️⃣ Insert notifications
      const { error: insertError } = await supabase
        .from("notifications")
        .insert(notificationRows)

      if (insertError) {
        setMessage("Failed to send notification.")
        setLoading(false)
        return
      }

      setMessage(`Notification sent to ${users.length} users.`)
      setTitle("")
      setBody("")
      setLoading(false)

    } catch (err) {
      console.error(err)
      setMessage("Unexpected error occurred.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <button
        onClick={() => window.history.back()}
        className="border border-black px-3 py-1 mb-6"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold mb-8">
        Notifications
      </h1>

      <div className="max-w-lg border border-black p-6">

        <input
          className="border border-black w-full mb-4 p-2"
          placeholder="Notification Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border border-black w-full mb-4 p-2"
          placeholder="Notification Body"
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />

        <button
          onClick={sendNotification}
          disabled={loading}
          className="border border-black w-full py-2 hover:bg-black hover:text-white transition"
        >
          {loading ? "Sending..." : "Send Notification"}
        </button>

        {message && (
          <p className="mt-4 text-sm">
            {message}
          </p>
        )}

      </div>
    </div>
  )
}
