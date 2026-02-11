import { createClient, SupabaseClient } from "@supabase/supabase-js"

let supabase: SupabaseClient | null = null

export const getSupabase = () => {
  if (supabase) return supabase

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // During Vercel build phase env vars may not be injected yet.
    // Do NOT crash the build — return a temporary stub.
    console.warn("Supabase env variables missing during build.")
    return {} as SupabaseClient
  }

  supabase = createClient(supabaseUrl, supabaseAnonKey)
  return supabase
}
