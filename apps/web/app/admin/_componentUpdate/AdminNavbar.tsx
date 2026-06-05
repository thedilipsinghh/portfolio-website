"use client"

import Link from "next/link"
import Image from "next/image"
import { Sun } from "lucide-react"
import { motion } from "framer-motion"

export default function Navbar() {
    return (
        <motion.header
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full sticky top-0 z-50 #f7f7f7/70 backdrop-blur-md border-b"
        >
            <div className="max-w-7xl mx-auto py-2.5 flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">

                    <Image
                        src="/logo.png"
                        alt="Dilip Singh Logo"
                        width={200}
                        height={40}
                        priority
                    />

                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center gap-8 font-medium">

                    <Link href="#updatehero" className="text-gray-700 hover:text-blue-600 transition">
                        Home
                    </Link>

                    <Link href="#updateabout" className="text-gray-700 hover:text-blue-600 transition">
                        About
                    </Link>

                    <Link href="#updateskills" className="text-gray-700 hover:text-blue-600 transition">
                        Skills
                    </Link>

                    <Link href="#updateprojects" className="text-gray-700 hover:text-blue-600 transition">
                        Projects
                    </Link>

                    <Link href="#updateExperince" className="text-gray-700 hover:text-blue-600 transition">
                        Experience
                    </Link>

                    <Link href="#updatecontact" className="text-gray-700 hover:text-blue-600 transition">
                        Contact
                    </Link>

                </nav>

                {/* Theme Button */}
                <button className="p-2 rounded-full text-gray-700 hover:bg-gray-200 transition">
                    <Sun size={20} />
                </button>

            </div>
        </motion.header>
    )
}