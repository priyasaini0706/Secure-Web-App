import { useEffect, useState } from "react";
import API_BASE from "../config";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface Order {
    id: number;
    email: string;
    name: string;
    quantity: number;
    price: number;
    address: string;
    contact: string;
    payment_method: string;
    status: string;
    created_at: string;
}

const AdminDashboard = () => {
    const { user: profile, logout } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/orders/secure/all`, {
                credentials: "include"
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Failed to fetch orders");
            }
            const data = await res.json();
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId: number, newStatus: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/orders/secure/update-status/${orderId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ status: newStatus })
            });
            
            if (res.ok) {
                // Update local state
                setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            } else {
                alert("Failed to update status");
            }
        } catch (err) {
            alert("Error updating status");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Are you absolutely sure? This will permanently delete your account. This action cannot be undone.")) {
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

    if (error) {
        return (
            <div className="p-10 flex flex-col items-center">
                <div className="text-red-600 mb-4">{error}</div>
                <Link to="/login" className="text-indigo-600 underline">Go to Login</Link>
            </div>
        );
    }

    if (!profile) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header / Banner */}
            <div className="bg-indigo-600 text-white py-12 px-4 shadow-lg">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Admin Dashboard</h1>
                        <p className="mt-2 text-indigo-100 opacity-80">Welcome back, {profile.email.split('@')[0]}! Manage your store settings and orders.</p>
                    </div>
                    <Link
                        to="/admin/products"
                        className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition shadow-lg"
                    >
                        Manage Products
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Left Column: Admin Account Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <span className="text-indigo-600">👤</span> Admin Profile
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                <p className="text-gray-800 font-medium break-all">{profile.email}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Role</p>
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase bg-indigo-100 text-indigo-700">
                                    {profile.role}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-gray-50">
                                <button 
                                    onClick={logout}
                                    className="w-full text-sm font-bold text-gray-600 hover:text-red-600 transition py-2 rounded-lg border border-gray-100 hover:bg-red-50"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-red-50/50 rounded-2xl border border-red-100 p-8">
                        <h2 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h2>
                        <p className="text-xs text-red-600/70 mb-4">Permanently delete your admin account.</p>
                        <button 
                            onClick={handleDeleteAccount}
                            className="w-full bg-white text-red-600 border border-red-200 py-3 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition shadow-sm"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>

                {/* Right Column: Recent Orders */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                            <span className="bg-indigo-100 text-indigo-700 font-bold text-xs px-3 py-1 rounded-full">{orders.length} Total</span>
                        </div>
                        
                        <div className="p-8">
                            {loading ? (
                                <p className="text-center text-gray-400 py-10 animate-pulse">Loading orders...</p>
                            ) : orders.length === 0 ? (
                                <p className="text-center text-gray-500 py-10">No orders have been placed yet.</p>
                            ) : (
                                <div className="space-y-4">
                                    {orders.map(order => {
                                        const isExpanded = expandedOrderId === order.id;
                                        return (
                                            <div 
                                                key={order.id} 
                                                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                                className={`bg-white border rounded-2xl transition cursor-pointer overflow-hidden ${isExpanded ? 'border-indigo-300 shadow-md ring-2 ring-indigo-50' : 'border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300'}`}
                                            >
                                                {/* Overview (Always visible) */}
                                                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">#{order.id}</span>
                                                            <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                                                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                                                                order.status === 'Processing' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-amber-100 text-amber-700'
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-bold text-gray-900">{order.email.split('@')[0]} <span className="text-gray-400 font-normal">ordered</span> {order.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                            <span>📞</span> {order.contact || 'No phone provided'}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-6">
                                                        <div className="text-right hidden sm:block">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase">Total</p>
                                                            <p className="font-bold text-indigo-600">${(order.price * order.quantity).toFixed(2)}</p>
                                                        </div>
                                                        <div className="text-gray-400">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Expanded Details */}
                                                {isExpanded && (
                                                    <div className="px-6 pb-6 pt-2 border-t border-gray-50 bg-gray-50/30">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Customer Details</p>
                                                                    <p className="text-sm font-medium text-gray-800">{order.email}</p>
                                                                    <p className="text-xs text-gray-500 mt-1">{order.contact || 'No contact provided'}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Delivery Address</p>
                                                                    <p className="text-sm text-gray-600">{order.address || 'No address provided'}</p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Order Specs</p>
                                                                    <div className="flex justify-between text-sm">
                                                                        <span className="text-gray-600">Product:</span>
                                                                        <span className="font-medium text-gray-900">{order.name}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-sm mt-1">
                                                                        <span className="text-gray-600">Quantity:</span>
                                                                        <span className="font-medium text-gray-900">x{order.quantity}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-sm mt-1">
                                                                        <span className="text-gray-600">Payment:</span>
                                                                        <span className="font-medium text-gray-900 capitalize">{order.payment_method || 'Account'}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-sm mt-1">
                                                                        <span className="text-gray-600">Date:</span>
                                                                        <span className="font-medium text-gray-900">{new Date(order.created_at).toLocaleString()}</span>
                                                                    </div>
                                                                    <div className="flex justify-between text-sm mt-4 pt-4 border-t border-gray-100 items-center">
                                                                        <span className="text-gray-900 font-bold text-xs uppercase tracking-wider">Change Status:</span>
                                                                        <select 
                                                                            value={order.status}
                                                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                                            onClick={(e) => e.stopPropagation()}
                                                                            className="text-xs font-bold bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-500"
                                                                        >
                                                                            <option value="Pending">Pending</option>
                                                                            <option value="Processing">Processing</option>
                                                                            <option value="Shipped">Shipped</option>
                                                                            <option value="Delivered">Delivered</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;