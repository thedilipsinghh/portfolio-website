import React from 'react'
import Navbar from './_component/Navbar'
import Hero from './_component/Hero'
import AboutSection from './_component/About'
import Projects from './_component/Project'
import Skills from './_component/Skill'
import Contact from './_component/Contact'
import Experience from './_component/Experience'
import ConnetAndLead from './_component/ConnetAndLaad'

const Home = () => {
  return <>
    <Navbar />
    <Hero />
    <AboutSection />
    <Projects />
    <Skills />
    <Experience />
    <ConnetAndLead />
    <Contact />

  </>
}

export default Home