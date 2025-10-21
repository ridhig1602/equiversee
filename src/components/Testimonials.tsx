'use client'
import { motion } from 'framer-motion'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "College Student",
      content: "Equiverse made learning about stocks so fun! I went from zero knowledge to understanding market trends in just 2 weeks.",
      avatar: "👩‍🎓"
    },
    {
      name: "Rohan Mehta",
      role: "Young Professional",
      content: "The virtual trading simulator is incredible. I learned risk management without losing real money. Game changer!",
      avatar: "👨‍💼"
    },
    {
      name: "Anita Patel",
      role: "Beginner Investor",
      content: "The AI-powered quizzes and mentorship helped me build confidence before investing my actual savings.",
      avatar: "👩‍💼"
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Our Traders Say
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of users who transformed their financial literacy through gamified learning
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <div className="text-2xl mr-4">{testimonial.avatar}</div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">&ldquo;{testimonial.content}&rdquo;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}