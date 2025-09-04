"use client"

import { useState } from "react"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import AnnouncementModal from "@/components/announcement-modal"
import { Briefcase, GraduationCap, BookOpen, Info, MapPin, Calendar, Search, Filter } from 'lucide-react'

// Mock data for announcements
const mockAnnouncements = [
  {
    id: 1,
    type: "job",
    title: "Senior Frontend Developer",
    preview: "Join our team to build the next generation of web applications...",
    source: "TechCorp Inc.",
    location: "San Francisco, CA",
    dateCreated: "2024-01-20",
    description: "We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for developing user-facing features and ensuring the technical feasibility of UI/UX designs.",
    responsibilities: [
      "Develop new user-facing features using React.js",
      "Build reusable components and front-end libraries",
      "Ensure the technical feasibility of UI/UX designs",
      "Optimize applications for maximum speed and scalability",
      "Collaborate with back-end developers and web designers"
    ],
    requirements: [
      "5+ years of experience with React.js and modern JavaScript",
      "Strong proficiency in HTML, CSS, and JavaScript",
      "Experience with state management libraries (Redux, Zustand)",
      "Familiarity with RESTful APIs and GraphQL",
      "Bachelor's degree in Computer Science or related field"
    ],
    contact: {
      email: "careers@techcorp.com",
      phone: "+1 (555) 123-4567",
      website: "https://techcorp.com/careers"
    }
  },
  {
    id: 2,
    type: "internship",
    title: "Data Science Internship",
    preview: "Summer internship program for aspiring data scientists...",
    source: "DataLab Solutions",
    location: "Remote",
    dateCreated: "2024-01-18",
    description: "Join our 12-week summer internship program and gain hands-on experience in data science and machine learning projects.",
    responsibilities: [
      "Assist in data collection and preprocessing",
      "Develop machine learning models under supervision",
      "Create data visualizations and reports",
      "Participate in team meetings and project planning",
      "Present findings to stakeholders"
    ],
    requirements: [
      "Currently pursuing a degree in Data Science, Statistics, or related field",
      "Basic knowledge of Python and SQL",
      "Familiarity with pandas, numpy, and scikit-learn",
      "Strong analytical and problem-solving skills",
      "Excellent communication skills"
    ],
    contact: {
      email: "internships@datalab.com",
      phone: "+1 (555) 987-6543",
      website: "https://datalab.com/internships"
    }
  },
  {
    id: 3,
    type: "resource",
    title: "Free AWS Certification Study Guide",
    preview: "Comprehensive study materials for AWS certification exams...",
    source: "CloudMasters Academy",
    location: "Online",
    dateCreated: "2024-01-15",
    description: "Complete study guide with practice exams, hands-on labs, and video tutorials for AWS certification preparation.",
    contact: {
      email: "support@cloudmasters.com",
      website: "https://cloudmasters.com/aws-guide"
    }
  },
  {
    id: 4,
    type: "info",
    title: "Tech Career Fair 2024",
    preview: "Annual tech career fair featuring 100+ companies and networking opportunities...",
    source: "Tech Events Network",
    location: "Austin, TX",
    dateCreated: "2024-01-12",
    description: "Join us for the largest tech career fair in Texas. Connect with hiring managers from top tech companies, attend workshops, and discover new opportunities.",
    contact: {
      email: "info@techevents.com",
      website: "https://techevents.com/career-fair-2024"
    }
  }
]

const announcementTypes = [
  { value: "all", label: "All Types" },
  { value: "job", label: "Jobs" },
  { value: "internship", label: "Internships" },
  { value: "resource", label: "Resources" },
  { value: "info", label: "Info" }
]

export default function UpLinkPage() {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")

  const getIcon = (type: string) => {
    switch (type) {
      case "job":
        return Briefcase
      case "internship":
        return GraduationCap
      case "resource":
        return BookOpen
      case "info":
        return Info
      default:
        return Info
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "job":
        return "bg-green-100 text-green-600"
      case "internship":
        return "bg-blue-100 text-blue-600"
      case "resource":
        return "bg-purple-100 text-purple-600"
      case "info":
        return "bg-yellow-100 text-yellow-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const filteredAnnouncements = mockAnnouncements
    .filter(announcement => 
      selectedType === "all" || announcement.type === selectedType
    )
    .filter(announcement =>
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.preview.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation isLoggedIn={true} isSubscribed={true} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">UpLink</h1>
          <p className="text-slate-600">Discover job opportunities, internships, resources, and important announcements</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Type Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {announcementTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            Showing {filteredAnnouncements.length} announcement{filteredAnnouncements.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-4">
          {filteredAnnouncements.map((announcement) => {
            const IconComponent = getIcon(announcement.type)
            return (
              <div
                key={announcement.id}
                className="card hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedAnnouncement(announcement)}
              >
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${getIconColor(announcement.type)}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">{announcement.title}</h3>
                        {announcement.preview && (
                          <p className="text-slate-600 text-sm mb-2 line-clamp-2">{announcement.preview}</p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-slate-500">
                          <span className="font-medium">{announcement.source}</span>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {announcement.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(announcement.dateCreated)}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                        announcement.type === 'job' ? 'bg-green-100 text-green-800' :
                        announcement.type === 'internship' ? 'bg-blue-100 text-blue-800' :
                        announcement.type === 'resource' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {announcement.type}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredAnnouncements.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No announcements found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm("")
                setSelectedType("all")
              }}
              className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Announcement Modal */}
      {selectedAnnouncement && (
        <AnnouncementModal
          announcement={selectedAnnouncement}
          onClose={() => setSelectedAnnouncement(null)}
        />
      )}

      <Footer />
    </div>
  )
}
