"use client"


import React from "react"
import { useForm } from "react-hook-form"
import { string, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { table } from "console"
import { useCreateSkillMutation, useDeleteSkillMutation, useGetSkillQuery } from "@/app/redux/apis/admin.api"
import { div } from "framer-motion/client"
import { toast } from "react-toastify"
import { SKILL_REQUEST } from "@portfolio/types"



const UpdateSkill = () => {
    const { data, isLoading, error } = useGetSkillQuery({})
    const [createSkill] = useCreateSkillMutation()
    const [deleteSkill] = useDeleteSkillMutation()


    const skillSchema = z.object({
        name: z.string().min(2)
    })

    type SkillForm = z.infer<typeof skillSchema>

    const { register, handleSubmit, reset, formState: { errors } } = useForm<SkillForm>({
        resolver: zodResolver(skillSchema)
    })


    const SkillonSubmit = async (data: SkillForm) => {
        try {
            await createSkill(data).unwrap()
            toast.success("Skill and Success")
            reset()
        } catch (error) {
            console.log(error)
            toast.error("unable to delete Skill")
        }
    }

    const handleDelete = async (_id: string | undefined) => {
        if (!_id) return;
        try {
            await deleteSkill({ _id })
            toast.success("Skill Delete Success")
        } catch (error) {
            console.log(error)
            toast.error("unable to delete Skill")

        }
    }

    return (
        <section id="updateskills" className="p-6 bg-gray-100 min-h-screen">

            <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">

                {/* FORM CARD */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 h-fit">

                    <h2 className="text-xl font-semibold text-black mb-6">
                        Add New Skill
                    </h2>

                    <form onSubmit={handleSubmit(SkillonSubmit)} className="space-y-4">

                        <div>
                            <label className="text-sm text-black">
                                Skill Name
                            </label>

                            <input
                                {...register("name")}
                                type="text"
                                placeholder="e.g. React, Node.js, MongoDB"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                        >
                            Add Skill
                        </button>

                    </form>

                </div>


                {/* SKILL TABLE */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">

                    <h2 className="text-xl font-semibold text-black mb-4">
                        Skills List
                    </h2>

                    <div className="overflow-x-auto">

                        {data?.SResult && (

                            <table className="w-full text-sm text-black">

                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left">
                                            Skill
                                        </th>

                                        <th className="px-4 py-3 text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">

                                    {data.SResult.map((item: SKILL_REQUEST) => (
                                        <tr key={item._id} className="hover:bg-gray-50">

                                            <td className="px-4 py-3 font-medium">
                                                {item.name}
                                            </td>

                                            <td className="px-4 py-3 text-center">

                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded-md"
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>
                                    ))}

                                </tbody>

                            </table>

                        )}

                    </div>

                </div>

            </div>

        </section>
    )
}

export default UpdateSkill