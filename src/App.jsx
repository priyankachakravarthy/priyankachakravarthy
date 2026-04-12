import { ThemeProvider } from './ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Experience from './sections/Experience'
import Skills from './sections/Skills'
import Certifications from './sections/Certifications'
import Activities from './sections/Activities'
import Contact from './sections/Contact'

export default function App() {
  return (
    <ThemeProvider>
      <Navbar />
      <main>
        <Hero />
        <Projects />
        <Experience />
        <Skills />
        <Certifications />
        <Activities />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  )
}
