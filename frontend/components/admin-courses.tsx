"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { get_courses, create_course, update_course, delete_course } from "@/lib/api"
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react"

export default function AdminCourses() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: "Complete Python Bootcamp",
      category: "Programming",
      instructor: "Jose Portilla",
      link: "https://udemy.com/course/complete-python-bootcamp",
      expiry_date: "2024-02-15",
      is_active: true,
    },
    {
      id: 2,
      title: "React - The Complete Guide",
      category: "Web Development",
      instructor: "Maximilian Schwarzmüller",
      link: "https://udemy.com/course/react-the-complete-guide",
      expiry_date: "2024-02-20",
      is_active: true,
    },
  ])

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    instructor: "",
    link: "",
    expiry_date: "",
  })

  const [editingCourse, setEditingCourse] = useState<any>(null)
  const [editFormData, setEditFormData] = useState({
    id: 0,
    title: "",
    description: "",
    category: "",
    instructor: "",
    link: "",
    expiry_date: "",
  })

  const [validationErrors, setValidationErrors] = useState<any>({})

  async function fetchCourses () {
      const response = await get_courses({});
      const data = response.data
      console.log(data.results)
      setCourses(data.results);
    }
  
    useEffect(() => {
      fetchCourses();
    }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await create_course(formData);
    } catch (error: any) {
      console.error("[ERROR] Failed to create new course", error)
    }

    setFormData({
      title: "",
      description: "",
      category: "",
      instructor: "",
      link: "",
      expiry_date: "",
    })
    setShowCreateForm(false)
  }

  const validateForm = (data: any) => {
    const errors: any = {}

    if (!data.title.trim()) errors.title = "Course title is required"
    if (!data.description.trim()) errors.description = "Description is required"
    if (!data.category) errors.category = "Category is required"
    //if (!data.instructor.trim()) errors.instructor = "Instructor name is required"
    if (!data.link.trim()) errors.link = "Udemy link is required"
    else if (!data.link.startsWith("http")) errors.link = "Please enter a valid URL"
    if (new Date(data.expiry_date) <= new Date()) errors.expiry_date = "Expiry date must be in the future"

    return errors
  }

  const toggleCourseStatus = (id: number) => {
    setCourses(courses.map((course) => (course.id === id ? { ...course, is_active: !course.is_active } : course)))
  }

  const deleteCourse = async (id: number) => {
    try {
      const response = await delete_course(id);

      if (response.status === 200) {
        // Toastify
      }
    } catch (error: any) {
      console.error("[ERROR] Failed to delete course", error)
    }

  }

  const startEdit = (course: any) => {
    setEditingCourse(course)
    setEditFormData({
      id: course.id,
      title: course.title,
      description: course.description || "",
      category: course.category,
      instructor: course.instructor,
      link: course.link,
      expiry_date: course.expiry_date,
    })
    setValidationErrors({})
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateForm(editFormData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    try {
      const response = await update_course(editFormData.id, editFormData)

    } catch (error: any) {
      console.error("[ERROR] Failed to update course", error)
    }

    setEditingCourse(null)
    setEditFormData({
      id: 0,
      title: "",
      description: "",
      category: "",
      instructor: "",
      link: "",
      expiry_date: "",
    })
    setValidationErrors({})
  }

  const cancelEdit = () => {
    setEditingCourse(null)
    setEditFormData({
      id: 0,
      title: "",
      description: "",
      category: "",
      instructor: "",
      link: "",
      expiry_date: "",
    })
    setValidationErrors({})
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Courses</h1>
          <p className="text-slate-600">Add, edit, and manage course listings</p>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="btn-primary inline-flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Add Course
        </button>
      </div>

      {/* Create Course Form */}
      {showCreateForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Add New Course</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Category</option>
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Instructor</label>
                <input
                  type="text"
                  required
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Udemy Link</label>
              <input
                type="url"
                required
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Add Course
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

      {/* Edit Course Form */}
      {editingCourse && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Edit Course</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Course Title</label>
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={editFormData.category}
                  onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.category ? "border-red-300" : "border-slate-300"
                  }`}
                >
                  <option value="">Select Category</option>
                  <option value="Programming">Programming</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </select>
                {validationErrors.category && <p className="text-red-500 text-sm mt-1">{validationErrors.category}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Instructor</label>
                <input
                  type="text"
                  value={editFormData.instructor}
                  onChange={(e) => setEditFormData({ ...editFormData, instructor: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.instructor ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {validationErrors.instructor && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.instructor}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={editFormData.expiry_date}
                  onChange={(e) => setEditFormData({ ...editFormData, expiry_date: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.expiry_date ? "border-red-300" : "border-slate-300"
                  }`}
                />
                {validationErrors.expiry_date && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.expiry_date}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Udemy Link</label>
              <input
                type="url"
                value={editFormData.link}
                onChange={(e) => setEditFormData({ ...editFormData, link: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  validationErrors.link ? "border-red-300" : "border-slate-300"
                }`}
              />
              {validationErrors.link && <p className="text-red-500 text-sm mt-1">{validationErrors.link}</p>}
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Update Course
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Courses Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">Course</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Category</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Instructor</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Expiry</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course.id} className="border-b border-slate-100">
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{course.title}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{course.category}</td>
                  <td className="py-3 px-4 text-slate-600">{course.instructor}</td>
                  <td className="py-3 px-4 text-slate-600">{course.expiry_date}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleCourseStatus(course.id)}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <a
                        href={course.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => startEdit(course)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteCourse(course.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
