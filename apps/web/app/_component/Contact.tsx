"use client";
import React from 'react';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter, Instagram, Send } from 'lucide-react';
import { useGetPortfolioQuery } from '../redux/apis/admin.api';
import { useSendMessageMutation } from '../redux/apis/email.api';
import z, { string } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

export default function Contact() {
    const { data } = useGetPortfolioQuery({})
    const email = data && data.PResult.contact.email
    const location = data && data.PResult.contact.location
    const phone = data && data.PResult.contact.phone

    const [sendEmail] = useSendMessageMutation()

    const EmailSchema = z.object({
        name: string().min(1),
        email: string().min(1),
        subject: string().min(1),
        message: string().min(1),
    })
    type EmailForm = z.infer<typeof EmailSchema>
    const { register, reset, handleSubmit, formState: { errors } } = useForm<EmailForm>({
        resolver: zodResolver(EmailSchema)
    })

    const handleEmailSend = async (data: EmailForm) => {
        try {
            await sendEmail(data).unwrap()
            toast.success("Message Send Success")
        } catch (error) {
            console.log(error)
            toast.error("Unable to Send Message")

        }
    }


    const socialLinks = [
        { Icon: Github, href: "https://github.com/thedilipsinghh", label: "GitHub" },
        { Icon: Linkedin, href: "https://www.linkedin.com/in/thedilipsinghh", label: "LinkedIn" },
    ];

    return (
        <section id="contact" className="#f7f7f7 py-12 px-6 scroll-mt-20">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-black mb-1">Contact Me</h2>
                    <p className="text-gray-500 text-sm">Let&apos;s get in touch</p>
                    <div className="w-12 h-[3px] bg-black mx-auto mt-3"></div>
                </div>

                <div className="grid lg:grid-cols-5 gap-6">

                    {/* Left Side: Info (Takes 2 columns) */}
                    <div className="lg:col-span-2 bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
                        <h3 className="text-xl text-black font-bold mb-6">Get In Touch</h3>

                        <div className="space-y-4">
                            {[
                                {
                                    icon: <Mail size={18} />,
                                    label: "Email",
                                    value: email,
                                    href: "mailto:ds4718421@gmail.com"
                                },
                                {
                                    icon: <Phone size={18} />,
                                    label: "Phone",
                                    value: phone,
                                    href: "tel:+918080211162"
                                },
                                {
                                    icon: <MapPin size={18} />,
                                    label: "Location",
                                    value: location,
                                    href: "https://maps.google.com"
                                }
                            ].map((item, i) => (
                                <a
                                    key={i}
                                    href={item.href}
                                    className="flex items-center gap-3 group cursor-pointer"
                                >
                                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 shrink-0 group-hover:bg-black group-hover:text-white transition-all duration-300">
                                        <span className="text-gray-600 group-hover:text-white">{item.icon}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs font-bold text-gray-900">{item.label}</p>
                                        <p className="text-sm text-gray-600 truncate group-hover:text-black transition-colors">{item.value}</p>
                                    </div>
                                </a>
                            ))}
                        </div>

                        <div className="mt-8">
                            <p className="text-xs font-bold text-black mb-3">Follow Me</p>
                            <div className="flex gap-3">
                                {socialLinks.map(({ Icon, href, label }, i) => (
                                    <a
                                        key={i}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white hover:border-black hover:scale-110 transition-all duration-300 cursor-pointer shadow-sm bg-white"
                                    >
                                        <Icon size={18} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Form (Takes 3 columns) */}
                    <div className="lg:col-span-3 bg-white border border-gray-100 p-6 rounded-xl shadow-sm">
                        <h3 className="text-xl text-black font-bold mb-6">Send Me a Message</h3>

                        <form onSubmit={handleSubmit(handleEmailSend)} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-xs  font-bold mb-1.5 text-gray-900">Name</label>
                                <input {...register("name")} type="text" placeholder="Your name" className="w-full px-3 py-2.5 text-sm rounded-lg border text-black border-gray-200 focus:ring-1 focus:ring-black outline-none transition-all" required />
                            </div>

                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold mb-1.5 text-gray-900">Email</label>
                                <input  {...register("email")} type="email" placeholder="Your email" className="w-full px-3 text-black py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-1  focus:ring-black outline-none transition-all" required />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold mb-1.5 text-gray-900">Subject</label>
                                <input  {...register("subject")} type="text" placeholder="Subject" className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-1 text-black focus:ring-black outline-none transition-all" required />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold mb-1.5 text-gray-900">Message</label>
                                <textarea  {...register("message")} placeholder="Your message" className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 focus:ring-1 focus:ring-black outline-none resize-none transition-all text-black" required></textarea>
                            </div>

                            <button type='submit' className="md:col-span-2 bg-black text-white py-3.5 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-800 transition active:scale-95 shadow-md">
                                <Send size={16} />
                                Send Message
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}