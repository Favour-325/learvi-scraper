import { UserPlus, Search, GraduationCap } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Account",
      description: "Sign up for free and join our community of learners. No credit card required, no hidden fees.",
    },
    {
      icon: Search,
      title: "Discover Courses",
      description: "Browse our curated collection of high-quality courses across various topics and skill levels.",
    },
    {
      icon: GraduationCap,
      title: "Start Learning",
      description: "Access courses instantly and learn at your own pace. Track your progress and earn certificates.",
    },
  ]

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Learvi Works</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Get started in three simple steps and unlock a world of learning opportunities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">

              {/* Icon */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 rounded-xl mb-6 shadow-sm border border-blue-200">
                <step.icon className="w-8 h-8" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-900 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-blue-300 transform translate-x-8"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
