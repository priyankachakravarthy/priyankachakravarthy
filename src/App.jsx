import { ThemeProvider } from './ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Hero from './sections/Hero'
import Experience from './sections/Experience'
import Projects from './sections/Projects'
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
        <Experience />
        <Projects />
        <Skills />
        <Certifications />
        <Activities />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  )
}
