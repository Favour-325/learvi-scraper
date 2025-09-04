"use client"

import { useState } from "react"
import AdminSidebar from "@/components/admin-sidebar"
import AdminDashboard from "@/components/admin-dashboard"
import AdminCourses from "@/components/admin-courses"
import AdminUsers from "@/components/admin-users"
import AdminUpLink from "@/components/admin-uplink"
import AdminLogs from "@/components/admin-logs"
import AdminSettings from "@/components/admin-settings"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/AuthContext"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard")

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <AdminDashboard />
      case "courses":
        return <AdminCourses />
      case "users":
        return <AdminUsers />
      case "uplink":
        return <AdminUpLink />
      case "logs":
        return <AdminLogs />
      case "settings":
        return <AdminSettings />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <div className="flex">
          {/* Sidebar - Fixed width, full height */}
          <div className="w-64 flex-shrink-0">
            <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <main className="h-screen overflow-y-auto">
              <div className="p-6 lg:p-8">
                {renderContent()}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
