"use client"; // Required for state and interaction in Next.js App Router
import React, { useState } from "react";
import Image from "next/image";
import { Github, ArrowRight } from "lucide-react";
import { useGetProjectQuery } from "../redux/apis/admin.api";
import { PROJECT_REQUEST } from "@portfolio/types";


export default function Projects() {
    const { data } = useGetProjectQuery("")
    console.log("Project", data)
    // State to toggle between showing 2 projects or all projects
    const [showAll, setShowAll] = useState(false);

    // Logic to decide which projects to render
    const displayedProjects = showAll ? data?.PResult : data?.PResult?.slice(0, 2);

    return (
        <section id="projects" className=" #f7f7f7 py-20 px-6 scroll-mt-20">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-2">
                        {showAll ? "All Projects" : "Featured Projects"}
                    </h2>
                    <p className="text-gray-500 text-lg">Some of my recent work</p>
                    <div className="w-16 h-1 bg-black mx-auto mt-4"></div>
                </div>

                {/* Project Grid */}
                <div className="grid md:grid-cols-2 gap-8 mb-12 transition-all duration-500">
                    {Array.isArray(displayedProjects) && displayedProjects?.map((project: PROJECT_REQUEST, index: number) => (
                        <div key={index} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col group">

                            {/* Image Container */}
                            <div className="relative h-64 w-full overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                            </div>

                            {/* Content Container */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xl">{project.icon}</span>
                                    <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                                </div>

                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {project.description}
                                </p>

                                {project.note && (
                                    <p className="text-sm text-gray-500 mb-4 italic">
                                        <span className="text-red-500 font-semibold not-italic">Note:</span> {project.note.replace('Note:', '')}
                                    </p>
                                )}
                                {project.tags && (
                                    <p className="text-sm text-gray-500 mb-4 italic">
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">{project.tags}</span></p>
                                )}

                                {/* Tags */}
                                {/* <div className="flex flex-wrap gap-2 mb-8">
                                    {project && Array.isArray(project.tags) && project.tags.map((tags: any) => (
                                        <span key={tags} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                                            {project.tags}
                                        </span>
                                    ))}
                                </div> */}

                                {/* Buttons */}
                                <div className="flex gap-4 mt-auto">
                                    <a href={project.liveLink} className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition active:scale-95">
                                        Live Demo
                                    </a>
                                    <a href={project.githubLink} className="flex items-center gap-2 border border-gray-200 text-gray-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition active:scale-95">
                                        <Github size={16} />
                                        GitHub
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Toggle Button */}
                <div className="flex justify-center">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className="flex items-center gap-2 bg-[#1a1a1a] text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-black transition-all shadow-lg hover:-translate-y-1 active:scale-95"
                    >
                        {showAll ? "Show Less" : "View All Projects"}
                        <span className={`transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}>
                            <ArrowRight size={20} />
                        </span>
                    </button>
                </div>

            </div>
        </section>
    );
}