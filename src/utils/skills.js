import {
  SiPython, SiJavascript, SiTypescript,
  SiReact, SiNextdotjs, SiTailwindcss, SiThreedotjs, SiFramer, SiHtml5,
  SiNodedotjs, SiExpress, SiFastapi, SiPostgresql, SiMysql, SiMongodb,
  SiTensorflow, SiPytorch, SiScikitlearn,
  SiDocker, SiGithubactions, SiLinux, SiVercel, SiRedis, SiDjango, SiLangchain,
} from 'react-icons/si'
import { FaAws, FaGitAlt, FaJava, FaRobot } from 'react-icons/fa'
import { VscAzure } from 'react-icons/vsc'

export const SKILL_CATEGORIES = [
  {
    name: 'Languages',
    skills: [
      { name: 'Python', icon: SiPython },
      { name: 'JavaScript', icon: SiJavascript },
      { name: 'TypeScript', icon: SiTypescript },
      { name: 'Java', icon: FaJava },
    ],
  },
  {
    name: 'Frontend',
    skills: [
      { name: 'React', icon: SiReact },
      { name: 'Next.js', icon: SiNextdotjs },
      { name: 'Tailwind CSS', icon: SiTailwindcss },
      { name: 'Three.js', icon: SiThreedotjs },
      { name: 'Framer Motion', icon: SiFramer },
      { name: 'HTML/CSS', icon: SiHtml5 },
    ],
  },
  {
    name: 'Backend',
    skills: [
      { name: 'Node.js', icon: SiNodedotjs },
      { name: 'Express', icon: SiExpress },
      { name: 'FastAPI', icon: SiFastapi },
      { name: 'Django', icon: SiDjango },
    ],
  },
  {
    name: 'AI & ML',
    skills: [
      { name: 'OpenAI', icon: FaRobot },
      { name: 'LangChain', icon: SiLangchain },
      { name: 'TensorFlow', icon: SiTensorflow },
      { name: 'PyTorch', icon: SiPytorch },
    ],
  },
  {
    name: 'Automation & DevOps',
    skills: [
      { name: 'Docker', icon: SiDocker },
      { name: 'GitHub Actions', icon: SiGithubactions },
      { name: 'Git', icon: FaGitAlt },
      { name: 'Linux', icon: SiLinux },
    ],
  },
  {
    name: 'Databases',
    skills: [
      { name: 'PostgreSQL', icon: SiPostgresql },
      { name: 'MongoDB', icon: SiMongodb },
      { name: 'Redis', icon: SiRedis },
      { name: 'MySQL', icon: SiMysql },
    ],
  },
  {
    name: 'Tools & Cloud',
    skills: [
      { name: 'AWS', icon: FaAws },
      { name: 'Azure', icon: VscAzure },
      { name: 'Vercel', icon: SiVercel },
      { name: 'Docker', icon: SiDocker },
    ],
  },
]