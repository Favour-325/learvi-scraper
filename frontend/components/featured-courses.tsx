import Link from "next/link"
import { Clock, Users, Star, ArrowRight } from 'lucide-react'

export default function FeaturedCourses() {
  const featuredCourses = [
    {
      id: 1,
      title: "Complete Python Programming",
      description: "Learn Python from scratch with hands-on projects and real-world examples.",
      image: "/placeholder.svg?height=200&width=300&text=Python+Course",
      instructor: "Jose Portilla",
      duration: "40 hours",
      students: "150K+",
      rating: 4.8,
      category: "Programming"
    },
    {
      id: 2,
      title: "Web Development Bootcamp",
      description: "Build modern websites and web applications using HTML, CSS, JavaScript, and React.",
      image: "/placeholder.svg?height=200&width=300&text=Web+Dev+Course",
      instructor: "Angela Yu",
      duration: "65 hours",
      students: "200K+",
      rating: 4.9,
      category: "Web Development"
    },
    {
      id: 3,
      title: "Data Science Masterclass",
      description: "Master data analysis, visualization, and machine learning with Python.",
      image: "/placeholder.svg?height=200&width=300&text=Data+Science+Course",
      instructor: "Kirill Eremenko",
      duration: "45 hours",
      students: "120K+",
      rating: 4.7,
      category: "Data Science"
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Courses</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Discover our most popular courses, carefully selected to help you achieve your learning goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-blue-200 transform hover:-translate-y-1">
              <div className="relative">
                <img
                  src={course.image || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-sm font-medium">
                    {course.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-bold text-xl text-slate-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">{course.description}</p>

                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <span className="font-medium">{course.instructor}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.students}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
                    {course.rating}
                  </div>
                </div>

                <Link
                  href={`/courses/${course.id}`}
                  className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  View Course
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/courses" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
            View All Courses
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
