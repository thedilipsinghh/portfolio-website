"use client"
import { useCreateExpMutation, useDeleteExpMutation, useGetExpQuery } from "@/app/redux/apis/admin.api"
import { zodResolver } from "@hookform/resolvers/zod"
import React from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-toastify"
import z, { string } from "zod"
import { EXP_REQUEST } from "@portfolio/types"

const UpdateExperienc = () => {
    const { data } = useGetExpQuery({})
    const [createExp] = useCreateExpMutation()
    const [deleteExp] = useDeleteExpMutation()

    const ExpSchema = z.object({
        _id: z.string().min(1).optional(),
        title: z.string().min(1),
        place: z.string().min(1),
        date: z.string().min(1),
        type: z.string().min(1),
        description: z.string().min(1),
    })

    type ExpForm = z.infer<typeof ExpSchema>

    const { register, reset, handleSubmit, formState: { errors } } = useForm<ExpForm>({
        resolver: zodResolver(ExpSchema)
    })

    const handleCreateExp = async (data: ExpForm) => {
        try {
            await createExp(data).unwrap()
            toast.success("Exp Create Success")
        } catch (error) {
            console.log(error)
            toast.error("Unable to create Exp")
        }
    }
    const handleDelete = async (_id: string | undefined) => {
        if (!_id) return;
        try {
            await deleteExp({ _id }).unwrap()
            toast.success("Exp Delete Success")
        } catch (error) {
            console.log(error)
            toast.error("Unable To Delete Exp")

        }
    }

    return (
        <section id="updateExperince" className="p-6 bg-gray-100 min-h-screen">

            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

                {/* FORM CARD */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 h-fit">

                    <h2 className="text-xl font-semibold text-black mb-6">
                        Add Experience
                    </h2>

                    <form onSubmit={handleSubmit(handleCreateExp)} className="space-y-4">

                        <div>
                            <label className="text-sm text-black">Title</label>
                            <input
                                {...register("title")}
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Frontend Developer Intern"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-black">Place</label>
                            <input
                                {...register("place")}
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. SkillHub IT Solutions"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-black">Date</label>
                            <input
                                {...register("date")}
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Feb 2026 — Present"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-black">Type</label>
                            <input
                                {...register("type")}
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Internship / Full-time / Freelance"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-black">Description</label>
                            <textarea
                                {...register("description")}
                                rows={4}
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                placeholder="Describe your work, responsibilities, and achievements..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                        >
                            Add Experience
                        </button>

                    </form>
                </div>

                {/* TABLE CARD */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">

                    <h2 className="text-xl font-semibold text-black mb-4">
                        Experience List
                    </h2>

                    <div className="overflow-x-auto">

                        {data && (
                            <table className="w-full text-sm text-black">

                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Title</th>
                                        <th className="px-4 py-3 text-left">Place</th>
                                        <th className="px-4 py-3 text-left">Date</th>
                                        <th className="px-4 py-3 text-left">Type</th>
                                        <th className="px-4 py-3 text-left">Description</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">

                                    {data?.EResult?.map((item: EXP_REQUEST) => (
                                        <tr key={item._id} className="hover:bg-gray-50">

                                            <td className="px-4 py-3 font-medium">
                                                {item.title}
                                            </td>

                                            <td className="px-4 py-3">
                                                {item.place}
                                            </td>

                                            <td className="px-4 py-3">
                                                {item.date}
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                                                    {item.type}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 max-w-xs truncate">
                                                {item.description}
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

export default UpdateExperienc