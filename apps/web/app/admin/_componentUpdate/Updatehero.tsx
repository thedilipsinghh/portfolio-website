"use client"
import React, { useEffect } from "react"
import { useGetPortfolioQuery, useUpdatePortfolioMutation } from "@/app/redux/apis/admin.api"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"

interface HeroFormValues {
    name?: string;
    title?: string;
    profileImage?: FileList;
    resume?: FileList;
}

const UpdateHero = () => {
    const { data } = useGetPortfolioQuery({})
    const [updatePortfolio] = useUpdatePortfolioMutation()

    const { register, handleSubmit, reset } = useForm<HeroFormValues>()

    useEffect(() => {
        if (data?.PResult) {
            reset({
                name: data.PResult.hero.name,
                title: data.PResult.hero.title,
            })
        }
    }, [data, reset])

    const handleHeroUpdate = async (values: HeroFormValues) => {
        try {
            const formData = new FormData()
            formData.append("name", values.name || "")
            formData.append("title", values.title || "")
            if (values.profileImage && values.profileImage[0]) {
                formData.append("profileImage", values.profileImage[0])
            }
            if (values.resume && values.resume[0]) {
                formData.append("resume", values.resume[0])
            }

            formData.append("_id", data.PResult._id)

            await updatePortfolio(formData).unwrap()
            toast.success("Hero Update Success")
        } catch (error) {
            toast.error("Hero Update Failed")
        }
    }

    return (
        <section id="updatehero" className="flex justify-center items-center py-14 bg-gray-100">

            <div className="w-full max-w-xl bg-white shadow-xl rounded-xl border border-gray-300 p-8">

                <h2 className="text-2xl font-bold mb-6 text-black">
                    Update Hero Section
                </h2>

                <form onSubmit={handleSubmit(handleHeroUpdate)} className="flex flex-col gap-5">

                    {/* Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-black font-medium">
                            Name
                        </label>
                        <input
                            {...register("name")}
                            type="text"
                            placeholder="Enter new name"
                            className="border border-gray-400 text-black placeholder-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-1">
                        <label className="text-black font-medium">
                            Title
                        </label>
                        <input
                            {...register("title")}
                            type="text"
                            placeholder="Enter new title"
                            className="border border-gray-400 text-black placeholder-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    </div>

                    {/* Profile Image */}
                    <div className="flex flex-col gap-1">
                        <label className="text-black font-medium">
                            Profile Image
                        </label>
                        <input
                            {...register("profileImage")}
                            type="file"
                            className="border border-gray-400 text-black rounded-lg px-3 py-2 bg-white"
                        />
                    </div>

                    {/* Resume */}
                    <div className="flex flex-col gap-1">
                        <label className="text-black font-medium">
                            Resume
                        </label>
                        <input
                            {...register("resume")}
                            type="file"
                            className="border border-gray-400 text-black rounded-lg px-3 py-2 bg-white"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-3 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                        Update Hero
                    </button>

                </form>

            </div>

        </section>
    )
}

export default UpdateHero
