import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config";

interface Order {
    id: number;
    name: string;
    price: number;
    quantity: number;
    status?: string;
    created_at: string;
}

const Dashboard = () => {
    const { user: profile, loading } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    useEffect(() => {
        if (profile) {
            if (profile.role === 'admin') {
                window.location.href = "/admin/dashboard";
                return;
            }
            fetchOrders();
        }
    }, [profile]);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/orders/secure/my`, {
                method: "GET",
                credentials: "include"
            });
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders:", err);
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you absolutely sure? This will permanently delete your account and all order history. This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/api/users/secure`, {
                method: "DELETE",
                credentials: "include"
            });
            
            if (res.ok) {
                alert("Account deleted successfully.");
                window.location.href = "/signup";
            } else {
                alert("Failed to delete account. Please try again.");
            }
        } catch (err) {
            console.error("Delete account error:", err);
            alert("An error occurred. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
                <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-xl max-w-md mx-4">
                    <div className="text-4xl mb-4">🔐</div>
                    <h2 className="text-2xl font-bold text-gray-800">Please Log In</h2>
                    <p className="text-gray-500 mt-2 mb-6">You need to be authenticated to access your personal dashboard.</p>
                    <Link
                        to="/login"
                        className="block w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-100"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Banner */}
            <div className="bg-indigo-600 text-white py-12 px-4 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, {profile.email.split('@')[0]}!</h1>
                    <p className="mt-2 text-indigo-100 opacity-80">Manage your orders and account settings below.</p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Account Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="text-indigo-600">👤</span> Account Details
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                <p className="text-gray-800 font-medium break-all">{profile.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Role</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${profile.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {profile.role}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-gray-50">
                                <button 
                                    onClick={() => alert("Profile editing coming soon!")}
                                    className="w-full text-sm font-bold text-indigo-600 hover:text-indigo-800 transition py-2 rounded-lg border border-indigo-50 hover:bg-indigo-50"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Admin Shortcut */}
                    {profile.role === 'admin' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 border-l-4 border-indigo-600">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Admin Tools</h2>
                            <p className="text-sm text-gray-500 mb-4">Manage products and system settings.</p>
                            <Link to="/admin" className="block w-full bg-gray-900 text-white text-center py-3 rounded-xl text-sm font-bold hover:bg-indigo-600 transition shadow-lg">
                                Admin Dashboard
                            </Link>
                        </div>
                    )}

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 rounded-2xl border border-red-100 p-8">
                        <h2 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h2>
                        <p className="text-xs text-red-600/70 mb-4">Permanently delete your account and all data.</p>
                        <button 
                            onClick={handleDeleteAccount}
                            className="w-full bg-white text-red-600 border border-red-200 py-3 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition shadow-sm"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Right Column: Order History or Admin Notice */}
                {profile.role === 'admin' ? (
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-10 flex flex-col items-center justify-center text-center">
                        <div className="text-6xl mb-6">📈</div>
                        <h2 className="text-2xl font-bold text-gray-900">Business Control Center</h2>
                        <p className="text-gray-500 mt-2 mb-8 max-w-md">
                            As an administrator, your dashboard is focused on business operations rather than personal purchases.
                        </p>
                        <Link to="/admin" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-100">
                            Open Admin Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-8 border-b border-gray-50 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    Order History
                                </h2>
                                <span className="text-xs font-bold bg-gray-100 text-gray-500 px-3 py-1 rounded-full uppercase">
                                    {orders.length} Orders
                                </span>
                            </div>

                        <div className="divide-y divide-gray-50">
                            {ordersLoading ? (
                                <div className="p-12 text-center text-gray-400 animate-pulse">Loading orders...</div>
                            ) : orders.length === 0 ? (
                                <div className="p-16 text-center">
                                    <div className="text-4xl mb-4 opacity-20">🛒</div>
                                    <h3 className="text-gray-900 font-bold">No orders yet</h3>
                                    <p className="text-sm text-gray-500 mt-1 mb-6">Looks like you haven't placed any orders yet.</p>
                                    <Link to="/product" className="text-indigo-600 font-bold hover:underline">Start Shopping</Link>
                                </div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="p-8 flex flex-col md:flex-row justify-between items-start md:items-center hover:bg-gray-50/50 transition">
                                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                                            <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-xl text-indigo-600 font-bold">
                                                {order.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{order.name}</h4>
                                                <p className="text-xs text-gray-400">Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Quantity</p>
                                                <p className="font-bold text-gray-800">x{order.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                                                <p className="font-bold text-indigo-600 text-lg">${(order.price * order.quantity).toFixed(2)}</p>
                                            </div>
                                            <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                                {order.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;