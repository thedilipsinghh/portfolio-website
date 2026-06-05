"use client"
import AdminNavbar from "@/app/admin/_componentUpdate/AdminNavbar"
import { useSigninMutation, useSignoutMutation } from "@/app/redux/apis/auth.api"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"
import UpdateHero from "./_componentUpdate/Updatehero"
import UpdateProject from "./_componentUpdate/UpdateProject"
import UpdateExperienc from "./_componentUpdate/UpdateExperienc"
import UpdateContact from "./_componentUpdate/UpdateContact"
import UpdateSkill from "./_componentUpdate/UpdateSkill"


const Admin = () => {
    const [signout] = useSignoutMutation()
    const router = useRouter()

    const handlelogout = async () => {
        try {
            await signout(null).unwrap()
            router.refresh()
            toast.success("logout success")
            router.push("/")
        } catch (error) {
            console.log(error)
            toast.error("logout fail")

        }
    }
    return <>
        <AdminNavbar />
        <UpdateHero />
        <UpdateProject />
        <UpdateExperienc />
        <UpdateContact />
        <UpdateSkill />

        <button onClick={handlelogout}>logout</button>
    </>
}

export default Admin