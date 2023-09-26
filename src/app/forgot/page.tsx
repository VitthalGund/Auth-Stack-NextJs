"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function Forgot() {
    const [email, setEmail] = useState("");
    const [disabled, setDisable] = useState(false);
    const [loading, setLoading] = useState(false);


    const sendVerification = async () => {
        try {
            setLoading(true);
            const res = await axios.post("/api/user/forgotpassword", { email });
            if (res.data.success) {
                toast.success("Email has been sent!")
            } else {
                toast.error(res.data.message);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const isEmailValid = email.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/);
        setDisable(!(isEmailValid));
    }, [email]);

    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-4xl">Verify Email</h1>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                />
                <section className="bg-gray-50 min-h-screen flex items-center justify-center">
                    {/* <!--     Login Container --> */}
                    <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
                        {/* <!--       Form --> */}
                        <div className="md:w-1/2 px-16">
                            <h2 className="font-bold text-2xl text-[#002D74]">{loading ? "Processing" : "Forgot Password"}</h2>
                        </div>
                        <form className="flex flex-col gap-4">
                            <input type="text" name="email" placeholder="Email" className="p-2 mt-8 rounded-xl border-0"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="on"
                            />
                            <button type="button" className="bg-blue-500 hover:bg-blue-700 rounded-xl text-white py-2 hover:scale-105 duration-300 disabled:cursor-not-allowed"
                                onClick={sendVerification} disabled={disabled}>Send Email</button>
                        </form>


                        {/* <!--       Image --> */}
                        <div className="md:block hidden w-1/2 p-5">
                            <img className="rounded-2xl" src="https://picsum.photos/600/900" alt="img" />
                        </div>
                    </div>
                </section>

            </div>
        </>
    )

}