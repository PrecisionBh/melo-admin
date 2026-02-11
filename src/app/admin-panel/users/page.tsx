"use client"

export const dynamic = "force-dynamic"

import { useEffect, useState } from "react"
import { getSupabase } from "@/lib/supabase"

type UserRow = {
  id: string
  email: string
  created_at: string
  is_admin: boolean
}

export default function UsersPage() {
  const supabase = getSupabase()

  const [users, setUsers] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, created_at, is_admin")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setUsers(data as UserRow[])
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

      <h1 className="text-2xl font-semibold mb-8">Users</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="border border-black overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-black">
              <tr>
                <th className="p-3">Email</th>
                <th className="p-3">Created</th>
                <th className="p-3">Admin</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-black">
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {user.is_admin ? "Yes" : "No"}
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
