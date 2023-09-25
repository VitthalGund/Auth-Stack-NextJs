"use client"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function UserProfile({ params }: any) {
    const router = useRouter();
    const Logout = async () => {
        console.log("he;")
        let notify = toast.loading("Processing!");
        try {
            const resp = await axios.get("/api/user/logout");
            if (resp.data.success) {
                toast.success(resp.data.message);
                router.push("/login")
            } else {
                toast.error("Unable to Logout!");
            }
        } catch (error) {
            toast.error("Network Error!");
        } finally {
            toast.dismiss(notify);
        }
    }
    return (
        <div className="flex flex-col items-center justify-center max-h-screen py-2">
            <Toaster
                position="top-center"
                reverseOrder={false}
                gutter={8}
                containerClassName=""
                containerStyle={{}}
            />
            <h1>Profile</h1>
            <hr />
            <p>Profile page</p>
            <h3 className="bg-orange-500  text-white font-bold py-2 px-4 rounded mt-4">Username: {params.id}</h3>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => Logout()}
            >Logout</button>
        </div>
    )
}