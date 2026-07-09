import { Suspense, lazy } from 'react'
import { Head } from 'vite-react-ssg'
import LoadingScreen from './components/layout/LoadingScreen'
import Navbar from './components/layout/Navbar'

const Hero = lazy(() => import('./components/sections/Hero'))
const About = lazy(() => import('./components/sections/About'))
const Skills = lazy(() => import('./components/sections/Skills'))
const Projects = lazy(() => import('./components/sections/Projects'))
const GitHubDashboard = lazy(() => import('./components/sections/GitHubDashboard'))
const Contact = lazy(() => import('./components/sections/Contact'))
const Footer = lazy(() => import('./components/layout/Footer'))

const siteUrl = import.meta.env.SITE_URL || 'http://localhost:5173'

function SectionFallback() {
  return (
    <div className="py-20 flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-[#00E5FF] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Head>
        <title>Aashir Siddiqui — Agentic AI Engineer & Full Stack Developer</title>
        <meta name="description" content="Builds intelligent AI systems, scalable web applications, and modern digital experiences using clean architecture, automation, and thoughtful UX." />
        <meta property="og:title" content="Aashir Siddiqui — Agentic AI Engineer & Full Stack Developer" />
        <meta property="og:description" content="Builds intelligent AI systems, scalable web applications, and modern digital experiences." />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={`${siteUrl}/favicon.svg`} />
        <meta property="profile:first_name" content="Aashir" />
        <meta property="profile:last_name" content="Siddiqui" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Aashir Siddiqui — Portfolio" />
        <meta name="twitter:description" content="Builds intelligent AI systems, scalable web applications, and modern digital experiences." />
        <meta name="twitter:image" content={`${siteUrl}/favicon.svg`} />
        <link rel="canonical" href={siteUrl} />
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Aashir Siddiqui",
            "url": "${siteUrl}",
            "jobTitle": "Agentic AI Engineer",
            "knowsAbout": ["Artificial Intelligence", "Full Stack Development", "React", "Python", "Node.js", "Three.js", "Machine Learning", "Automation"],
            "sameAs": ["https://github.com/aashirsohail104"]
          }
        `}</script>
      </Head>

      <LoadingScreen>
        <Navbar />
        <main>
          <Suspense fallback={null}>
            <Hero />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <About />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Skills />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Projects />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <GitHubDashboard />
          </Suspense>
          <Suspense fallback={<SectionFallback />}>
            <Contact />
          </Suspense>
        </main>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </LoadingScreen>
    </>
  )
}