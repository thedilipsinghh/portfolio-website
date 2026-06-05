"use client"; // Required for animations in Next.js App Router
import Image from "next/image";
import { Github, Linkedin, Download, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useGetPortfolioQuery } from "../redux/apis/admin.api";

export default function Hero() {
    const router = useRouter()
    const { data } = useGetPortfolioQuery({})
    const hero = data?.PResult?.hero

    const handleDownload = () => {
        if (!hero?.resume) return;

        let downloadUrl = hero.resume;

        if (downloadUrl.includes("/image/upload/")) {
            downloadUrl = downloadUrl.replace(
                "/image/upload/",
                "/raw/upload/fl_attachment/"
            );
        }

        const link = document.createElement("a");
        link.href = downloadUrl;
        link.setAttribute("download", "Resume.pdf");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="min-h-[85vh] bg-[#f7f7f7] flex items-center overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 grid md:grid-cols-2 items-center gap-12 w-full">

                {/* LEFT SIDE - CONTENT SLIDES FROM LEFT */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h1 className="text-6xl font-bold leading-tight">
                        <span className="text-black">Hi, I&apos;m</span>
                        <br />
                        <span className="bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
                            {hero?.name || "Dilip Singh"}
                        </span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="mt-6 text-gray-600 text-lg"
                    >
                        {hero?.title || "MERN Stack Developer crafting beautiful web experiences"}
                    </motion.p>

                    {/* Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="flex gap-4 mt-8"
                    >
                        <button onClick={() => router.push("/#contact")} className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-all active:scale-95">
                            Get in Touch
                            <ArrowRight size={18} />
                        </button>

                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 border border-gray-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all active:scale-95"
                        >
                            <Download size={18} />
                            Download CV
                        </button>
                    </motion.div>

                    {/* Social icons */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="flex gap-4 mt-8"
                    >
                        {[
                            { icon: <Github size={18} />, link: "https://github.com/thedilipsinghh" },
                            { icon: <Linkedin size={18} />, link: "https://www.linkedin.com/in/thedilipsinghh" },
                        ].map((social, i) => (
                            <a
                                key={i}
                                href={social.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 border rounded-full flex items-center justify-center text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                            >
                                {social.icon}
                            </a>
                        ))}
                    </motion.div>
                </motion.div>

                {/* RIGHT SIDE - IMAGE SLIDES FROM BOTTOM */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="flex justify-center"
                >
                    <div className="relative group">
                        {/* Soft Glow Effect behind photo */}
                        <div className="absolute inset-0 bg-blue-400 opacity-20 blur-3xl rounded-full group-hover:opacity-30 transition-opacity"></div>

                        <div className="relative w-[320px] h-[320px] lg:w-[420px] lg:h-[420px] rounded-full border-[10px] border-white shadow-xl overflow-hidden">
                            <Image
                                src={hero?.profileImage || "/profile2.png"}
                                alt="profile"
                                width={420}
                                height={420}
                                className="object-cover w-full h-full hover:scale-110 transition-transform duration-700"
                                priority // Loads image faster
                            />
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
