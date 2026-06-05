"use client";
import React from "react";
import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Calendar } from "lucide-react";
import { useGetExpQuery } from "../redux/apis/admin.api";
import { EXP_REQUEST, EXP_RESPONSE } from "@portfolio/types";

export default function Timeline() {
    const { data } = useGetExpQuery("")
    return (
        <section id="experience" className=" #f7f7f7 py-20 px-6 scroll-mt-20">
            <div className="max-w-4xl mx-auto">

                {/* Header - Consistent with your other sections */}
                <div className="text-center mb-16">
                    <h2 className="text-[40px] font-bold text-black mb-1">Experience & Education</h2>
                    <p className="text-gray-500 text-lg">My professional journey</p>
                    <div className="w-14 h-[3px] bg-black mx-auto mt-4"></div>
                </div>

                {/* Timeline Container */}
                <div className="relative border-l-2 border-gray-100 ml-4 md:ml-6">
                    <div className="space-y-10">
                        {data?.EResult?.map((item: EXP_REQUEST, i: number) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="relative pl-8 md:pl-12"
                            >
                                {/* Timeline Dot with Icon */}
                                <div className="absolute -left-[11px] top-0 w-5 h-5 bg-white border-2 border-black rounded-full z-10 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                                </div>

                                {/* Content Card */}
                                <div className="group bg-white border border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:border-gray-200">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                                {item.type === "work" ? <Briefcase size={18} /> : <GraduationCap size={20} />}
                                                {item.title}
                                            </h3>
                                            <p className="text-gray-600 font-medium text-sm mt-1">{item.place}</p>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1 rounded-full border border-gray-100 w-fit">
                                            <Calendar size={12} />
                                            {item.date}
                                        </div>
                                    </div>

                                    <p className="text-gray-600 text-[15px] leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}