import Link from "next/link"
import { Calendar, Clock, User } from "lucide-react"

interface Course {
  id: number
  title: string
  description: string
  category: string
  publisher: string
  expiry_date: string
  created_at: any
  image_url: any
}

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      {/* Course Image */}
      <div className="relative mb-4">
        <img
          src={course.image_url || "/placeholder.svg"}
          alt={course.title}
          className="w-full h-48 object-cover rounded-lg"
        />
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 backdrop-blur-sm text-slate-700 px-2 py-1 rounded-md text-xs font-medium">
            {course.category}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 text-lg leading-tight line-clamp-2">{course.title}</h3>

        <p className="text-slate-600 text-sm line-clamp-3">{course.description}</p>

        {/* Course Meta */}
        <div className="space-y-2 text-sm text-slate-500">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{course.publisher}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Added {formatDate(course.created_at)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Expires {formatDate(course.expiry_date)}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          href={`/courses/${course.id}`}
          className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Preview Course
        </Link>
      </div>
    </div>
  )
}
