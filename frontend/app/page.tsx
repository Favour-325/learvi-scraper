import Navigation from "@/components/navigation"
import Hero from "@/components/hero"
import HowItWorks from "@/components/how-it-works"
import FeaturedCourses from "@/components/featured-courses"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <HowItWorks />
      {/* <FeaturedCourses /> */}
      <Testimonials />
      <FAQ />
      <Footer />
    </div>
  )
}
