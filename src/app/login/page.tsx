"use client";
import Link from "next/link";
import React, { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";


export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });

    const onUserChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const [buttonDisable, setButtonDisable] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { email, password } = user;
        const isEmailValid = email.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/);
        const isPasswordValid = password.length > 8;

        setButtonDisable(!(isEmailValid && isPasswordValid));
    }, [user]);


    const onLogin = async () => {
        let id = toast.loading("validating your credentials!");
        try {
            setLoading(true);
            setButtonDisable(true);
            const resp = await axios.post("/api/user/login", user);
            // console.log(resp);
            if (resp.data.success) {
                toast.success("Login Successfully!");
                router.push(`/profile/${resp.data.username}`);
            } else {
                toast.error(resp.data.error);
            }
        } catch (error: any) {
            toast.error(error.message);
            toast.dismiss(id);
        } finally {
            setLoading(false);
            setButtonDisable(false);
            toast.dismiss(id);
        }
    };
    return (
        <>
            <div className="flex flex-col items-center justify-center max-h-screen py-2">
                <h1 className="text-center text-black font-bold text-3xl">
                    {loading ? "Processing" : "Login"}
                </h1>
                <hr />
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                />
                <form className="flex flex-col max-h-screen py-2">
                    <label htmlFor="email">Email</label>
                    <input id="email"
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        type="email" value={user.email}
                        onChange={(e) => onUserChange(e)}
                        placeholder="email"
                        name="email"
                        autoComplete="on"
                    />
                    <hr />
                    <label htmlFor="password">Password</label>
                    <input id="password"
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        type="password" value={user.password}
                        onChange={(e) => onUserChange(e)}
                        placeholder="password"
                        name="password"
                        autoComplete="on"
                    />
                    <button type="button"
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        onClick={onLogin} disabled={buttonDisable}>Login</button>
                    <p>Don&apos;t  have a Account?<Link href="/signup" className="text-blue-700">SignUp</Link></p>
                </form>
            </div>
        </>
    )
}