import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import GlassCard from '../ui/GlassCard'

const strengths = [
  'Clean architecture & modular design',
  'End-to-end AI system development',
  'Automation-first mindset',
  'Thoughtful UX & accessibility',
]

const values = [
  { title: 'Mission', content: 'Design and deliver intelligent, scalable systems that solve real problems through clean architecture and modern tooling.' },
  { title: 'Approach', content: 'Automation-first, performance-obsessed, and user-focused — every line of code serves a purpose.' },
  { title: 'Strengths', content: 'Full-stack development with an AI specialization. From python backends to Three.js frontends.' },
  { title: 'Focus', content: 'Agentic AI, automation pipelines, and modern web experiences at the intersection of form and function.' },
]

export default function About() {
  return (
    <SectionWrapper id="about">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4"
      >
        About <span className="text-[#00E5FF]">Me</span>
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-[#94A3B8] max-w-2xl mb-12 leading-relaxed"
      >
        I specialize in creating intelligent AI systems, building scalable full-stack applications,
        and delivering modern digital experiences. My work combines clean architecture, thoughtful UX,
        and automation to ship products that perform.
      </motion.p>

      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <GlassCard>
          <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">Key Strengths</h3>
          <ul className="space-y-3">
            {strengths.map((s, i) => (
              <motion.li
                key={s}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 text-[#94A3B8]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] flex-shrink-0" />
                {s}
              </motion.li>
            ))}
          </ul>
        </GlassCard>

        {values.slice(0, 2).map((v) => (
          <GlassCard key={v.title}>
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">{v.title}</h3>
            <p className="text-[#94A3B8] leading-relaxed">{v.content}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {values.slice(2).map((v) => (
          <GlassCard key={v.title}>
            <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2">{v.title}</h3>
            <p className="text-[#94A3B8] leading-relaxed">{v.content}</p>
          </GlassCard>
        ))}
      </div>
    </SectionWrapper>
  )
}