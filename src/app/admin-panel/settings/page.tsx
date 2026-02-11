"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

type Settings = {
  id: string
  maintenance_mode: boolean
  listings_enabled: boolean
  signups_enabled: boolean
  checkout_enabled: boolean
  notifications_enabled: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from("platform_settings")
      .select("*")
      .single()

    if (error) {
      console.error(error)
      return
    }

    setSettings(data)
  }

  const toggleSetting = async (key: keyof Omit<Settings, "id">) => {
    if (!settings) return

    setLoading(true)

    const updatedValue = !settings[key]

    const { error } = await supabase
      .from("platform_settings")
      .update({
        [key]: updatedValue,
        updated_at: new Date().toISOString(),
      })
      .eq("id", settings.id)

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    setSettings({
      ...settings,
      [key]: updatedValue,
    })

    setLoading(false)
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-white text-black p-10">
        Loading...
      </div>
    )
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
        Settings
      </h1>

      <div className="space-y-4 max-w-md">

        <div className="border border-black p-4 flex justify-between">
          <span>Maintenance Mode</span>
          <button
            disabled={loading}
            onClick={() => toggleSetting("maintenance_mode")}
            className="border border-black px-4 py-1"
          >
            {settings.maintenance_mode ? "ON" : "OFF"}
          </button>
        </div>

        <div className="border border-black p-4 flex justify-between">
          <span>Listings Enabled</span>
          <button
            disabled={loading}
            onClick={() => toggleSetting("listings_enabled")}
            className="border border-black px-4 py-1"
          >
            {settings.listings_enabled ? "ON" : "OFF"}
          </button>
        </div>

        <div className="border border-black p-4 flex justify-between">
          <span>Signups Enabled</span>
          <button
            disabled={loading}
            onClick={() => toggleSetting("signups_enabled")}
            className="border border-black px-4 py-1"
          >
            {settings.signups_enabled ? "ON" : "OFF"}
          </button>
        </div>

        <div className="border border-black p-4 flex justify-between">
          <span>Checkout Enabled</span>
          <button
            disabled={loading}
            onClick={() => toggleSetting("checkout_enabled")}
            className="border border-black px-4 py-1"
          >
            {settings.checkout_enabled ? "ON" : "OFF"}
          </button>
        </div>

        <div className="border border-black p-4 flex justify-between">
          <span>Notifications Enabled</span>
          <button
            disabled={loading}
            onClick={() => toggleSetting("notifications_enabled")}
            className="border border-black px-4 py-1"
          >
            {settings.notifications_enabled ? "ON" : "OFF"}
          </button>
        </div>

      </div>

      <div className="mt-12 text-sm text-gray-600">
        <p>Melo Admin Panel</p>
        <p>Version 1.0 MVP</p>
      </div>
    </div>
  )
}
