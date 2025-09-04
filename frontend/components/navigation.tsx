"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, LogOut } from 'lucide-react'

interface NavigationProps {
  isLoggedIn?: boolean
  isSubscribed?: boolean
  showLogout?: boolean
}

export default function Navigation({ isLoggedIn = false, isSubscribed = false, showLogout = false }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            
            <span className="text-xl font-bold text-slate-900">Learvi</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isLoggedIn && (
              <>
                <Link href="/courses" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                  Courses
                </Link>
                <Link href="/uplink" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                  UpLink
                </Link>
                <Link href="/about" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                  About
                </Link>
                <Link href="/profile" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                  Profile
                </Link>
              </>
            )}
            {/* <Link href="/uplink" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
              UpLink
            </Link> */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                {showLogout && (
                  <button className="text-slate-600 hover:text-slate-900 transition-colors p-2 rounded-lg hover:bg-slate-100">
                    <LogOut className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                  Login
                </Link>
                <Link href="/register" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 bg-white">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/about" 
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/uplink" 
                className="text-slate-600 hover:text-slate-900 transition-colors font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                UpLink
              </Link>
              {isLoggedIn && (
                <>
                  <Link 
                    href="/courses" 
                    className="text-slate-600 hover:text-slate-900 transition-colors font-medium px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Courses
                  </Link>
                  <Link 
                    href="/profile" 
                    className="text-slate-600 hover:text-slate-900 transition-colors font-medium px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}
              {!isLoggedIn ? (
                <>
                  <Link 
                    href="/login" 
                    className="text-slate-600 hover:text-slate-900 transition-colors font-medium px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="text-slate-600 hover:text-slate-900 transition-colors font-medium px-2 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                showLogout && (
                  <button className="text-slate-600 hover:text-slate-900 transition-colors text-left px-2 py-1">
                    Logout
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
