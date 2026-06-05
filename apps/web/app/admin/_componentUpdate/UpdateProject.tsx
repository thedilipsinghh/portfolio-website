"use client"

import { useCreateProjectMutation, useDeleteProjectMutation, useGetProjectQuery } from "@/app/redux/apis/admin.api"
import React from "react"
import { PROJECT_REQUEST } from "@portfolio/types"
import { Frown } from "lucide-react"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"

const UpdateProject = () => {

    const { data } = useGetProjectQuery({})
    const [createProject] = useCreateProjectMutation()
    const [deleteProject] = useDeleteProjectMutation()

    const projectSchema = z.object({
        _id: z.string().min(2).optional(),
        title: z.string().min(2),
        description: z.string().min(2),
        note: z.string().min(2),
        image: z.any(),
        tags: z.string().min(2),
        liveLink: z.string().min(2),
        githubLink: z.string().min(2),
    })

    type projectUpdate = z.infer<typeof projectSchema>

    const { register, handleSubmit, reset, formState: { errors } } = useForm<projectUpdate>({
        resolver: zodResolver(projectSchema)
    })



    const handleProjectCreate = async (data: projectUpdate) => {
        try {
            const formData = new FormData()
            console.log("SUBMIT TRIGGERED", data)

            formData.append("title", data.title)
            formData.append("description", data.description)
            formData.append("note", data.note)
            formData.append("tags", data.tags)
            formData.append("liveLink", data.liveLink)
            formData.append("githubLink", data.githubLink)


            formData.append("image", data.image[0])

            await createProject(formData).unwrap()

            toast.success("Project Create Success")
            reset()

        } catch (error) {
            console.log(error)
            toast.error("Unable to Create Project")
        }
    }



    const handleDelete = async (_id: string | undefined) => {
        if (!_id) return;
        try {
            await deleteProject({ _id }).unwrap()
            toast.success("Project Delete Success")
        } catch (error) {
            console.log(error)
            toast.error("Unable to Delete project")
        }
    }



    return (
        <section id="updateprojects" className="p-6 bg-gray-100 min-h-screen">

            <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6">

                {/* FORM CARD */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-md p-6 h-fit">

                    <h2 className="text-xl font-semibold text-black mb-6">
                        Add New Project
                    </h2>

                    <form onSubmit={handleSubmit(handleProjectCreate)} className="space-y-4">

                        <div>
                            <label className="text-sm text-black">Title</label>
                            <input
                                {...register("title")}
                                placeholder="Portfolio Website"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-black">Description</label>
                            <textarea
                                {...register("description")}
                                rows={3}
                                placeholder="Brief project description..."
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-black">Note</label>
                            <input
                                {...register("note")}
                                placeholder="Optional project note"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-black">Image URL</label>
                            <input
                                type="file"
                                {...register("image")}
                                placeholder="https://example.com/project-image.png"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-black">Tags</label>
                            <input
                                {...register("tags")}
                                placeholder="React, Node, MongoDB"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-black">Live Link</label>
                            <input
                                {...register("liveLink")}
                                placeholder="https://yourproject.com"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-black">GitHub Link</label>
                            <input
                                {...register("githubLink")}
                                placeholder="https://github.com/username/project"
                                className="w-full mt-1 border rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition"
                        >
                            Create Project
                        </button>

                    </form>

                </div>


                {/* PROJECT TABLE */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">

                    <h2 className="text-xl font-semibold text-black mb-4">
                        Project List
                    </h2>

                    <div className="overflow-x-auto">

                        {data && (

                            <table className="w-full text-sm text-black">

                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Title</th>
                                        <th className="px-4 py-3 text-left">Description</th>
                                        <th className="px-4 py-3 text-left">Note</th>
                                        <th className="px-4 py-3 text-left">Image</th>
                                        <th className="px-4 py-3 text-left">Tags</th>
                                        <th className="px-4 py-3 text-left">Links</th>
                                        <th className="px-4 py-3 text-center">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">

                                    {data?.PResult?.map((item: PROJECT_REQUEST) => (

                                        <tr key={item._id} className="hover:bg-gray-50">

                                            <td className="px-4 py-3 font-medium">
                                                {item.title}
                                            </td>

                                            <td className="px-4 py-3 max-w-xs truncate">
                                                {item.description}
                                            </td>

                                            <td className="px-4 py-3 max-w-xs truncate">
                                                {item.note}
                                            </td>

                                            <td className="px-4 py-3">
                                                <img
                                                    src={item.image}
                                                    alt="project"
                                                    className="w-14 h-10 object-cover rounded"
                                                />
                                            </td>

                                            <td className="px-4 py-3">
                                                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded">
                                                    {item.tags}
                                                </span>
                                            </td>

                                            <td className="px-4 py-3 space-x-2">
                                                <a
                                                    href={item.liveLink}
                                                    target="_blank"
                                                    className="text-blue-600 hover:underline text-xs"
                                                >
                                                    Live
                                                </a>

                                                <a
                                                    href={item.githubLink}
                                                    target="_blank"
                                                    className="text-blue-600 hover:underline text-xs"
                                                >
                                                    GitHub
                                                </a>
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

export default UpdateProject