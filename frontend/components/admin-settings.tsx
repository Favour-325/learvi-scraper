"use client"

import { useState } from "react"
import { Save, Clock, Globe, Calendar, Gift } from 'lucide-react'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    scrapeFrequency: "daily",
    discardNonEnglish: true,
    autoExpirationDays: 30,
    freeStarterCourse: "1",
  })

  const [courses] = useState([
    { id: "1", title: "Complete Python Bootcamp From Zero to Hero" },
    { id: "2", title: "The Complete Web Developer Course 3.0" },
    { id: "3", title: "Machine Learning A-Z: Hands-On Python & R" },
    { id: "4", title: "React - The Complete Guide" },
  ])

  const handleSave = () => {
    // Handle save settings logic
    console.log("Saving settings:", settings)
    alert("Settings saved successfully!")
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
          <p className="text-slate-600">Configure system settings and preferences</p>
        </div>
        <button onClick={handleSave} className="btn-primary inline-flex items-center">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* Scraper Settings */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Clock className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-slate-900">Scraper Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Scrape Frequency</label>
              <select
                value={settings.scrapeFrequency}
                onChange={(e) => setSettings({ ...settings, scrapeFrequency: e.target.value })}
                className="w-full max-w-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="manual">Manual Only</option>
              </select>
              <p className="text-sm text-slate-500 mt-1">How often the system should check for new courses</p>
            </div>

            <div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="discardNonEnglish"
                  checked={settings.discardNonEnglish}
                  onChange={(e) => setSettings({ ...settings, discardNonEnglish: e.target.checked })}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="discardNonEnglish" className="ml-3 flex items-center">
                  <Globe className="w-4 h-4 text-slate-400 mr-2" />
                  <span className="text-sm font-medium text-slate-700">Discard Non-English Courses</span>
                </label>
              </div>
              <p className="text-sm text-slate-500 mt-1 ml-7">Only include courses taught in English</p>
            </div>
          </div>
        </div>

        {/* Course Management Settings */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-slate-900">Course Management Settings</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Auto-Expiration Period</label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.autoExpirationDays}
                  onChange={(e) => setSettings({ ...settings, autoExpirationDays: parseInt(e.target.value) })}
                  className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-600">days</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">Courses will automatically expire after this many days</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Free Starter Course</label>
              <select
                value={settings.freeStarterCourse}
                onChange={(e) => setSettings({ ...settings, freeStarterCourse: e.target.value })}
                className="w-full max-w-md px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a course...</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              <p className="text-sm text-slate-500 mt-1">Course offered as free starter to new users</p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="card">
          <div className="flex items-center mb-6">
            <Gift className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-slate-900">System Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Database Status</h3>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-slate-600">Connected</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Last Scrape</h3>
              <span className="text-sm text-slate-600">2 hours ago</span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">Total Courses</h3>
              <span className="text-sm text-slate-600">567 active courses</span>
            </div>

            <div>
              <h3 className="text-sm font-medium text-slate-700 mb-2">System Version</h3>
              <span className="text-sm text-slate-600">v2.1.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
