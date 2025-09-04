"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Calendar, Clock, User, ExternalLink, ArrowLeft } from "lucide-react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { get_course, enroll } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import ProtectedRoute from "@/components/protected-route"


export default function CoursePreviewPage() {
  const { user } = useAuth()
  const params = useParams()
  const course_id = params.id
  const [courseData, setCourseData] = useState<any>({})

  async function fetch_course(course_id: string) {
    try {
      const response = await get_course(course_id)

      return response?.data
    } catch (error: any) {
      console.error("[ERROR] Failed to get course", error.message)
    }
  }

  useEffect(() => {
    async function fetch_course_data() {
      if (!course_id) return // Wait for course ID to be available
      
      try {
        const res = await fetch_course(course_id as string)
        setCourseData(res)

      } catch (error: any) {
        console.error("[ERROR] Failed to get course details", error?.message)
      }
    }

    fetch_course_data()
  }, [course_id])


  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const daysLeft = getDaysUntilExpiry(courseData.expiry_date)

  // If user is null return
  const handleEnroll = async () => {
    await enroll(user.id, course_id);
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navigation isLoggedIn={true} showLogout={false} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Link
            href="/courses"
            className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Courses
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Course Header */}
              <div className="card mb-8">
                <img
                  src={courseData.image_url || "/placeholder.svg"}
                  alt={courseData.title}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />

                <div className="flex items-center space-x-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {courseData.category}
                  </span>
                  
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4">{courseData.title}</h1>

                <div className="prose max-w-none">
                  <p className="text-slate-700 mb-4">
                    {courseData.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="card sticky top-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Course Details</h3>

                <div className="space-y-3 text-sm mb-6">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Publisher:</span>
                    <span className="font-medium">{courseData.publisher}</span>
                  </div>
                  
                  {/* Track the number of students enrolled for this course */}
                  {/* <div className="flex justify-between">
                    <span className="text-slate-600">Students Enrolled:</span>
                    <span className="font-medium">{courseData.students.toLocaleString()}</span>
                  </div> */}

                  <div className="flex justify-between">
                    <span className="text-slate-600">Original Cost (At time of upload):</span>
                    <span className="font-medium">{courseData.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Added:</span>
                    <span className="font-medium">{formatDate(courseData.created_at)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Expires:</span>
                    <span className="font-medium">{formatDate(courseData.expiry_date)}</span>
                  </div>
                  
                </div>

                <button 
                className="btn-primary w-full inline-flex items-center justify-center mb-4"
                onClick={() => handleEnroll()}>
                  <a
                    href={courseData.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Enroll on Udemy
                  </a>
                  <ExternalLink className="ml-2 w-4 h-4" />
                </button>

                <p className="text-xs text-slate-500 text-center">You'll be redirected to Udemy to complete enrollment</p>
              </div>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
