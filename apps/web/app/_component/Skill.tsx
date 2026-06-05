"use client";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useGetSkillQuery } from "../redux/apis/admin.api";
import { SKILL_REQUEST } from "@portfolio/types";


export default function Skills() {
    const { data, isLoading, isError } = useGetSkillQuery({});
    const [showAll, setShowAll] = useState(false);

    if (isLoading) {
        return <div className="text-center py-20">Loading skills...</div>;
    }
    if (isError) {
        return <div className="text-center py-20">Failed to load skills</div>;
    }

    const skills: SKILL_REQUEST[] = data?.SResult ?? [];

    const displayedSkills = showAll ? skills : skills.slice(0, 10);

    return (
        <section id="skills" className=" #f7f7f7 py-20 px-6 scroll-mt-20">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-[40px] font-bold text-black mb-1">My Skills</h2>
                    <p className="text-gray-500 text-lg">Technologies I work with</p>
                    <div className="w-14 h-[3px] bg-black mx-auto mt-4"></div>
                </div>

                {/* Skills Grid */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-12"
                >
                    {displayedSkills.map((skill) => (
                        <motion.div
                            key={skill._id}
                            whileHover={{ y: -5 }}
                            className="bg-white border border-gray-100 rounded-lg py-8 px-4 shadow-sm flex items-center justify-center text-center hover:border-gray-200"
                        >
                            <span className="text-gray-900 font-semibold text-[15px]">
                                {skill.name}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>

                {/* View Button */}
                <div className="flex justify-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="group flex items-center gap-2 border border-gray-300 px-6 py-2.5 rounded-lg text-[14px] font-medium text-gray-800 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
                    >
                        {showAll ? "Show Less" : "View All Skills"}
                        <span
                            className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""
                                }`}
                        >
                            <ArrowRight size={16} />
                        </span>
                    </button>
                </div>

            </div>
        </section>
    );
}