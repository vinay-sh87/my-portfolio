import { getContent } from '@/lib/content'
import { Nav } from '@/components/Nav'
import { Hero } from '@/components/Hero'
import { About } from '@/components/About'
import { Projects } from '@/components/Projects'
import { Experience } from '@/components/Experience'
import { Skills } from '@/components/Skills'
import { Contact } from '@/components/Contact'
import { Footer } from '@/components/Footer'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const { projects, experiences, stack } = await getContent()
  const featuredProjects = projects.filter(p => p.featured).slice(0, 3)

  return (
    <main>
      <Nav />
      <Hero />
      <About />
      <Projects allProjects={featuredProjects} isHome />
      <Experience experiences={experiences} />
      <Skills stack={stack} />
      <Contact />
      <Footer />
    </main>
  )
}