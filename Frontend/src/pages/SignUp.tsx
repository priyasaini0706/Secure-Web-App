import { Link } from "react-router";
import { useState } from "react";
import API_BASE from "../config";

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleVulnerableRegister = async () => {
        if (password !== confirmPassword) {
            return alert("Passwords do not match!");
        }
        try {
            const res = await fetch(`${API_BASE}/api/auth/vulnerable/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            alert("Vulnerable: " + data.message);
        } catch (err) {
            alert("Error connecting to server");
        }
    };

    const handleSecureRegister = async () => {
        if (password !== confirmPassword) {
            return alert("Passwords do not match!");
        }
        try {
            const res = await fetch(`${API_BASE}/api/auth/secure/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            alert("Secure: " + data.message);
        } catch (err) {
            alert("Error connecting to server");
        }
    };
    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img src="/assets/swa_logo.png" alt="FromCodeToSecure" className="mx-auto h-16 w-auto" />
                <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign Up for an account</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div>
                        <label className="block text-sm/6 font-medium text-gray-900">Email address</label>
                        <div className="mt-2">
                            <input type="email" name="email" required onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-md bg-blue-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm/6 font-medium text-gray-900">Password</label>
                            <div className="text-sm">
                                <a href="1" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input id="password" type="password" name="password" required onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-md bg-blue-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                     <div>
                        <div className="flex items-center justify-between">
                            <label className="block text-sm/6 font-medium text-gray-900">Confirm Password</label>
                        </div>
                        <div className="mt-2">
                            <input id="confirmPassword" type="password" name="confirmPassword" required onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full rounded-md bg-blue-50 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6" />
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button type="button" onClick={handleVulnerableRegister} className="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-500">Vulnerable</button>
                        <button type="button" onClick={handleSecureRegister} className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-500">Secure</button>
                    </div>
                </form>
                <p className="mt-10 text-center text-sm/6 text-gray-500">
                    Already have account ?
                    <Link to={'/login'} className="font-semibold text-indigo-600 hover:text-indigo-500">Login</Link>
                </p>
            </div>
        </div>

    )
}

export default SignUp;