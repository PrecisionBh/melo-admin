"use client"

export const dynamic = "force-dynamic"


import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type LogRow = {
  id: string
  admin_id: string | null
  action: string
  target_id: string | null
  created_at: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    const { data, error } = await supabase
      .from("admin_logs")
      .select("id, admin_id, action, target_id, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setLogs(data as LogRow[])
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

      <h1 className="text-2xl font-semibold mb-8">Admin Logs</h1>

      {loading && <p>Loading logs...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && logs.length === 0 && (
        <p>No admin actions recorded yet.</p>
      )}

      {!loading && !error && logs.length > 0 && (
        <div className="border border-black overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black">
              <tr>
                <th className="p-2">Action</th>
                <th className="p-2">Admin</th>
                <th className="p-2">Target</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-black">
                  <td className="p-2">{log.action}</td>
                  <td className="p-2">{log.admin_id ?? "System"}</td>
                  <td className="p-2">{log.target_id ?? "—"}</td>
                  <td className="p-2">
                    {new Date(log.created_at).toLocaleString()}
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
