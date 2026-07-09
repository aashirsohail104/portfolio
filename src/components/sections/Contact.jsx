import { useState } from 'react'
import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import { submitContact } from '../../services/contactService'
import { FiSend, FiGithub, FiLinkedin, FiTwitter } from 'react-icons/fi'
import { HiOutlineMail } from 'react-icons/hi'

const socials = [
  { icon: FiGithub, label: 'GitHub', url: 'https://github.com/aashirsohail104' },
  { icon: FiLinkedin, label: 'LinkedIn', url: '#', placeholder: true },
  { icon: FiTwitter, label: 'Twitter', url: '#', placeholder: true },
  { icon: HiOutlineMail, label: 'Email', url: '#', placeholder: true },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await submitContact(form)
      setStatus('success')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Something went wrong.')
    }
  }

  return (
    <SectionWrapper id="contact">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4 text-center"
        >
          Get in <span className="text-[#00E5FF]">Touch</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-[#94A3B8] text-center mb-12 max-w-lg mx-auto"
        >
          Have a project in mind or just want to connect? Fill out the form and I'll get back to you.
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm text-[#94A3B8] mb-1.5">
                    Name <span className="text-[#00E5FF]">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-[#94A3B8] mb-1.5">
                    Email <span className="text-[#00E5FF]">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm text-[#94A3B8] mb-1.5">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  className="w-full bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm text-[#94A3B8] mb-1.5">
                  Message <span className="text-[#00E5FF]">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#00E5FF]/50 transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                disabled={status === 'loading'}
                className="flex items-center gap-2 px-6 py-3 bg-[#00E5FF] text-[#050816] font-semibold rounded-lg hover:bg-[#00E5FF]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'Sending...' : 'Send Message'}
                <FiSend size={14} />
              </button>
              {status === 'success' && (
                <p className="text-green-400 text-sm">Message sent successfully! I'll get back to you soon.</p>
              )}
              {status === 'error' && (
                <p className="text-red-400 text-sm">{errorMsg}</p>
              )}
            </form>
          </div>

          <div className="flex md:flex-col gap-4 justify-center md:justify-start pt-2">
            {socials.map((s) => {
              const Icon = s.icon
              if (s.placeholder) return null
              return (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#94A3B8] hover:text-[#00E5FF] transition-colors group"
                  aria-label={s.label}
                >
                  <Icon size={20} />
                  <span className="text-sm hidden md:inline">{s.label}</span>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}