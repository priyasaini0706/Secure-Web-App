import { useEffect, useState } from "react";
import API_BASE from "../config";
import { Link } from "react-router";

interface Order {
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
}

<Link
    to="/collections"
    className="mt-6 inline-block bg-indigo-600 text-white px-4 py-2 rounded"
>
    Manage Products
</Link>

const AdminDashboard = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        fetch(`${API_BASE}/api/auth/secure/admin/orders`, {
            credentials: "include"
        })
            .then(async (res) => {
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message);
                }
                return res.json();
            })
            .then(data => setOrders(data))
            .catch(err => setError(err.message));
    }, []);

    if (error) {
        return <div className="p-10 text-red-600">{error}</div>;
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold">Admin Dashboard (Secure)</h1>

            {orders.length === 0 && <p>No orders found.</p>}

            {orders.map(order => (
                <div key={order.id} className="border p-3 my-2 rounded">
                    <p>Order ID: {order.id}</p>
                    <p>User ID: {order.user_id}</p>
                    <p>Product ID: {order.product_id}</p>
                    <p>Quantity: {order.quantity}</p>
                </div>
            ))}
        </div>


    );

};


export default AdminDashboard;