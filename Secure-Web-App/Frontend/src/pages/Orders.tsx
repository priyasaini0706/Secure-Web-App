import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API_BASE from "../config";

interface Order {
    id: number;
    name: string;
    price: number;
    quantity: number;
    created_at: string;
}

const Orders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch(`${API_BASE}/api/orders/secure/my`, {
            credentials: "include"
        })
            .then(async res => {
                if (!res.ok) throw new Error("Please login to view orders");
                return res.json();
            })
            .then(data => {
                setOrders(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-10">Loading orders...</div>;

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500">{error}</p>
                <Link to="/login" className="mt-4 text-indigo-600 hover:underline">
                    Go to Login
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-16">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {orders.length === 0 ? (
                    <div className="text-center">
                        <p className="text-gray-500">No orders yet.</p>
                        <Link
                            to="/collections"
                            className="mt-4 inline-block text-indigo-600 hover:underline"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div
                                key={order.id}
                                className="border border-gray-200 rounded-lg p-6"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {order.name}
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Quantity: {order.quantity}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Date: {new Date(order.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-indigo-600 font-bold text-lg">
                                        ${(order.price * order.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;