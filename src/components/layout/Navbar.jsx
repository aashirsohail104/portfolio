import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { NAV_ITEMS } from '../../utils/constants'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { isScrolled } = useScrollProgress()

  const handleClick = (href) => {
    setIsOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'bg-[#050816]/80 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="text-xl font-bold tracking-tight cursor-pointer"
          >
            <span className="text-[#00E5FF]">A</span>
            <span className="text-[#F8FAFC]">S</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => handleClick(item.href)}
                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm tracking-wide"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            className="md:hidden text-[#F8FAFC] p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#050816]/95 backdrop-blur-xl border-t border-[rgba(255,255,255,0.08)]"
          >
            <div className="px-4 py-4 space-y-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleClick(item.href)}
                  className="block w-full text-left text-[#94A3B8] hover:text-[#F8FAFC] transition-colors py-2 text-sm tracking-wide"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}