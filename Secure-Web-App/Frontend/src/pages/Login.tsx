import { Link } from "react-router";
import { useState } from "react";
import API_BASE from "../config";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { refreshProfile } = useAuth();

    // VULNERABLE LOGIN — SQL Injection + Broken Auth + Backdoor demo
    const handleVulnerableLogin = async () => {
        const res = await fetch(`${API_BASE}/api/auth/vulnerable/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // needed so session cookie is saved cross-origin with Railway
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        alert("Vulnerable: " + data.message);
    };

    // SECURE LOGIN — JWT + bcrypt + MFA + account lockout
    const handleSecureLogin = async () => {
        const res = await fetch(`${API_BASE}/api/auth/secure/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include", // IMPORTANT: needed to receive httpOnly JWT cookie cross-origin
            body: JSON.stringify({ email, password, otp: "123456" }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Secure: " + data.message);
            // Refresh auth context BEFORE redirecting so dashboard loads correctly
            await refreshProfile();
            window.location.href = "/dashboard";
        } else {
            alert(data.message);
        }
    };

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img src="/assets/swa_logo.png" alt="FromCodeToSecure" className="mx-auto h-16 w-auto" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign in to your account</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input id="email" type="email" name="email" required onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm/6 font-medium text-gray-900">Password</label>
                            <div className="text-sm">
                                <a href="/" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input id="password" type="password" name="password" required onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button type="button" onClick={handleVulnerableLogin} className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white">Vulnerable</button>
                        <button type="button" onClick={handleSecureLogin} className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white">Secure</button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Not a member?
                    <Link to={'/signup'} className="font-semibold text-indigo-600 hover:text-indigo-500"> Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;