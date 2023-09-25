"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verify, setVerify] = useState(false);
    const [error, setError] = useState(false);
    const router = useRouter();

    const verifyUserEmail = async () => {
        try {
            const res = await axios.post("/api/user/verifyemail", { token });
            if (res.data.success) {
                setVerify(true);
                router.push("/login");
            } else {
                setError(true)
            }

        } catch (error: any) {
            setError(true);
            console.log(error)
        }
    }

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken ?? "");
        console.log(urlToken)
    }, [])

    useEffect(() => {
        if (token.length > 0) {
            verifyUserEmail()
        }

    }, [token]);

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
                <div className="p-2 bg-orange-500 text-black">{token ? `${token}` : "token"}</div>
                {verify && (
                    <div>
                        <h2 className="text-2xl">Email Verified</h2>
                        <Link href="/login">
                            Login
                        </Link>
                    </div>
                )}
                {error && (
                    <div>
                        <h2 className="text-2xl bg-red-500 text-black">Error</h2>

                    </div>
                )}
            </div>
        </>
    )

}