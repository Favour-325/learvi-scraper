"use client"

import { useState, useEffect } from "react"
import { User, Mail, Calendar } from 'lucide-react'
import Navigation from "@/components/navigation"
import { useRouter } from "next/navigation"
import Footer from "@/components/footer"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/AuthContext"
import { get_user_enrollment } from "@/lib/api"

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [recentCourses, setRecentCourses] = useState<any[]>([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  async function get_enrollments() {
    if (!user) {
      return
    };
    try {
      const response = await get_user_enrollment(user.id);
      setRecentCourses(response?.data)
    } catch (error: any) {
      console.error("[ERROR] Failed to get user's enrolled courses", error)
    }
  }

  useEffect(() => {
    get_enrollments()
  }, [user])

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Password update:", passwordData)
    setShowPasswordForm(false)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const getMembershipDuration = (joinDate: string) => {
    const join = new Date(joinDate)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - join.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `${diffDays} days`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? 's' : ''}`
    } else {
      const years = Math.floor(diffDays / 365)
      const remainingMonths = Math.floor((diffDays % 365) / 30)
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
    }
  }

  if (!user) {
    return
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navigation isLoggedIn={true} showLogout={true} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Centered Profile Content */}
          <div className="max-w-2xl mx-auto">
            {/* Profile Header */}
            <div className="text-center mb-12">
              {/* Round Profile Icon */}
              <div className="relative inline-block mb-6">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <Mail className="w-5 h-5 text-slate-400" />
                  <span className="text-xl font-medium text-slate-900">{user.email}</span>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <Calendar className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">
                    Since {getMembershipDuration(user.joined_at)}
                  </span>
                </div>

                {/* <div className="flex items-center justify-center space-x-3">
                  <BookOpen className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-600">
                    {user.coursesAccessed} courses accessed
                  </span>
                </div> */}
              </div>
            </div>

            <div className="space-y-8">
              {/* Recent Courses */}
              <div className="card">
                <h2 className="text-xl font-semibold text-slate-900 mb-6 text-center">Recent Courses</h2>

                <div className="space-y-3">
                  {recentCourses.map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                      <div className="flex-1">
                        <h3 className="font-medium text-slate-900">{course.title}</h3>
                        <p className="text-sm text-slate-600">{course.category}</p>
                      </div>
                      <div className="text-sm text-slate-500">
                        {new Date(course.accessedDate).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-6">
                  <a href="/courses" className="text-blue-600 hover:text-blue-700 font-medium">
                    View All Courses →
                  </a>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
