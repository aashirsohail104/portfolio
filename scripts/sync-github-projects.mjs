import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const GITHUB_USERNAME = 'aashirsohail104'
const GH_TOKEN = process.env.PORTFOLIO_SYNC_TOKEN || process.env.GH_TOKEN
const OUTPUT_PATH = join(__dirname, '..', 'src', 'data', 'projects.json')

async function fetchJson(url, token) {
  const headers = { Accept: 'application/vnd.github.v3+json' }
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(url, { headers })
  if (!res.ok) {
    console.warn(`  [WARN] GET ${url} returned ${res.status}`)
    return null
  }
  return res.json()
}

async function fetchGraphQL(query, token) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  if (!res.ok) {
    console.warn(`  [WARN] GraphQL returned ${res.status}`)
    return null
  }
  return res.json()
}

async function main() {
  console.log(`Syncing GitHub data for ${GITHUB_USERNAME}...`)

  if (!GH_TOKEN) {
    console.warn('[WARN] No PORTFOLIO_SYNC_TOKEN found. Writing empty stub.')
    writeStub()
    return
  }

  const [profile, reposData] = await Promise.all([
    fetchJson(`https://api.github.com/users/${GITHUB_USERNAME}`, GH_TOKEN),
    fetchJson(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated&type=owner`, GH_TOKEN),
  ])

  if (!profile || !reposData) {
    console.warn('[WARN] Could not fetch data. Writing empty stub.')
    writeStub()
    return
  }

  const filtered = reposData.filter((r) => !r.fork && !r.archived)

  const languageCounts = {}
  filtered.forEach((r) => {
    if (r.language) {
      languageCounts[r.language] = (languageCounts[r.language] || 0) + 1
    }
  })
  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang]) => lang)

  const projects = filtered.map((r) => ({
    name: r.name,
    description: r.description || '',
    language: r.language || '',
    topics: r.topics || [],
    stars: r.stargazers_count || 0,
    updatedAt: r.updated_at || '',
    repoUrl: r.html_url || '',
    liveUrl: r.homepage || '',
    featured: (r.stargazers_count || 0) > 3 || !!r.homepage,
  }))

  let contributionGraph = []
  const graphqlQuery = `
    query {
      user(login: "${GITHUB_USERNAME}") {
        contributionsCollection(from: "${new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}", to: "${new Date().toISOString().split('T')[0]}") {
          contributionCalendar {
            weeks {
              contributionDays {
                date contributionCount color
              }
            }
          }
        }
      }
    }
  `
  const graphqlResult = await fetchGraphQL(graphqlQuery, GH_TOKEN)
  if (graphqlResult?.data?.user?.contributionsCollection?.contributionCalendar?.weeks) {
    contributionGraph = graphqlResult.data.user.contributionsCollection.contributionCalendar.weeks
  }

  const output = {
    generatedAt: new Date().toISOString(),
    profile: {
      repos: profile.public_repos || 0,
      stars: (profile.public_repos || 0) > 0 ? filtered.reduce((s, r) => s + (r.stargazers_count || 0), 0) : 0,
      followers: profile.followers || 0,
      following: profile.following || 0,
      topLanguages,
    },
    contributionGraph,
    projects,
  }

  const dir = dirname(OUTPUT_PATH)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`Wrote ${OUTPUT_PATH} with ${projects.length} projects`)
}

function writeStub() {
  const stub = {
    generatedAt: new Date().toISOString(),
    profile: { repos: 0, stars: 0, followers: 0, following: 0, topLanguages: [] },
    contributionGraph: [],
    projects: [],
  }
  const dir = dirname(OUTPUT_PATH)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(OUTPUT_PATH, JSON.stringify(stub, null, 2), 'utf-8')
  console.log(`Wrote stub to ${OUTPUT_PATH}`)
}

main().catch((err) => {
  console.error('Sync failed:', err)
  writeStub()
})