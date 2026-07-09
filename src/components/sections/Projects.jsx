import { useState, useMemo } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import projectsData from '../../data/projects.json'
import { FiExternalLink, FiGithub, FiStar, FiSearch } from 'react-icons/fi'

function TiltCard({ project, index }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-0.5, 0.5], [8, -8])
  const rotateY = useTransform(x, [-0.5, 0.5], [-8, 8])

  const handleMouse = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const resetTilt = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      style={{ rotateX, rotateY, perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={resetTilt}
      className="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-xl p-6 group relative"
    >
      {project.featured && (
        <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider text-[#00E5FF] border border-[#00E5FF]/30 px-2 py-0.5 rounded-full">
          Featured
        </span>
      )}

      <h3 className="text-lg font-semibold text-[#F8FAFC] mb-2 group-hover:text-[#00E5FF] transition-colors">
        {project.name}
      </h3>

      <p className="text-sm text-[#94A3B8] mb-4 line-clamp-2 leading-relaxed min-h-[2.5rem]">
        {project.description || 'No description available'}
      </p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {project.language && (
          <span className="text-xs bg-[#1e293b] text-[#94A3B8] px-2 py-1 rounded">
            {project.language}
          </span>
        )}
        {project.stars > 0 && (
          <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
            <FiStar size={12} className="text-[#00E5FF]" /> {project.stars}
          </span>
        )}
      </div>

      {project.topics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.topics.slice(0, 4).map((topic) => (
            <span key={topic} className="text-[10px] bg-[#00E5FF]/10 text-[#00E5FF] px-2 py-0.5 rounded-full">
              {topic}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3 mt-auto pt-3 border-t border-[rgba(255,255,255,0.06)]">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#F8FAFC] transition-colors"
        >
          <FiGithub size={14} /> Source
        </a>
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-[#00E5FF] transition-colors"
          >
            <FiExternalLink size={14} /> Live
          </a>
        )}
      </div>
    </motion.div>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const allLanguages = useMemo(() => {
    const langs = new Set()
    projectsData.projects.forEach((p) => {
      if (p.language) langs.add(p.language)
    })
    return ['all', ...Array.from(langs).sort()]
  }, [])

  const filtered = useMemo(() => {
    let list = [...projectsData.projects]
    if (filter !== 'all') list = list.filter((p) => p.language === filter)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      )
    }
    list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return list
  }, [filter, search])

  if (projectsData.projects.length === 0) {
    return (
      <SectionWrapper id="projects">
        <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4">
          Featured <span className="text-[#00E5FF]">Projects</span>
        </h2>
        <div className="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 text-center">
          <p className="text-[#94A3B8] mb-2">No projects synced yet.</p>
          <p className="text-sm text-[#64748b]">
            The GitHub sync workflow will populate this section after the repository is created
            and the <code className="text-[#00E5FF]">PORTFOLIO_SYNC_TOKEN</code> secret is configured.
          </p>
        </div>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper id="projects">
      <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4">
        Featured <span className="text-[#00E5FF]">Projects</span>
      </h2>
      <p className="text-[#94A3B8] max-w-2xl mb-8 leading-relaxed">
        Real projects, automatically synced from GitHub. Filter by language or search by name.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" size={16} />
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {allLanguages.map((lang) => (
            <button
              key={lang}
              onClick={() => setFilter(lang)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === lang
                  ? 'bg-[#00E5FF] text-[#050816]'
                  : 'bg-[#111827] text-[#94A3B8] hover:text-[#F8FAFC] border border-[rgba(255,255,255,0.08)]'
              }`}
            >
              {lang === 'all' ? 'All' : lang}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project, i) => (
          <TiltCard key={project.name} project={project} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-[#94A3B8] text-center py-12">No projects match your filter.</p>
      )}
    </SectionWrapper>
  )
}