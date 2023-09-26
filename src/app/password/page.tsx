"use client";
import Link from "next/link";
import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";


export default function Password() {
    const router = useRouter();
    const [user, setUser] = useState({
        password: "",
        confirmPassword: ""
    });
    const [token, setToken] = useState("");
    const password = useRef<HTMLInputElement>(null);
    const confirmPassword = useRef<HTMLInputElement>(null);

    const onUserChange = (e: ChangeEvent<HTMLInputElement>) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const [buttonDisable, setButtonDisable] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const { password, confirmPassword } = user;
        const isPasswordValid = password.length > 8;
        const isEqual = password === confirmPassword;

        setButtonDisable(!(isPasswordValid && isEqual));
    }, [user]);

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken ?? "");
        console.log(urlToken)
    }, [])

    const ResetPassword = async () => {
        let id = toast.loading("Requesting changes!");
        try {
            setLoading(true);
            setButtonDisable(true);
            console.log()
            const resp = await axios.post("/api/user/verifypassword", { token, password: user.password });
            console.log(resp);
            if (resp.data.success) {
                toast.success("Password changed Successfully!");
                router.push(`/login`);
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
    const changeType = (e: string) => {
        if (e === "password" && password.current) {
            password.current.type = password.current.type === "password" ? "text" : "password";
        }
        if (e === "confirmPassword" && confirmPassword.current) {
            confirmPassword.current.type = confirmPassword.current.type === "password" ? "text" : "password";
        }
    }
    return (
        <>
            <div className="flex flex-col items-center justify-center max-h-screen py-2">
                {/* <h1 className="text-center text-black font-bold text-3xl">
                    {loading ? "Processing" : "Login"}
                </h1> */}
                <hr />
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    gutter={8}
                    containerClassName=""
                    containerStyle={{}}
                />
                {/* <form className="flex flex-col max-h-screen py-2"> */}
                {/* <label htmlFor="email">Email</label>
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
                        onClick={ResetPassword} disabled={buttonDisable}>Login</button>
                    <p>Don&apos;t  have a Account?<Link href="/signup" className="text-blue-700">SignUp</Link></p> */}
                <section className="bg-gray-50 min-h-screen flex items-center justify-center">
                    {/* <!--     Login Container --> */}
                    <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
                        {/* <!--       Form --> */}
                        <div className="md:w-1/2 px-16">
                            <h2 className="font-bold text-2xl text-[#002D74]">{loading ? "Processing" : "Reset Password"}</h2>
                            <form action="" className="flex flex-col gap-4">
                                <div className="relative">
                                    <input type="password" name="password" placeholder="Password" className="p-2 rounded-xl border-0 w-full"
                                        value={user.password}
                                        onChange={(e) => onUserChange(e)}
                                        autoComplete="on"
                                        ref={password}
                                        minLength={8}
                                    />
                                    <svg onClick={() => changeType("password")} name="password" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                    </svg>
                                </div>
                                <div className="relative">
                                    <input type="password" name="confirmPassword" placeholder="Confirm Password" className="p-2 rounded-xl border-0 w-full"
                                        value={user.confirmPassword}
                                        onChange={(e) => onUserChange(e)}
                                        autoComplete="on"
                                        ref={confirmPassword}
                                        minLength={8}
                                    />
                                    <svg onClick={() => changeType("confirmPassword")} name="confirmPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                                    </svg>
                                </div>
                                <button type="button" className="bg-blue-500 hover:bg-blue-700 rounded-xl text-white py-2 hover:scale-105 duration-300 disabled:cursor-not-allowed"
                                    onClick={ResetPassword} disabled={buttonDisable}>Verify!</button>
                            </form>

                            {/* <div className="mt-10 grid grid-cols-3 items-center text-gray-500">
                                <hr className="border-gray-400" />
                                <p className="text-center">OR</p>
                                <hr className="border-gray-400" />
                            </div> */}

                            {/* <button className="bg-white border-0 py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300">
                                    <svg className="mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="25px">
                                        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                    </svg>
                                    Login with google
                                </button> */}


                        </div>

                        {/* <!--       Image --> */}
                        <div className="md:block hidden w-1/2 p-5">
                            <img className="rounded-2xl" src="https://picsum.photos/600/900" alt="img" />
                        </div>
                    </div>
                    {/* </div> */}
                </section>
                {/* </form> */}
            </div >
        </>
    )
}