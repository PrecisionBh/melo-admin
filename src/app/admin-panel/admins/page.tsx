"use client"

export const dynamic = "force-dynamic"


import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type UserRow = {
  id: string
  email: string
  is_admin: boolean
  created_at: string
}

export default function AdminsPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCurrentUser()
    fetchUsers()
  }, [])

  const fetchCurrentUser = async () => {
    const { data } = await supabase.auth.getUser()
    if (data?.user) {
      setCurrentUserId(data.user.id)
    }
  }

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, is_admin, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setUsers(data as UserRow[])
    setLoading(false)
  }

  const toggleAdmin = async (user: UserRow) => {
    if (user.id === currentUserId) {
      alert("You cannot change your own admin status.")
      return
    }

    const { error } = await supabase
      .from("profiles")
      .update({ is_admin: !user.is_admin })
      .eq("id", user.id)

    if (error) {
      alert("Failed to update admin status.")
      return
    }

    fetchUsers()
  }

  return (
    <div className="min-h-screen bg-white text-black p-10">
      <button
        onClick={() => window.history.back()}
        className="border border-black px-3 py-1 mb-6"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-semibold mb-8">Admins</h1>

      {loading && <p>Loading users...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="border border-black overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-black">
              <tr>
                <th className="p-2">Email</th>
                <th className="p-2">Admin</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-black">
                  <td className="p-2">{user.email}</td>

                  <td className="p-2">
                    {user.is_admin ? "Yes" : "No"}
                  </td>

                  <td className="p-2">
                    {user.id !== currentUserId && (
                      <button
                        onClick={() => toggleAdmin(user)}
                        className="border border-black px-3 py-1 hover:bg-black hover:text-white transition"
                      >
                        {user.is_admin ? "Demote" : "Promote"}
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
