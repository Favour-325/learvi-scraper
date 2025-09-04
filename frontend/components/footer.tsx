import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            
            <span className="text-lg font-bold text-slate-900">Learvi</span>
          </div>

          {/*
          <div className="flex items-center space-x-6 text-sm">
            <Link href="/terms" className="text-slate-600 hover:text-slate-900 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="text-slate-600 hover:text-slate-900 transition-colors">
              Privacy
            </Link>
            <Link href="/contact" className="text-slate-600 hover:text-slate-900 transition-colors">
              Contact
            </Link>
          </div> */}

          {/* Copyright */}
          <div className="text-sm text-slate-500 mt-4 md:mt-0">© 2025 Learvi. All rights reserved.</div>
        </div>
      </div>
    </footer>
  )
}
