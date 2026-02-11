"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AdminLoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    console.log("🔥 Login clicked")
    setLoading(true)
    setError(null)

    try {
      console.log("➡️ Attempting login for:", email)

      const { data, error: authError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      console.log("🔐 Auth response:", data, authError)

      if (authError || !data?.session) {
        setLoading(false)
        setError(authError?.message ?? "Login failed")
        return
      }

      console.log("✅ Logged in user:", data.session.user.id)

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", data.session.user.id)
        .single()

      console.log("👤 Profile result:", profile, profileError)

      if (profileError) {
        setLoading(false)
        setError("Profile lookup failed")
        return
      }

      if (!profile?.is_admin) {
        await supabase.auth.signOut()
        setLoading(false)
        setError("Not authorized")
        return
      }

      console.log("🚀 Routing to admin panel")
      router.push("/admin-panel")

    } catch (err) {
      console.error("💥 Unexpected error:", err)
      setError("Unexpected error occurred")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="border border-black p-6 w-full max-w-sm">
        <h1 className="text-lg font-semibold mb-4">Admin Login</h1>

        <input
          className="border border-black w-full mb-3 p-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border border-black w-full mb-4 p-2"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-sm text-red-600 mb-3">{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 border border-black transition-all duration-200 ${
            loading
              ? "bg-black text-white scale-95 opacity-80"
              : "bg-white text-black hover:bg-black hover:text-white"
          }`}
        >
          {loading ? "Authenticating..." : "Login"}
        </button>
      </div>
    </div>
  )
}
