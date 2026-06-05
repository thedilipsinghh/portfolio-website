import React from 'react'
import Navbar from '../_component/Navbar'

const AboutMe = () => {
  return (
    <>
      <Navbar />

      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16">

        {/* Left Image */}
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src="https://cutiedp.com/wp-content/uploads/2025/07/cartoon-boy-dp-49.webp"
            alt="Dilip Singh - Full Stack Developer"
            className="w-[300px] md:w-[400px] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Right Content */}
        <div className="w-full md:w-1/2 mt-10 md:mt-0 text-center md:text-left">

          <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
            I&apos;m <span className="text-sky-500">Dilip Singh</span>
          </h1>

          <h2 className="text-xl md:text-2xl mt-2 text-gray-700">
            Full Stack Developer (MERN + Next.js)
          </h2>

          <p className="mt-4 text-gray-600 leading-relaxed">
            I don’t just build web apps — I solve real problems using code.
            My focus is on creating systems that are scalable, maintainable,
            and actually usable in real-world scenarios.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            I work with <span className="font-semibold">React, Next.js, Node.js, Express, and PostgreSQL</span>.
            I care deeply about clean architecture, API design, and writing code that other developers can understand and extend.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Currently, I’m focused on building production-level projects with features like 
            authentication (JWT), role-based access control, and cloud integrations (Cloudinary, Vercel).
            I believe strong fundamentals + real project experience is what actually gets you hired — not tutorials.
          </p>

          <p className="mt-4 text-gray-600 leading-relaxed">
            Outside of coding, I spend time understanding system design, backend architecture,
            and how real applications scale. My goal is to become a developer who can build complete,
            reliable products — not just UI screens.
          </p>

          {/* CTA Buttons */}
          <div className="mt-6 flex gap-4 justify-center md:justify-start">
            <a
              href="mailto:ds4718421@gmail.com"
              className="bg-blue-500 hover:bg-blue-600 transition text-white px-6 py-2 rounded-full"
            >
              Get In Touch
            </a>

            <a
              href="https://www.linkedin.com/in/thedilipsinghh"
              download="Dilip_Singh_Resume.pdf"
              className="border  border-gray-400 hover:bg-gray-100 transition px-6 py-2 text-black rounded-full"
            >
              Download Resume
            </a>
          </div>

        </div>
      </section>
    </>
  )
}

export default AboutMe