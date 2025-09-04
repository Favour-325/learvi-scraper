"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronUp } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: "Is Learvi really completely free?",
      answer: "Yes! Learvi is 100% free to use. We believe education should be accessible to everyone, so there are no hidden fees, subscriptions, or premium tiers. All courses are available at no cost."
    },
    {
      question: "How do you maintain quality if courses are free?",
      answer: "We carefully curate our course collection by partnering with top instructors and educational institutions. Our team reviews each course for quality, relevance, and educational value before adding it to our platform."
    },
    {
      question: "Do I get certificates for completing courses?",
      answer: "Yes! Upon successful completion of any course, you'll receive a certificate that you can add to your LinkedIn profile or resume. These certificates serve as solid proof that you've gained the specified skills."
    },
    {
      question: "How often are new courses added?",
      answer: "We add new courses daily across various categories including programming, design, business, and more. Follow us or check back regularly to discover the latest additions to our course library."
    },
    {
      question: "Can I access courses on mobile devices?",
      answer: "Our platform is fully responsive and works seamlessly on all devices - desktop, tablet, and mobile. You can learn anywhere, anytime, at your own pace."
    },
    {
      question: "Is there any support available if I need help?",
      answer: "Yes! We have a dedicated support team and an active community forum where you can ask questions, get help, and connect with other learners. We're here to support your learning journey."
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-slate-600">Everything you need to know about Learvi</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-colors focus:outline-none focus:bg-slate-50"
              >
                <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-600 mb-4">Still have questions?</p>
          <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
            Contact our support team →
          </Link>
        </div>
      </div>
    </section>
  )
}
