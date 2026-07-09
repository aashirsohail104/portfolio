import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ClientOnly } from 'vite-react-ssg'
import AnimatedText from '../ui/AnimatedText'
import HeroScene from '../three/HeroScene'
import { SITE_CONFIG } from '../../utils/constants'
import { useMousePosition } from '../../hooks/useMousePosition'

export default function Hero() {
  const mouse = useRef({ x: 0.5, y: 0.5 })
  const rawMouse = useMousePosition()
  mouse.current = rawMouse

  const scrollTo = (id) => {
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,229,255,0.03)] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 pt-20 lg:pt-0">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[#00E5FF] text-sm tracking-[0.2em] uppercase mb-4"
            >
              Portfolio 2026
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F8FAFC] mb-4 leading-tight"
            >
              {SITE_CONFIG.name}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl md:text-2xl text-[#94A3B8] mb-6 h-8"
            >
              <AnimatedText texts={SITE_CONFIG.titles} className="text-[#38BDF8]" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[#94A3B8] max-w-xl leading-relaxed mb-8"
            >
              {SITE_CONFIG.summary}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-4"
            >
              <button
                onClick={() => scrollTo('#projects')}
                className="px-6 py-3 bg-[#00E5FF] text-[#050816] font-semibold rounded-lg hover:bg-[#00E5FF]/90 transition-colors"
              >
                View Projects
              </button>
              <button
                onClick={() => scrollTo('#contact')}
                className="px-6 py-3 border border-[rgba(255,255,255,0.2)] text-[#F8FAFC] rounded-lg hover:bg-white/5 transition-colors"
              >
                Get in Touch
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full lg:w-[500px] h-[300px] lg:h-[500px]"
          >
            <ClientOnly>
              {() => <HeroScene mouse={mouse} />}
            </ClientOnly>
          </motion.div>
        </div>
      </div>
    </section>
  )
}