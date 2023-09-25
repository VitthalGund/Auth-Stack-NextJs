"use client"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function Profile() {

    const router = useRouter();
    const [data, setData] = useState("nothing");

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

    const getUserDetails = async () => {
        console.log("req")
        try {
            const res = await axios.get("/api/user/me");
            console.log(res.data);
            console.log(res.status)
            if (res.status === 400) {
                toast.error("Login Expired!")
                router.push("/login");
            }
            setData(res.data.data._id);
        } catch (error: any) {
            toast.error("Login Expired!");
            await Logout();
            router.push("login")
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
            <h2 className="bg-green-500  text-white font-bold py-2 px-4 rounded mt-4">
                {data === "nothing" ? "Nothing" : <Link href={`/profile/:${data}`}>{data}</Link>}</h2>
            <hr />
            <p>Profile page</p>
            <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => Logout()}
            >Logout</button>
            <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => getUserDetails()}
            >Ger User Details</button>
        </div>
    )
}