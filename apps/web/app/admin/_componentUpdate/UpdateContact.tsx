"use client"

import { useGetPortfolioQuery, useUpdatePortfolioMutation } from "@/app/redux/apis/admin.api"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "react-toastify"

const UpdateContact = () => {

    const { data, refetch } = useGetPortfolioQuery({})
    const [updateContact] = useUpdatePortfolioMutation()

    const ContactSchema = z.object({
        email: z.string().email(),
        phone: z.string().min(1),
        location: z.string().min(1),
    })

    type UpdateForm = z.infer<typeof ContactSchema>

    const { register, reset, handleSubmit } = useForm<UpdateForm>({
        resolver: zodResolver(ContactSchema)
    })

    useEffect(() => {
        if (data?.PResult?.contact) {
            reset({
                email: data.PResult.contact.email,
                phone: data.PResult.contact.phone,
                location: data.PResult.contact.location
            })
        }
    }, [data, reset])

    const handleUpdateContact = async (formData: UpdateForm) => {
        try {
            await updateContact({ _id: data.PResult._id, contact: formData }).unwrap()
            refetch()
            toast.success("Contact Updated")
        } catch (error) {
            console.log(error)
            toast.error("Unable to update contact")
        }
    }

    return (
        <section id="updatecontact" className="p-6 bg-gray-100 min-h-screen">

            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">

                {/* FORM */}
                <div className="bg-white shadow-md rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-6 text-black">
                        Update Contact
                    </h2>

                    <form onSubmit={handleSubmit(handleUpdateContact)} className="space-y-4">

                        <input
                            {...register("email")}
                            placeholder="Email"
                            className="w-full border px-3 py-2 rounded text-black"
                        />

                        <input
                            {...register("phone")}
                            placeholder="Phone"
                            className="w-full border px-3 py-2 rounded text-black"
                        />

                        <input
                            {...register("location")}
                            placeholder="Location"
                            className="w-full border px-3 py-2 rounded text-black"
                        />

                        <button className="w-full bg-blue-600 text-white py-2 rounded">
                            Update Contact
                        </button>

                    </form>

                </div>

                {/* PREVIEW TABLE */}

                <div className="bg-white shadow-md rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-4 text-black">
                        Current Contact
                    </h2>

                    {data?.PResult?.contact && (

                        <table className="w-full text-black">

                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Email</th>
                                    <th className="p-3 text-left">Phone</th>
                                    <th className="p-3 text-left">Location</th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3">{data.PResult.contact.email}</td>
                                    <td className="p-3">{data.PResult.contact.phone}</td>
                                    <td className="p-3">{data.PResult.contact.location}</td>
                                </tr>
                            </tbody>

                        </table>

                    )}

                </div>

            </div>

        </section>
    )
}

export default UpdateContact