"use client"

import Link from "next/link"
import { ArrowRight, Star, Users, BookOpen, Play } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Hero() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Mock authentication check - replace with real auth logic
  useEffect(() => {
    // This would be replaced with actual authentication check
    const checkAuth = () => {
      // For demo purposes, randomly set authentication status
      // In real app, this would check JWT token, session, etc.
      setIsAuthenticated(false) // Set to false for demo
    }
    checkAuth()
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-yellow-100 rounded-full opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-full text-sm font-medium mb-8 shadow-sm">
              <Star className="w-4 h-4 mr-2" />
              Upgrade Your Skills Today
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Unlock Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Learning Potential
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Access thousands of high-quality courses completely free. Learn new skills, advance your career, and achieve your goals with our curated collection.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-12">
              {isAuthenticated ? (
                <Link href="/courses" className="btn-primary text-lg px-8 py-4 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <Play className="mr-2 w-5 h-5" />
                  Start Learning Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              ) : (
                <Link href="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  Start Learning
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              )}
              <Link href="/about" className="text-slate-600 hover:text-slate-900 font-semibold text-lg transition-colors">
                Learn More →
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Users className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold text-slate-900">10K+</span>
                </div>
                <p className="text-slate-600 text-sm">Active Learners</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <BookOpen className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold text-slate-900">500+</span>
                </div>
                <p className="text-slate-600 text-sm">Free Courses</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-2">
                  <Star className="w-5 h-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold text-slate-900">4.8</span>
                </div>
                <p className="text-slate-600 text-sm">Average Rating</p>
              </div>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="relative z-1">
              <img
                src="/placeholder.svg?height=600&width=600&text=Learning+Illustration"
                alt="Learning Platform Illustration"
                className="w-full h-auto max-w-lg mx-auto drop-shadow-2xl"
              />
            </div>
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 bg-white rounded-lg shadow-lg p-4 animate-bounce delay-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Course Completed!</span>
              </div>
            </div>
            <div className="absolute bottom-10 right-10 bg-white rounded-lg shadow-lg p-4 animate-bounce delay-1000">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">New Course Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
