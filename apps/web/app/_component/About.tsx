"use client"
import React from 'react';
import { useGetPortfolioQuery } from '../redux/apis/admin.api';
import { useRouter } from 'next/navigation';
import Navbar from './Navbar';



export default function AboutMe() {
    const { data } = useGetPortfolioQuery({})
    const {push} = useRouter()

    const allStats: { label: string[]; value: number | string }[] = []
    if (data?.PResult?.stats) {
        for (const key in data.PResult.stats) {
            allStats.push({
                label: [key],
                value: data.PResult.stats[key]
            })
        }
    }
    return (
        <section id='about' className="#f7f7f7 py-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="flex flex-col items-center mb-16">
                    <h2 className="text-[40px] font-bold text-black mb-1">About Me</h2>
                    <p className="text-gray-500 text-lg">Get to know me better</p>
                    <div className="w-14 h-[3px] bg-black mt-4"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left Side: Content */}
                    <div className="max-w-xl">
                        <p className="text-gray-800 text-lg leading-relaxed mb-6">
                            I&apos;m a <span className="font-bold text-black">MERN Stack Developer</span> with a passion for building modern, responsive web applications. With expertise in JavaScript, React, Node.js, and related technologies, I create intuitive and visually appealing user interfaces.
                        </p>
                        <p className="text-gray-800 text-lg leading-relaxed mb-10">
                            Currently working as <span className="font-bold text-black">Backend Intern</span>, I&apos;ve contributed to various projects including a Medical Diagnostic App and a SaaS Property Management Platform.
                        </p>

                        <button onClick={() => push("/aboutme")} className="group flex items-center gap-2 border border-gray-300 px-5 py-2.5 rounded-lg text-[15px] font-medium text-gray-800 shadow-sm bg-white transition-all duration-300 hover:border-gray-900 hover:shadow-md hover:-translate-y-1 active:scale-95">
                            More About Me
                            <span className="text-lg transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </button>
                    </div>

                    {/* Right Side: Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                        {allStats.map((item, index) => (
                            <div
                                key={index}
                                className="bg-white border border-gray-100 rounded-xl py-10 px-6 shadow-[0px_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col items-center justify-center transition-transform hover:scale-[1.02]"
                            >
                                <span className="text-4xl font-bold text-gray-900 mb-1">
                                    {item.value}
                                </span>
                                <span className="text-gray-500 text-sm font-medium tracking-wide">
                                    {item.label}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}