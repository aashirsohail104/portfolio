import { motion } from 'framer-motion'
import SectionWrapper from '../ui/SectionWrapper'
import projectsData from '../../data/projects.json'
import { FiGithub, FiStar, FiUsers } from 'react-icons/fi'
import { VscRepo, VscGitCommit } from 'react-icons/vsc'

const colorMap = {
  Python: '#3572A5',
  JavaScript: '#f1e05a',
  TypeScript: '#3178C6',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  Go: '#00ADD8',
  Rust: '#dea584',
  Shell: '#89e051',
}

export default function GitHubDashboard() {
  const { profile, contributionGraph } = projectsData
  const hasData = profile.repos > 0

  const stats = [
    { label: 'Repositories', value: profile.repos, icon: VscRepo },
    { label: 'Stars', value: profile.stars, icon: FiStar },
    { label: 'Followers', value: profile.followers, icon: FiUsers },
    { label: 'Following', value: profile.following, icon: FiGithub },
  ]

  const allDays = contributionGraph?.flatMap((week) => week.contributionDays) || []
  const maxContrib = Math.max(...allDays.map((d) => d.contributionCount), 1)

  if (!hasData) {
    return (
      <SectionWrapper id="github">
        <h2 className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4">
          GitHub <span className="text-[#00E5FF]">Dashboard</span>
        </h2>
        <div className="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-xl p-8 text-center">
          <p className="text-[#94A3B8] mb-2">GitHub stats not yet synced.</p>
          <p className="text-sm text-[#64748B]">
            Data will appear after the sync workflow runs with a valid token.
          </p>
        </div>
      </SectionWrapper>
    )
  }

  return (
    <SectionWrapper id="github">
      <motion.h2
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="text-3xl md:text-4xl font-bold text-[#F8FAFC] mb-4"
      >
        GitHub <span className="text-[#00E5FF]">Dashboard</span>
      </motion.h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-xl p-5 text-center"
            >
              <Icon className="text-[#00E5FF] mx-auto mb-2" size={22} />
              <div className="text-2xl font-bold text-[#F8FAFC]">{stat.value}</div>
              <div className="text-xs text-[#94A3B8] mt-1">{stat.label}</div>
            </motion.div>
          )
        })}
      </div>

      {profile.topLanguages.length > 0 && (
        <div className="mb-10">
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4 uppercase tracking-wider">
            Top Languages
          </h3>
          <div className="flex flex-wrap gap-3">
            {profile.topLanguages.map((lang) => (
              <div
                key={lang}
                className="flex items-center gap-2 bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-lg px-4 py-2"
              >
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: colorMap[lang] || '#6366f1' }}
                />
                <span className="text-sm text-[#94A3B8]">{lang}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {allDays.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-[#F8FAFC] mb-4 uppercase tracking-wider">
            Contribution Graph
          </h3>
          <div className="bg-[#111827] border border-[rgba(255,255,255,0.08)] rounded-xl p-4 overflow-x-auto">
            <div className="flex gap-[2px] min-w-max">
              {contributionGraph.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-[2px]">
                  {week.contributionDays.map((day, di) => (
                    <div
                      key={di}
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: day.contributionCount > 0 ? day.color : 'rgba(255,255,255,0.06)',
                      }}
                      title={`${day.date}: ${day.contributionCount} contributions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}