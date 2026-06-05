"use client"
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react"
import { useGetPortfolioQuery } from "../redux/apis/admin.api"
const Footer = () => {
    const { data } = useGetPortfolioQuery({})
    return (
        <footer className="bg-gray-100 border-t mt-20">
            <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-10">

                {/* About */}
                <div>
                    <h2 className="text-xl font-semibold text-blue-600">Dilip</h2>
                    <p className="text-gray-600 mt-3">
                        MERN Stack Developer with a passion for creating beautiful,
                        responsive web applications.
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg text-black font-semibold mb-3">Contact Info</h3>

                    <div className="space-y-2 text-gray-600">
                        <p className="flex items-center gap-2">
                            <Mail size={16} />
                            {data && data.PResult.contact.email}
                        </p>

                        <p className="flex items-center gap-2">
                            <Phone size={16} />
                            {data && data.PResult.contact.phone}
                        </p>

                        <p className="flex items-center gap-2">
                            <MapPin size={16} />
                            {data && data.PResult.contact.location}
                        </p>
                    </div>
                </div>

                {/* Social */}
                <div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-800">
                        Follow Me
                    </h3>

                    <div className="flex gap-4">

                        <a
                            href="https://github.com/thedilipsinghh"
                            className="p-2 rounded-full border border-gray-400 text-gray-700 hover:bg-blue-600 hover:text-white transition"
                        >
                            <Github size={18} />
                        </a>

                        <a
                            href="https://www.linkedin.com/in/thedilipsinghh"
                            className="p-2 rounded-full border border-gray-400 text-gray-700 hover:bg-blue-600 hover:text-white transition"
                        >
                            <Linkedin size={18} />
                        </a>

                        <a
                            href="mailto:ds4718421@gmail.com?subject=Portfolio Contact&body=Hello Dilip,"
                            className="p-2 rounded-full border border-gray-400 text-gray-700 hover:bg-blue-600 hover:text-white transition"
                        >
                            <Mail size={18} />
                        </a>

                    </div>
                </div>

            </div>

            <div className="border-t text-center py-4 text-gray-600 text-sm">
                © 2026 Dilip Singh . All rights reserved.
            </div>
        </footer>
    )
}

export default Footer