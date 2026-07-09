import { motion } from 'framer-motion'

export default function GlowCard({ children, className = '', onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative group cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#00E5FF] to-[#7C3AED] rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500" />
      <div className="relative bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 h-full">
        {children}
      </div>
    </motion.div>
  )
}