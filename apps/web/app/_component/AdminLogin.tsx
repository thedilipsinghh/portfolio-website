"use client"
import React, { useState } from "react"
import { useSigninMutation } from "../redux/apis/auth.api"
import z from "zod"
import { useForm } from "react-hook-form"
import { LOGIN_REQUEST } from "@portfolio/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Loader2 } from "lucide-react"

const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(2, "Password must be at least 2 characters")
}) satisfies z.ZodType<LOGIN_REQUEST>

const AdminLogin = () => {
    const router = useRouter()
    const [login, { isLoading }] = useSigninMutation()
    const [showPassword, setShowPassword] = useState(false)

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors }
    } = useForm<LOGIN_REQUEST>({
        defaultValues: {
            email: "",
            password: ""
        },
        resolver: zodResolver(LoginSchema)
    })

    const handleLogin = async (data: LOGIN_REQUEST) => {
        try {
            await login(data).unwrap()
            toast.success("Welcome back! Login successful.")
            router.push("/admin")
            router.refresh()
            reset()
        } catch {
            toast.error("Invalid email or password. Please try again.")
        }
    }

    // Animation Configurations
    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } }
    }

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100,
                damping: 15,
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring" as const, stiffness: 120, damping: 14 }
        }
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-[#f7f7f7] overflow-hidden px-4">
            
            {/* Interactive Floating Blobs Backdrop */}
            <motion.div 
                variants={backdropVariants}
                initial="hidden"
                animate="visible"
                className="absolute inset-0 overflow-hidden -z-10 pointer-events-none"
            >
                {/* Radial grid pattern background */}
                <div className="absolute inset-0 bg-[#f7f7f7] bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-75" />
                
                {/* Soft floating blur circles */}
                <motion.div
                    className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-blue-400/20 rounded-full blur-[120px]"
                    animate={{
                        x: [0, 40, -20, 0],
                        y: [0, -30, 40, 0],
                        scale: [1, 1.15, 0.9, 1]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                <motion.div
                    className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] bg-slate-400/25 rounded-full blur-[120px]"
                    animate={{
                        x: [0, -40, 30, 0],
                        y: [0, 50, -30, 0],
                        scale: [1, 0.85, 1.1, 1]
                    }}
                    transition={{
                        duration: 22,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute top-[30%] right-[15%] w-[25vw] h-[25vw] max-w-[300px] max-h-[300px] bg-indigo-300/15 rounded-full blur-[90px]"
                    animate={{
                        x: [0, 30, -15, 0],
                        y: [0, 20, -25, 0],
                        scale: [1, 1.05, 0.95, 1]
                    }}
                    transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </motion.div>

            {/* Glassmorphism Login Card */}
            <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-md bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-3xl p-8 relative overflow-hidden"
            >
                {/* Thin Gradient Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-[4px] bg-gradient-to-r from-slate-800 via-blue-600 to-slate-800" />
                
                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center mb-8">
                    <motion.div 
                        className="inline-flex p-3.5 bg-black text-white rounded-2xl mb-4 shadow-lg shadow-black/10"
                        whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    >
                        <ShieldCheck size={28} className="text-blue-400" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                        Admin Access
                    </h2>
                    <p className="text-gray-500 text-sm mt-1.5">
                        Please sign in to manage your portfolio site
                    </p>
                </motion.div>

                {/* Form Section */}
                <form onSubmit={handleSubmit(handleLogin)} className="space-y-6">
                    
                    {/* Email Input */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block pl-1">
                            Email Address
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                <Mail size={18} />
                            </div>
                            <input
                                {...register("email")}
                                id="email"
                                type="email"
                                autoComplete="off"
                                placeholder="name@example.com"
                                className="w-full bg-white/50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50 transition-all font-medium text-sm"
                            />
                        </div>
                        <AnimatePresence mode="wait">
                            {errors.email && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0, y: -5 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-red-500 text-xs font-semibold pl-1"
                                >
                                    {errors.email.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Password Input */}
                    <motion.div variants={itemVariants} className="space-y-2">
                        <label htmlFor="password" className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block pl-1">
                            Password
                        </label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                {...register("password")}
                                id="password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="off"
                                placeholder="••••••••"
                                className="w-full bg-white/50 border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100/50 transition-all font-medium text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <AnimatePresence mode="wait">
                            {errors.password && (
                                <motion.p
                                    initial={{ opacity: 0, height: 0, y: -5 }}
                                    animate={{ opacity: 1, height: "auto", y: 0 }}
                                    exit={{ opacity: 0, height: 0, y: -5 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-red-500 text-xs font-semibold pl-1"
                                >
                                    {errors.password.message}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* Submit Button */}
                    <motion.div variants={itemVariants} className="pt-2">
                        <motion.button
                            disabled={isLoading}
                            type="submit"
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.985 }}
                            className="w-full relative overflow-hidden bg-black text-white py-3 rounded-xl font-semibold shadow-lg shadow-black/10 hover:shadow-black/20 hover:bg-gray-900 transition-all disabled:opacity-75 disabled:cursor-not-allowed group cursor-pointer text-sm"
                        >
                            <span className="flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin text-blue-400" />
                                        Verifying Credentials...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </span>
                        </motion.button>
                    </motion.div>

                    {/* Divider & Back Option */}
                    <motion.div variants={itemVariants} className="text-center pt-4 border-t border-gray-100">
                        <button
                            onClick={() => router.push("/")}
                            type="button"
                            className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-black hover:font-semibold transition-all font-medium group cursor-pointer"
                        >
                            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                            Back to portfolio website
                        </button>
                    </motion.div>

                </form>
            </motion.div>
        </div>
    )
}

export default AdminLogin