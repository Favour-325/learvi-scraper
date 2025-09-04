import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Developer",
      content: "Learvi transformed my career! The quality of courses is exceptional, and being completely free makes it accessible to everyone. I've learned so much and landed my dream job.",
      rating: 5,
      avatar: "/placeholder.svg?height=80&width=80&text=SC"
    },
    {
      name: "Marcus Johnson",
      role: "Career Switcher - Marketing to Tech",
      content: "I successfully transitioned from marketing to software development using Learvi's courses. The structured learning path and practical projects gave me the confidence to make the switch.",
      rating: 5,
      avatar: "/placeholder.svg?height=80&width=80&text=MJ"
    },
    {
      name: "Emily Rodriguez",
      role: "Freelance Designer",
      content: "The design and UX courses on Learvi are top-notch. I've improved my skills significantly and increased my freelance rates. The platform is a game-changer for continuous learning.",
      rating: 5,
      avatar: "/placeholder.svg?height=80&width=80&text=ER"
    },
  ]

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Our Learners Say</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Join thousands of students who are accelerating their learning with Learvi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100 relative">
              <Quote className="absolute top-6 right-6 w-8 h-8 text-blue-100" />
              
              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-slate-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>

              <div className="flex items-center">
                <img
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.name}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
