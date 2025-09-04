"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { get_announcements, create_announcement, update_announcement, delete_announcement } from "@/lib/api"
import { Plus, Edit, Trash2, Briefcase, GraduationCap, BookOpen, Info } from "lucide-react"
import { Announcement } from "@/types/auth"

export default function AdminUpLink() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<any>(null)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  const [formData, setFormData] = useState({
    type: "job",
    title: "",
    preview: "",
    source: "",
    location: "",
    description: "",
    responsibilities: "",
    requirements: "",
    email: "",
    phone: "",
    link: "",
  })

  const [editFormData, setEditFormData] = useState({
    id: 0,
    type: "job",
    title: "",
    preview: "",
    source: "",
    location: "",
    description: "",
    responsibilities: "",
    requirements: "",
    email: "",
    phone: "",
    link: "",
  })

  const [validationErrors, setValidationErrors] = useState<any>({})

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

  async function fetchAnnouncements () {
    const response = await get_announcements();
    setAnnouncements(response.data);
  }

  useEffect(() => {
    fetchAnnouncements();
  }, [])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      console.log(formData)
      const response = await create_announcement(formData);
      
    } catch (error: any) {
      console.error("[ERROR] Failed to create announcement", error)
    }

    setFormData({
      type: "job",
      title: "",
      preview: "",
      source: "",
      location: "",
      description: "",
      responsibilities: "",
      requirements: "",
      email: "",
      phone: "",
      link: ""
    })
    setShowCreateForm(false)
    fetchAnnouncements();
  }

  // Update announcement API
  const handleEditAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateAnnouncementForm(editFormData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      console.log(editFormData)
      const response = await update_announcement(editFormData.id, editFormData);
      
    } catch (error: any) {
      console.error("[ERROR] Failed to update announcement", error)
    }

    setFormData({
      type: "job",
      title: "",
      preview: "",
      source: "",
      location: "",
      description: "",
      responsibilities: "",
      requirements: "",
      email: "",
      phone: "",
      link: ""
    })
    setShowCreateForm(false)
    fetchAnnouncements();

    setEditingAnnouncement(null)
    setEditFormData({
      id: 0,
      type: "job",
      title: "",
      preview: "",
      source: "",
      location: "",
      description: "",
      responsibilities: "",
      requirements: "",
      email: "",
      phone: "",
      link: "",
    })
    setValidationErrors({})
  }

  const deleteAnnouncement = async (id: number) => {
    const response = await delete_announcement(id);

    if (response.status === 200) {
      // Handle this event
    }
  }

  // Pre-fills the edit state with the values of the selected announcement
  const startEditAnnouncement = (announcement: any) => {
    setEditingAnnouncement(announcement)
    setEditFormData({
      id: announcement.id,
      type: announcement.type,
      title: announcement.title,
      preview: announcement.preview || "",
      source: announcement.source,
      location: announcement.location,
      description: announcement.description || "",
      responsibilities: announcement.responsibilities || "",
      requirements: announcement.requirements || "",
      email: announcement.email || "",
      phone: announcement.phone || "",
      link: announcement.link || "",
    })
    setValidationErrors({})
  }

  const cancelEditAnnouncement = () => {
    setEditingAnnouncement(null)
    setEditFormData({
      id: 0,
      type: "job",
      title: "",
      preview: "",
      source: "",
      location: "",
      description: "",
      responsibilities: "",
      requirements: "",
      email: "",
      phone: "",
      link: "",
    })
    setValidationErrors({})
  }

  const validateAnnouncementForm = (data: any) => {
    const errors: any = {}

    if (!data.title.trim()) errors.title = "Title is required"
    if (!data.source.trim()) errors.source = "Source is required"
    if (!data.location.trim()) errors.location = "Location is required"
    if (!data.description.trim()) errors.description = "Description is required"
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (data.link && !data.link.startsWith("http")) {
      errors.link = "Please enter a valid URL"
    }

    return errors
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">UpLink Management</h1>
          <p className="text-slate-600">Manage announcements, job offers, internships, and resources</p>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="btn-primary inline-flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Announcement
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Create New Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="job">Job Offer</option>
                  <option value="internship">Internship</option>
                  <option value="resource">Resource</option>
                  <option value="info">Information</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                <input
                  type="text"
                  required
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preview</label>
              <textarea
                rows={2}
                value={formData.preview}
                onChange={(e) => setFormData({ ...formData, preview: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short preview text..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={4}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {(formData.type === "job" || formData.type === "internship") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Responsibilities (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.responsibilities}
                    onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Requirements (one per line)</label>
                  <textarea
                    rows={3}
                    value={formData.requirements}
                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Website</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Create Announcement
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Announcement Form */}
      {editingAnnouncement && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Edit Announcement</h2>
          <form onSubmit={handleEditAnnouncementSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                <select
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="job">Job Offer</option>
                  <option value="internship">Internship</option>
                  <option value="resource">Resource</option>
                  <option value="info">Information</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.title ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {validationErrors.title && <p className="text-red-500 text-sm mt-1">{validationErrors.title}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Source</label>
                <input
                  type="text"
                  value={editFormData.source}
                  onChange={(e) => setEditFormData({ ...editFormData, source: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.source ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {validationErrors.source && <p className="text-red-500 text-sm mt-1">{validationErrors.source}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input
                  type="text"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.location ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {validationErrors.location && <p className="text-red-500 text-sm mt-1">{validationErrors.location}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preview</label>
              <textarea
                rows={2}
                value={editFormData.preview}
                onChange={(e) => setEditFormData({ ...editFormData, preview: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short preview text..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={4}
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.description ? "border-red-300" : "border-slate-300"
                }`}
              />
              {validationErrors.description && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.description}</p>
              )}
            </div>

            {(editFormData.type === "job" || editFormData.type === "internship") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Responsibilities (one per line)
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.responsibilities}
                    onChange={(e) => setEditFormData({ ...editFormData, responsibilities: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Requirements (one per line)</label>
                  <textarea
                    rows={3}
                    value={editFormData.requirements}
                    onChange={(e) => setEditFormData({ ...editFormData, requirements: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.email ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contact Website</label>
                <input
                  type="url"
                  value={editFormData.link}
                  onChange={(e) => setEditFormData({ ...editFormData, link: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.link ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {validationErrors.link && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.link}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Update Announcement
              </button>
              <button
                type="button"
                onClick={cancelEditAnnouncement}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Announcement</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Source</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Location</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((announcement) => {
                const IconComponent = getIcon(announcement.type)
                return (
                  <tr key={announcement.id} className="border-b border-slate-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${getIconColor(announcement.type)}`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-slate-900">{announcement.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          announcement.type === "job"
                            ? "bg-green-100 text-green-800"
                            : announcement.type === "internship"
                              ? "bg-blue-100 text-blue-800"
                              : announcement.type === "resource"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {announcement.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{announcement.source}</td>
                    <td className="py-3 px-4 text-slate-600">{announcement.location}</td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(announcement.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => startEditAnnouncement(announcement)}
                          className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteAnnouncement(announcement.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
