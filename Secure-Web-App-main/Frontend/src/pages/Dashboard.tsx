import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE from "../config";

interface UserProfile {
    id: number;
    email: string;
    role: string;
}

const Dashboard = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [error, setError] = useState<string>("");

    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE}/api/auth/secure/logout`, {
                method: "POST",
                credentials: "include"
            });
            window.location.href = "/login";
        } catch (err) {
            console.error("Logout error:", err);
        }
    };

    useEffect(() => {
        fetch(`${API_BASE}/api/users/secure`, {
            method: "GET",
            credentials: "include"
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message);
                }
                return res.json();
            })
            .then(data => {
                console.log("Profile:", data);
                setProfile(data);
            })
            .catch(err => {
                console.error("Error:", err.message);
                setError(err.message);
            });
    }, []);

    // ✅ Error State
    if (error) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
                    <p className="text-red-500 mt-2">{error}</p>
                    <Link
                        to="/login"
                        className="mt-4 inline-block text-indigo-600 font-semibold hover:underline"
                    >
                        Go back to Login
                    </Link>
                </div>
            </div>
        );
    }

    // ✅ Loading State
    if (!profile) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    // ✅ Dashboard Content
    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-600">
                        Secure Dashboard
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="text-sm text-red-500 hover:underline cursor-pointer"
                    >
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-10">

                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        My Profile
                    </h2>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Email:</span> {profile.email}
                        </p>
                        <p className="text-sm text-gray-600">
                            <span className="font-semibold">Role:</span>{" "}
                            <span
                                className={`px-2 py-1 rounded text-xs font-bold ${profile.role === "admin"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600"
                                    }`}
                            >
                                {profile.role}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Admin Section - Only visible to admin */}
                {profile.role === "admin" && (
                    <div className="bg-white rounded-lg shadow p-6 mb-6 border-l-4 border-red-500">
                        <h2 className="text-lg font-bold text-gray-800 mb-2">
                            Admin Controls
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">
                            You have admin privileges. You can manage orders and products.
                        </p>
                        <div className="flex gap-4">
                            <Link
                                to="/admin"
                                className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold hover:bg-indigo-500"
                            >
                                Go to Admin Dashboard
                            </Link>
                        </div>
                    </div>
                )}

                {/* Security Info Card */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">
                        Security Status
                    </h2>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✅</span>
                            <p className="text-sm text-gray-600">JWT Token Active</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✅</span>
                            <p className="text-sm text-gray-600">Session Secured</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✅</span>
                            <p className="text-sm text-gray-600">Role Based Access Active</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-green-500">✅</span>
                            <p className="text-sm text-gray-600">HttpOnly Cookie Enabled</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;