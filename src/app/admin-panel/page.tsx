"use client"

export const dynamic = "force-dynamic"


import { useRouter } from "next/navigation"

export default function AdminPanelPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white text-black flex items-center justify-center">
      <div className="w-full max-w-xl text-center">

        <h1 className="text-2xl font-semibold mb-10">
          Melo Admin Panel
        </h1>

        <div className="grid grid-cols-2 gap-6">

          <button
            onClick={() => router.push("/admin-panel/users")}
            className="h-28 border border-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            Users
          </button>

          <button
            onClick={() => router.push("/admin-panel/listings")}
            className="h-28 border border-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            Listings
          </button>

          <button
            onClick={() => router.push("/admin-panel/orders")}
            className="h-28 border border-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            Orders
          </button>

          <button
            onClick={() => router.push("/admin-panel/disputes")}
            className="h-28 border border-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            Disputes
          </button>

          <button
            onClick={() => router.push("/admin-panel/admins")}
            className="h-28 border border-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            Admins
          </button>

          <button
            onClick={() => router.push("/admin-panel/logs")}
            className="h-28 border border-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            Logs
          </button>

          <button
            onClick={() => router.push("/admin-panel/notifications")}
            className="h-28 border border-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            Notifications
          </button>

          <button
            onClick={() => router.push("/admin-panel/settings")}
            className="h-28 border border-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center"
          >
            Settings
          </button>

        </div>
      </div>
    </div>
  )
}
