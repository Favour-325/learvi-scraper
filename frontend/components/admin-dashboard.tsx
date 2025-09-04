"use client"

import { useState, useEffect } from "react"
import { get_courses, get_metrics } from "@/lib/api"
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const [courseStats, setCourseStats] = useState({
    total: "567",
    change: "+8%"
  });
  const [userStats, setUserStats] = useState({
    total: "10,234",
    change: "+12%"
  });
  const [growthStats, setGrowthStats] = useState({
    total: "23.5%",
    change: "5%"
  });

  async function fetchMetrics() {
    const response = await get_courses({})
    const metrics = await get_metrics()

    const data = response.data
    setCourseStats({ ...courseStats, total: data.total })

    const metrics_data = metrics.data
    const record = metrics_data.record

    setUserStats({ ...userStats, total: record.total_users })
    setGrowthStats({ ...growthStats, total: record.growth_rate })
  }


  useEffect(() => {
    fetchMetrics()
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-600">Monitor your platform's performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{userStats.total}</p>
              <p className="text-sm text-green-600">{userStats.change} from last month</p>
            </div>
            <div className={"p-3 rounded-lg bg-blue-500"}>
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Active Courses</p>
              <p className="text-2xl font-bold text-slate-900">{courseStats.total}</p>
              <p className="text-sm text-green-600">{courseStats.change} from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Growth Rate</p>
              <p className="text-2xl font-bold text-slate-900">{growthStats.total}</p>
              <p className="text-sm text-green-600">{growthStats.change} from last month</p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Recent Signups</h2>
          <div className="space-y-3">
            {[
              { name: "John Doe", email: "john@example.com", date: "2 hours ago" },
              { name: "Jane Smith", email: "jane@example.com", date: "4 hours ago" },
              { name: "Mike Johnson", email: "mike@example.com", date: "6 hours ago" },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
                <span className="text-sm text-slate-500">{user.date}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Popular Courses</h2>
          <div className="space-y-3">
            {[
              { title: "Complete Python Bootcamp", enrollments: 1234 },
              { title: "React - The Complete Guide", enrollments: 987 },
              { title: "Machine Learning A-Z", enrollments: 756 },
            ].map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <p className="font-medium text-slate-900">{course.title}</p>
                <span className="text-sm text-slate-600">{course.enrollments} enrollments</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
