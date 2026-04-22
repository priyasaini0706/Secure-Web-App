// import CartCard from "../components/card/CartCard";

// const Cart = () => {
//     return (
//         <div className="bg-white py-6 sm:py-8 lg:py-12">
//             <div className="mx-auto max-w-screen-lg px-4 md:px-8">
//                 <div className="mb-6 sm:mb-10 lg:mb-16">
//                     <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-6 lg:text-3xl">Your Cart</h2>
//                 </div>
//                 <CartCard/>
//                 <CartCard/>
//                 <CartCard/>
//                 <CartCard/>
//                 <CartCard/>
//                 <CartCard/>
//             </div>
//             <div className="flex flex-col items-end gap-4 pr-10">
//                 <div className="w-full rounded-lg bg-gray-100 p-4 sm:max-w-xs">
//                     <div className="space-y-1">
//                         <div className="flex justify-between gap-4 text-gray-500">
//                             <span>Subtotal</span>
//                             <span>$129.99</span>
//                         </div>

//                         <div className="flex justify-between gap-4 text-gray-500">
//                             <span>Shipping</span>
//                             <span>$4.99</span>
//                         </div>
//                     </div>

//                     <div className="mt-4 border-t pt-4">
//                         <div className="flex items-start justify-between gap-4 text-gray-800">
//                             <span className="text-lg font-bold">Total</span>

//                             <span className="flex flex-col items-end">
//                                 <span className="text-lg font-bold">$134.98 USD</span>
//                                 <span className="text-sm text-gray-500">including VAT</span>
//                             </span>
//                         </div>
//                     </div>
//                 </div>

//                 <button className="inline-block rounded-lg bg-indigo-500 px-8 py-3 text-center text-sm font-semibold text-white outline-none ring-indigo-300 transition duration-100 hover:bg-indigo-600 focus-visible:ring active:bg-indigo-700 md:text-base">Check out</button>
//             </div>
//         </div>

//     )
// }
// export default Cart;

import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../config";

const Cart = () => {
    const { user } = useAuth();
    const { cart, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
    const navigate = useNavigate();
    const [customerName, setCustomerName] = useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("account");
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePlaceOrder = async () => {
        if (cart.length === 0) return alert("Cart is empty!");
        if (!user && !customerName) return alert("Please provide your name.");
        if (!address || !contact) return alert("Please provide delivery address and contact details.");

        setIsProcessing(true);
        try {
            const endpoint = user ? `${API_BASE}/api/orders/secure` : `${API_BASE}/api/orders/vulnerable`;
            
            for (const item of cart) {
                await fetch(endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        product_id: item.id,
                        quantity: item.quantity,
                        customer_name: user ? user.email.split('@')[0] : customerName,
                        address,
                        contact,
                        payment_method: paymentMethod
                    })
                });
            }

            clearCart();
            alert("Order placed successfully!");
            navigate("/dashboard");
        } catch (err) {
            alert("Failed to place order. Please check your connection.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
                <div className="text-6xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
                <Link to="/product" className="mt-4 text-indigo-600 font-bold hover:underline">Start Shopping</Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="mx-auto max-w-7xl px-4 py-16">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-7 space-y-6">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-6 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition hover:shadow-md">
                                <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-900 text-lg">{item.name}</h3>
                                    <p className="text-sm text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                                    <div className="flex justify-between items-end mt-4">
                                        <p className="text-indigo-600 font-black">${item.price} <span className="text-gray-400 text-xs font-normal">x {item.quantity}</span></p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider">Remove</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout Details */}
                    <div className="lg:col-span-5 mt-10 lg:mt-0">
                        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery & Payment</h2>
                            
                            <div className="space-y-4 mb-8">
                                {!user && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                                        <input 
                                            type="text"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Delivery Address</label>
                                    <textarea 
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        placeholder="Where should we ship it?"
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Contact Number</label>
                                    <input 
                                        type="text"
                                        value={contact}
                                        onChange={(e) => setContact(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                                        placeholder="+1 (555) 000-0000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Payment Method</label>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <button 
                                            onClick={() => setPaymentMethod("account")}
                                            className={`py-3 rounded-xl text-xs font-bold border transition ${paymentMethod === 'account' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            Bank Transfer
                                        </button>
                                        <button 
                                            onClick={() => setPaymentMethod("paypal")}
                                            className={`py-3 rounded-xl text-xs font-bold border transition ${paymentMethod === 'paypal' ? 'bg-[#0070ba] border-[#0070ba] text-white shadow-lg shadow-blue-100' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            PayPal
                                        </button>
                                        <button 
                                            onClick={() => setPaymentMethod("cod")}
                                            className={`py-3 rounded-xl text-xs font-bold border transition ${paymentMethod === 'cod' ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-100' : 'bg-white border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            Cash on Delivery
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-50 pt-6 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400 text-sm">Total Items</span>
                                    <span className="font-bold text-gray-900">{totalItems}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-900 font-bold">Total Amount</span>
                                    <span className="text-2xl font-black text-indigo-600">${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isProcessing}
                                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition duration-300 shadow-xl transform active:scale-95 disabled:opacity-50"
                            >
                                {isProcessing ? 'Processing...' : 'Confirm Order'}
                            </button>
                            
                            <Link to="/product" className="block text-center mt-4 text-xs font-bold text-gray-400 hover:text-indigo-600 uppercase tracking-widest">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;