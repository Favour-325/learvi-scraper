"use client"

import { X, MapPin, Calendar, Phone, Mail, ExternalLink, Briefcase, GraduationCap, BookOpen, Info } from 'lucide-react'

interface AnnouncementModalProps {
  announcement: any
  onClose: () => void
}

export default function AnnouncementModal({ announcement, onClose }: AnnouncementModalProps) {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })
  }

  const IconComponent = getIcon(announcement.type)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(announcement.type)}`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{announcement.title}</h2>
              <p className="text-sm text-slate-600">{announcement.source}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta Information */}
          <div className="flex items-center space-x-6 text-sm text-slate-600 mb-6">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {announcement.location}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(announcement.dateCreated)}
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
              announcement.type === 'job' ? 'bg-green-100 text-green-800' :
              announcement.type === 'internship' ? 'bg-blue-100 text-blue-800' :
              announcement.type === 'resource' ? 'bg-purple-100 text-purple-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {announcement.type}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Description</h3>
            <p className="text-slate-700 leading-relaxed">{announcement.description}</p>
          </div>

          {/* Responsibilities (for jobs/internships) */}
          {announcement.responsibilities && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Responsibilities</h3>
              <ul className="space-y-2">
                {announcement.responsibilities.map((responsibility: string, index: number) => (
                  <li key={index} className="text-slate-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {responsibility}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements (for jobs/internships) */}
          {announcement.requirements && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Requirements</h3>
              <ul className="space-y-2">
                {announcement.requirements.map((requirement: string, index: number) => (
                  <li key={index} className="text-slate-700 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    {requirement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact Information */}
          {announcement.contact && (
            <div className="bg-slate-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                {announcement.contact.email && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-slate-400 mr-3" />
                    <a
                      href={`mailto:${announcement.contact.email}`}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {announcement.contact.email}
                    </a>
                  </div>
                )}
                {announcement.contact.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-slate-400 mr-3" />
                    <a
                      href={`tel:${announcement.contact.phone}`}
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      {announcement.contact.phone}
                    </a>
                  </div>
                )}
                {announcement.contact.website && (
                  <div className="flex items-center">
                    <ExternalLink className="w-5 h-5 text-slate-400 mr-3" />
                    <a
                      href={announcement.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-4 rounded-b-2xl">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              Close
            </button>
            {announcement.contact?.website && (announcement.type === "job" || announcement.type === "interview") && (
              <a
                href={announcement.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                Apply Now
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            )}
            {announcement.contact?.website && (announcement.type === "resource" || announcement.type === "info") && (
              <a
                href={announcement.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center"
              >
                Check Out
                <ExternalLink className="ml-2 w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
