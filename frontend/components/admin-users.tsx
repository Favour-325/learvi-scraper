"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, Mail, Shield, User } from "lucide-react"

export default function AdminUsers() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [users, setUsers] = useState([
    {
      id: 1,
      email: "john.doe@example.com",
      userType: "User",
      subscriptionStatus: "Active",
      isSubscribed: true,
      joinDate: "2024-01-15",
      coursesAccessed: 12,
    },
    {
      id: 2,
      email: "jane.smith@example.com",
      userType: "User",
      subscriptionStatus: "Active",
      isSubscribed: true,
      joinDate: "2024-01-10",
      coursesAccessed: 8,
    },
    {
      id: 3,
      email: "admin@learvi.com",
      userType: "Admin",
      subscriptionStatus: "N/A",
      isSubscribed: false,
      joinDate: "2024-01-01",
      coursesAccessed: 0,
    },
  ])

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "User",
    isSubscribed: false,
  })

  const [editingUser, setEditingUser] = useState<any>(null)
  const [editFormData, setEditFormData] = useState({
    email: "",
    userType: "User",
    isSubscribed: false,
  })
  const [validationErrors, setValidationErrors] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newUser = {
      id: users.length + 1,
      email: formData.email,
      userType: formData.userType,
      subscriptionStatus: formData.isSubscribed ? "Active" : "Inactive",
      isSubscribed: formData.isSubscribed,
      joinDate: new Date().toISOString().split("T")[0],
      coursesAccessed: 0,
    }
    setUsers([...users, newUser])
    setFormData({ email: "", password: "", userType: "User", isSubscribed: false })
    setShowCreateForm(false)
  }

  const deleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id))
  }

  const toggleSubscription = (id: number) => {
    setUsers(
      users.map((user) =>
        user.id === id
          ? {
              ...user,
              isSubscribed: !user.isSubscribed,
              subscriptionStatus: !user.isSubscribed ? "Active" : "Inactive",
            }
          : user,
      ),
    )
  }

  const validateUserForm = (data: any) => {
    const errors: any = {}

    if (!data.email.trim()) errors.email = "Email address is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = "Please enter a valid email address"
    if (!data.userType) errors.userType = "User type is required"

    return errors
  }

  const startEditUser = (user: any) => {
    setEditingUser(user)
    setEditFormData({
      email: user.email,
      userType: user.userType,
      isSubscribed: user.isSubscribed,
    })
    setValidationErrors({})
  }

  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const errors = validateUserForm(editFormData)
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setUsers(
      users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              ...editFormData,
              subscriptionStatus: editFormData.isSubscribed ? "Active" : "Inactive",
            }
          : user,
      ),
    )

    setEditingUser(null)
    setEditFormData({ email: "", userType: "User", isSubscribed: false })
    setValidationErrors({})
  }

  const cancelEditUser = () => {
    setEditingUser(null)
    setEditFormData({ email: "", userType: "User", isSubscribed: false })
    setValidationErrors({})
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Manage Users</h1>
          <p className="text-slate-600">Create and manage user accounts</p>
        </div>
        <button onClick={() => setShowCreateForm(true)} className="btn-primary inline-flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create User
        </button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Create New User</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="user@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">User Type</label>
                <select
                  value={formData.userType}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter password"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isSubscribed"
                checked={formData.isSubscribed}
                onChange={(e) => setFormData({ ...formData, isSubscribed: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isSubscribed" className="ml-2 text-sm font-medium text-slate-700">
                Set as subscribed user
              </label>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Create User
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

      {/* Edit User Form */}
      {editingUser && (
        <div className="card mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Edit User</h2>
          <form onSubmit={handleEditUserSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.email ? "border-red-300" : "border-slate-300"
                  }`}
                  placeholder="user@example.com"
                />
                {validationErrors.email && <p className="text-red-500 text-sm mt-1">{validationErrors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">User Type</label>
                <select
                  value={editFormData.userType}
                  onChange={(e) => setEditFormData({ ...editFormData, userType: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.userType ? "border-red-300" : "border-slate-300"
                  }`}
                >
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
                {validationErrors.userType && <p className="text-red-500 text-sm mt-1">{validationErrors.userType}</p>}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="editIsSubscribed"
                checked={editFormData.isSubscribed}
                onChange={(e) => setEditFormData({ ...editFormData, isSubscribed: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="editIsSubscribed" className="ml-2 text-sm font-medium text-slate-700">
                Set as subscribed user
              </label>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn-primary">
                Update User
              </button>
              <button
                type="button"
                onClick={cancelEditUser}
                className="px-4 py-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-medium text-slate-700">User</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Type</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Join Date</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Courses</th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-100">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-slate-400 mr-2" />
                      <span className="font-medium text-slate-900">{user.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      {user.userType === "Admin" ? (
                        <Shield className="w-4 h-4 text-blue-600 mr-2" />
                      ) : (
                        <User className="w-4 h-4 text-slate-400 mr-2" />
                      )}
                      <span className={user.userType === "Admin" ? "text-blue-600 font-medium" : "text-slate-600"}>
                        {user.userType}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => user.userType !== "Admin" && toggleSubscription(user.id)}
                      disabled={user.userType === "Admin"}
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.subscriptionStatus === "Active"
                          ? "bg-green-100 text-green-800"
                          : user.subscriptionStatus === "N/A"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                      } ${user.userType !== "Admin" ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed"}`}
                    >
                      {user.subscriptionStatus}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{new Date(user.joinDate).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-slate-600">{user.coursesAccessed}</td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditUser(user)}
                        className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
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
