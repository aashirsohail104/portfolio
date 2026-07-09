import { SOCIAL_LINKS, NAV_ITEMS } from '../../utils/constants'
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa'

const iconMap = {
  FaGithub, FaLinkedin, FaTwitter, FaEnvelope,
}

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {SOCIAL_LINKS.map((link) => {
              const Icon = iconMap[link.icon]
              if (link.placeholder) return null
              return (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
                  aria-label={link.label}
                >
                  <Icon size={20} />
                </a>
              )
            })}
          </div>

          <div className="flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
            <button
                key={item.href}
                onClick={() => {
                  const el = document.querySelector(item.href)
                  if (el) el.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-[#94A3B8] hover:text-[#F8FAFC] transition-colors text-sm"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center mt-8 text-[#94A3B8] text-sm">
          &copy; {new Date().getFullYear()} Aashir Siddiqui. Built with React & Three.js
        </div>
      </div>
    </footer>
  )
}