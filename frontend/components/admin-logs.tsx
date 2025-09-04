"use client"

import { useState } from "react"
import { Trash2, Download, Filter, Search, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'

export default function AdminLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [logs, setLogs] = useState([
    {
      id: 1,
      level: "info",
      message: "User john.doe@example.com logged in successfully",
      timestamp: "2024-01-20T10:30:00Z",
      source: "auth",
      details: "IP: 192.168.1.100, User-Agent: Mozilla/5.0..."
    },
    {
      id: 2,
      level: "error",
      message: "Failed to scrape course data from Udemy",
      timestamp: "2024-01-20T09:15:00Z",
      source: "scraper",
      details: "HTTP 429 - Rate limit exceeded"
    },
    {
      id: 3,
      level: "warning",
      message: "Course expiry notification failed to send",
      timestamp: "2024-01-20T08:45:00Z",
      source: "notifications",
      details: "Email service temporarily unavailable"
    },
    {
      id: 4,
      level: "success",
      message: "Database backup completed successfully",
      timestamp: "2024-01-20T02:00:00Z",
      source: "system",
      details: "Backup size: 2.3GB, Duration: 45 minutes"
    },
    {
      id: 5,
      level: "info",
      message: "New course added: Complete Python Bootcamp",
      timestamp: "2024-01-19T16:20:00Z",
      source: "courses",
      details: "Course ID: 567, Instructor: Jose Portilla"
    }
  ])

  const logLevels = [
    { value: "all", label: "All Levels" },
    { value: "info", label: "Info" },
    { value: "success", label: "Success" },
    { value: "warning", label: "Warning" },
    { value: "error", label: "Error" }
  ]

  const getLogIcon = (level: string) => {
    switch (level) {
      case "error":
        return XCircle
      case "warning":
        return AlertCircle
      case "success":
        return CheckCircle
      case "info":
      default:
        return Info
    }
  }

  const getLogColor = (level: string) => {
    switch (level) {
      case "error":
        return "text-red-600"
      case "warning":
        return "text-yellow-600"
      case "success":
        return "text-green-600"
      case "info":
      default:
        return "text-blue-600"
    }
  }

  const filteredLogs = logs
    .filter(log => selectedLevel === "all" || log.level === selectedLevel)
    .filter(log => 
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.source.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    })
  }

  const deleteLog = (id: number) => {
    setLogs(logs.filter(log => log.id !== id))
  }

  const clearAllLogs = () => {
    if (confirm("Are you sure you want to delete all logs? This action cannot be undone.")) {
      setLogs([])
    }
  }

  const exportLogs = () => {
    const csvContent = [
      ["ID", "Level", "Message", "Source", "Timestamp", "Details"],
      ...filteredLogs.map(log => [
        log.id,
        log.level,
        log.message,
        log.source,
        log.timestamp,
        log.details
      ])
    ].map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `learvi-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Logs</h1>
          <p className="text-slate-600">View and manage system logs and activities</p>
        </div>
        <div className="flex space-x-3">
          <button onClick={exportLogs} className="btn-secondary inline-flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </button>
          <button onClick={clearAllLogs} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-flex items-center">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Level Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {logLevels.map((level) => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-slate-600">
          Showing {filteredLogs.length} log{filteredLogs.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Logs Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Level</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Message</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Source</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Timestamp</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => {
                const IconComponent = getLogIcon(log.level)
                return (
                  <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <IconComponent className={`w-4 h-4 mr-2 ${getLogColor(log.level)}`} />
                        <span className={`text-sm font-medium capitalize ${getLogColor(log.level)}`}>
                          {log.level}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-slate-900 font-medium">{log.message}</p>
                        {log.details && (
                          <p className="text-sm text-slate-500 mt-1">{log.details}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-sm">
                        {log.source}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 text-sm">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => deleteLog(log.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {filteredLogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No logs found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm("")
              setSelectedLevel("all")
            }}
            className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}
