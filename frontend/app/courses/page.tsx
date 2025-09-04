"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/compat/router'
import Navigation from "@/components/navigation"
import CourseCard from "@/components/course-card"
import Footer from "@/components/footer"
import { get_courses } from "@/lib/api"
import { Search, Filter, SortAsc, ChevronLeft, ChevronRight } from "lucide-react"
import ProtectedRoute from "@/components/protected-route"
import { useAuth } from "@/contexts/AuthContext"

// Mock data

const categories = [
  "All",
  "Programming",
  "Web Development",
  "Data Science",
  "Marketing",
  "Design",
  "Cloud Computing",
  "Mobile Development",
  "DevOps",
  "Cybersecurity",
  "Artificial Intelligence",
  "Machine Learning",
  "Blockchain",
  "Game Development",
  "UI/UX Design",
  "Digital Marketing",
  "Business",
  "Photography",
  "Music",
  "Health & Fitness",
]

const COURSES_PER_PAGE = 21

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [pageData, setPageData] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("latest")
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter();

  async function getAllCourses(params: any = {}) {
    const { category, search, limit=10, offset=0 } = params

    try {
      const response = await get_courses({
        params: {
          ...(category && { category }), // Creates category if it exists
          ...(search && { search }),
          limit,
          offset
        }
      })

      return response?.data
    } catch (error:any) {
      console.error("Failed to get courses", error.message)
    }
  }
  
  useEffect(() => {
    async function fetchCourses() {
      try {
        let data;
        if (searchTerm && selectedCategory) {
            data = await getAllCourses({ search: searchTerm, category: selectedCategory });
            
        } else if (searchTerm) {
          data = await getAllCourses({ search: searchTerm });
          
        } else if (selectedCategory) {
          data = await getAllCourses({ category: selectedCategory });

        } else {
          data = await getAllCourses();
        }
        
        setPageData(data)
        setCourses(data?.results)

      } catch (error:any) {
        console.error("Failed to fetch courses", error.message)
      }
    }
    
    fetchCourses()
  }, [searchTerm, selectedCategory])

  const filteredCourses = courses
    .filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .filter((course) => selectedCategory === "All" || course.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else if (sortBy === "expiring") {
        return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
      }
      return 0
    })

  // Pagination logic
  const totalPages = Math.ceil(filteredCourses.length / COURSES_PER_PAGE)
  const startIndex = (currentPage - 1) * COURSES_PER_PAGE
  const endIndex = startIndex + COURSES_PER_PAGE
  const currentCourses = filteredCourses.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  const handleFilterChange = (filterType: string, value: string) => {
    setCurrentPage(1)
    if (filterType === "search") {
      setSearchTerm(value)
    } else if (filterType === "category") {
      setSelectedCategory(value)
    } else if (filterType === "sort") {
      setSortBy(value)
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navigation isLoggedIn={true} showLogout={false} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Your Courses</h1>
            <p className="text-slate-600">Discover and enroll in curated 100% discounted Udemy courses</p>
          </div>

          {/* Search and Filters */}
          {/* Search and Sort - Same Line */}
          <div className="mb-4 flex flex-col sm:flex-row gap-4 sm:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center space-x-2 sm:flex-shrink-0">
              <SortAsc className="w-5 h-5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[160px]"
              >
                <option value="latest">Latest Added</option>
                <option value="expiring">Expiring Soon</option>
              </select>
            </div>
          </div>

          {/* Category Badges - Horizontal Scrolling Layout */}
          <div className="mb-8">
            <div className="relative">
              {/* Scrollable container with hidden scrollbar */}
              <div
                className="flex gap-3 overflow-x-auto scrollbar-hide pb-2"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                  WebkitScrollbar: { display: "none" },
                }}
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange("category", category)}
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-blue-500 text-white shadow-md transform scale-105"
                        : "bg-white text-slate-600 border border-slate-300 hover:bg-slate-50 hover:border-slate-400 hover:shadow-sm"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Gradient fade effects for visual indication of scrollable content */}
              <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-slate-50 to-transparent pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none"></div>
            </div>

            {/* Optional: Scroll hint text for mobile users */}
            <p className="text-xs text-slate-400 mt-2 text-center sm:hidden">
              Swipe left or right to see more categories
            </p>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-slate-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredCourses.length)} of {filteredCourses.length} course
              {filteredCourses.length !== 1 ? "s" : ""}
            </p>
            {totalPages > 1 && (
              <p className="text-slate-600">
                Page {currentPage} of {totalPages}
              </p>
            )}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {currentCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      currentPage === page
                        ? "bg-blue-500 text-white"
                        : "text-slate-700 bg-white border border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}

          {/* Empty State */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No courses found matching your criteria.</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                  setCurrentPage(1)
                }}
                className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
        <Footer />
      </div>
    </ProtectedRoute>
  )
}
