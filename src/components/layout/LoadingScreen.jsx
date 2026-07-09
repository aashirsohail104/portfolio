import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ children }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('portfolio-visited')
    if (hasVisited) {
      setLoading(false)
      return
    }
    const timer = setTimeout(() => {
      sessionStorage.setItem('portfolio-visited', 'true')
      setLoading(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050816]"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold"
            >
              <span className="text-[#00E5FF]">A</span>
              <span className="text-[#F8FAFC]">S</span>
            </motion.div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 160 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="h-0.5 bg-[#00E5FF] rounded-full mt-6"
            />
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  )
}