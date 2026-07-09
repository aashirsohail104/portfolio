import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import { SKILL_CATEGORIES } from '../../utils/skills'

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES[0].name)

  const current = SKILL_CATEGORIES.find((c) => c.name === activeCategory)

  return (
    <SectionWrapper id="skills">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4"
      >
        Skills & <span className="text-[#00E5FF]">Technologies</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-[#94A3B8] max-w-2xl mb-8 leading-relaxed"
      >
        Technologies I work with across the stack — from AI systems and backend APIs to frontend interfaces and cloud infrastructure.
      </motion.p>

      <div className="flex flex-wrap gap-3 mb-10">
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat.name}
            onClick={() => setActiveCategory(cat.name)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeCategory === cat.name
                ? 'bg-[#00E5FF] text-[#050816]'
                : 'bg-[#111827] text-[#94A3B8] hover:text-[#F8FAFC] border border-[rgba(255,255,255,0.08)]'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {current?.skills.map((skill) => {
          const Icon = skill.icon
          return (
            <motion.div
              key={skill.name}
              whileHover={{ scale: 1.03, y: -2 }}
              className="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 flex flex-col items-center gap-3 group cursor-pointer"
            >
              <Icon className="text-2xl text-[#00E5FF] group-hover:text-[#38BDF8] transition-colors" />
              <span className="text-sm text-[#94A3B8] group-hover:text-[#F8FAFC] transition-colors">
                {skill.name}
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </SectionWrapper>
  )
}