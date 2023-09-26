"use client";
import Link from "next/link";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";


export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "vitthalgund30@gmail.com",
        // email: "",
        password: "VitthalGund",
        // password: "",
        username: "vitthal"
        // username: ""
    });

    const [buttonDisable, setButtonDisable] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { username, email, password } = user;
        const isUsernameValid = username.length > 2;
        const isEmailValid = email.match(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/);
        const isPasswordValid = password.length > 8;

        setButtonDisable(!(isUsernameValid && isEmailValid && isPasswordValid));
    }, [user]);

    const onUserChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser((prevUser) => ({
            ...prevUser,
            [e.target.name]: e.target.value
        }));
    };

    const onSignup = async () => {
        console.log("37")
        let id = toast.loading("Creating your Account!");
        try {
            setLoading(true);
            setButtonDisable(true);
            const resp = await axios.post("/api/user/signup", user);
            if (resp.data.success) {
                toast.success("User Account Created Successfully!");
                toast.success("Check your Email to verify the account!");
            } else {
                toast.error(resp.data.error);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
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
                    {loading ? "Processing" : "SignUp"}
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
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        type="text"
                        value={user.username}
                        onChange={onUserChange}
                        placeholder="username"
                        name="username"
                        required
                    />
                    <hr />
                    <label htmlFor="email">email</label>
                    <input
                        id="email"
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        type="email"
                        value={user.email}
                        onChange={onUserChange}
                        placeholder="email"
                        name="email"
                        required
                    />
                    <hr />
                    <label htmlFor="password">password</label>
                    <input
                        id="password"
                        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                        type="password"
                        value={user.password}
                        onChange={onUserChange}
                        placeholder="password"
                        name="password"
                        required
                        minLength={8}
                    />
                    <button
                        type="button"
                        className={`p-2 border border-gray-500 rounded-lg mb-4 focus:outline-none focus:border-gray-900 
                    ${buttonDisable ? "disabled:opacity-75" : "font-bold"}`}
                        onClick={onSignup}
                        disabled={buttonDisable}>
                        SignUp
                    </button>
                    <p>
                        Already have an Account?
                        <Link href="/login" className="text-blue-700">
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}