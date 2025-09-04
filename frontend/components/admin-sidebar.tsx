"use client"

import { BarChart3, BookOpen, Users, Settings, Megaphone, FileText, Shield } from 'lucide-react'

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "courses", label: "Manage Courses", icon: BookOpen },
    { id: "users", label: "Manage Users", icon: Users },
    { id: "uplink", label: "UpLink", icon: Megaphone },
    { id: "logs", label: "Manage Logs", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside 
      className="h-screen bg-slate-900 text-white shadow-xl border-r border-slate-800 fixed w-64"
      role="navigation"
      aria-label="Admin navigation"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Learvi Admin</h1>
              <p className="text-sm text-slate-400">Management Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto" role="menu">
          <ul className="space-y-2" role="none">
            {menuItems.map((item) => (
              <li key={item.id} role="none">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    activeTab === item.id 
                      ? "bg-blue-600 text-white shadow-lg transform scale-[1.02]" 
                      : "text-slate-300 hover:bg-slate-800 hover:text-white hover:transform hover:scale-[1.01]"
                  }`}
                  role="menuitem"
                  aria-current={activeTab === item.id ? "page" : undefined}
                  tabIndex={0}
                >
                  <item.icon className={`w-5 h-5 transition-colors ${
                    activeTab === item.id ? "text-white" : "text-slate-400 group-hover:text-white"
                  }`} />
                  <span className="font-medium">{item.label}</span>
                  {activeTab === item.id && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full" aria-hidden="true" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            <p>Admin Panel v2.1.0</p>
            <p className="mt-1">© 2024 Learvi</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
