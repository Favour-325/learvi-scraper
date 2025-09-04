import Link from "next/link"
import { Gift, ArrowRight, BookOpen } from 'lucide-react'

export default function FreeStarter() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full mb-6 shadow-lg">
            <Gift className="w-8 h-8" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Start Your Learning Journey Today</h2>

          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who are already advancing their skills with our completely free platform. No credit card required, no hidden fees.
          </p>

          <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-xl border border-blue-200">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Ready to Get Started?</h3>
            <p className="text-slate-600 mb-6">
              Create your free account and get instant access to our entire course library. Start learning today!
            </p>

            <Link
              href="/register"
              className="btn-primary w-full inline-flex items-center justify-center text-lg py-3"
            >
              Create Free Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
