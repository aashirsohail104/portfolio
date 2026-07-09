import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedText({ texts, className = '' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = texts[currentIndex]
    let timeout

    if (!isDeleting && displayed === current) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
      return () => clearTimeout(timeout)
    }

    if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setCurrentIndex((prev) => (prev + 1) % texts.length)
      return
    }

    timeout = setTimeout(
      () => {
        setDisplayed(
          isDeleting
            ? current.substring(0, displayed.length - 1)
            : current.substring(0, displayed.length + 1)
        )
      },
      isDeleting ? 40 : 80
    )

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, currentIndex, texts])

  return (
    <span className={className}>
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        className="text-primary ml-0.5"
      >
        |
      </motion.span>
    </span>
  )
}