import { motion } from 'framer-motion'

export default function GlassCard({ children, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      className={`bg-[#111827]/80 backdrop-blur-xl border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}