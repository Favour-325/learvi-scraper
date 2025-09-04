import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Users, Target, Award, Heart } from 'lucide-react'
import ProtectedRoute from "@/components/protected-route"

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Active Learners", value: "10,000+" },
    { icon: Target, label: "Courses Curated", value: "500+" },
    { icon: Award, label: "Success Stories", value: "2,500+" },
    { icon: Heart, label: "Satisfaction Rate", value: "98%" },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-50">
        <Navigation isLoggedIn={true} isSubscribed={true} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">About Learvi</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We're on a mission to make quality education accessible to everyone by curating the best 100% discounted
              Udemy courses for ambitious learners worldwide.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-xl mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Our Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600">
                <p>
                  Learvi was born from a simple observation: quality education shouldn't be a luxury. While browsing
                  through countless online courses, we noticed that many excellent Udemy courses were frequently offered
                  at 100% discounts, but finding them required hours of searching.
                </p>
                <p>
                  We decided to solve this problem by creating a curated platform that brings together the best free
                  courses in one place. Our team manually reviews and selects each course to ensure you're getting
                  genuine value for your learning journey.
                </p>
                <p>
                  Today, Learvi serves thousands of learners worldwide, helping them acquire new skills, advance their
                  careers, and pursue their passions without financial barriers.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=400&width=500&text=Our+Story"
                alt="Our Story"
                className="rounded-2xl shadow-lg"
              />
            </div>
          </div>

          {/* Founder Section */}
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 mb-20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Meet Our Founder</h2>
              <p className="text-slate-600">The visionary behind Learvi's mission</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-1 text-center">
                <img
                  src="/placeholder.svg?height=300&width=300&text=Founder+Photo"
                  alt="Founder"
                  className="w-48 h-48 rounded-full mx-auto mb-6 object-cover shadow-lg"
                />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Favour Eyong Tabi</h3>
                <p className="text-blue-600 font-medium mb-4">Founder</p>
                <div className="flex justify-center space-x-4">
                  <a href="https://www.linkedin.com/in/favour-tabi" target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors">
                    LinkedIn
                  </a>
                  <a href="https://x.com/techie3_25" target="_blank" className="text-slate-400 hover:text-blue-600 transition-colors">
                    X
                  </a>
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-4 text-slate-600">
                  <p>
                    "I started Learvi because I believe that everyone deserves access to quality education, regardless of
                    their financial situation. As someone who struggled to afford courses early in my career, I
                    understand the frustration of wanting to learn but being held back by cost."
                  </p>
                  <p>
                    "With over 8 years of experience in EdTech and a passion for democratizing education, I founded
                    Learvi to bridge the gap between learners and quality content. Our platform has helped thousands of
                    students and professionals acquire new skills and advance their careers."
                  </p>
                  <p>
                    "When I'm not working on Learvi, you can find me exploring new technologies, mentoring aspiring
                    entrepreneurs, or hiking in the mountains with my dog, Max."
                  </p>
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2">Background</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Former Software Engineer at Google</li>
                    <li>• MBA from Stanford Graduate School of Business</li>
                    <li>• 8+ years in EdTech and Online Learning</li>
                    <li>• Featured speaker at TechCrunch Disrupt 2023</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600">
                To democratize access to quality education by curating and providing the best free online courses,
                empowering learners worldwide to achieve their goals without financial barriers.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Our Values</h3>
              <ul className="text-slate-600 space-y-2">
                <li>• <strong>Accessibility:</strong> Education for everyone</li>
                <li>• <strong>Quality:</strong> Only the best courses make it to our platform</li>
                <li>• <strong>Community:</strong> Supporting learners on their journey</li>
                <li>• <strong>Innovation:</strong> Continuously improving the learning experience</li>
              </ul>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
