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
import API_BASE from "../config";

const Cart = () => {
    const { cart, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
    const navigate = useNavigate();

    const handlePlaceOrder = async () => {
        if (cart.length === 0) {
            return alert("Cart is empty!");
        }

        try {
            for (const item of cart) {
                await fetch(`${API_BASE}/api/orders/secure`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({
                        product_id: item.id,
                        quantity: item.quantity
                    })
                });
            }

            clearCart();
            alert("Order placed successfully!");
            navigate("/orders");
        } catch (err) {
            alert("Failed to place order. Please login first.");
        }
    };

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800">
                    Your cart is empty
                </h2>
                <Link
                    to="/collections"
                    className="mt-4 text-indigo-600 hover:underline"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="mx-auto max-w-7xl px-4 py-16">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">
                    Shopping Cart
                </h1>

                <div className="lg:grid lg:grid-cols-3 lg:gap-8">

                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div
                                key={item.id}
                                className="flex gap-4 border border-gray-200 rounded-lg p-4"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-24 h-24 object-cover rounded-md"
                                />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.description}</p>
                                    <p className="text-indigo-600 font-semibold mt-1">
                                        ${item.price} x {item.quantity}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-8 lg:mt-0">
                        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">
                                Order Summary
                            </h2>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Total Items</span>
                                <span className="font-semibold">{totalItems}</span>
                            </div>
                            <div className="flex justify-between mb-6">
                                <span className="text-gray-600">Total Price</span>
                                <span className="font-bold text-indigo-600">
                                    ${totalPrice.toFixed(2)}
                                </span>
                            </div>
                            <button
                                onClick={handlePlaceOrder}
                                className="w-full bg-indigo-600 text-white py-3 rounded-md font-semibold hover:bg-indigo-500"
                            >
                                Place Order
                            </button>
                            <Link
                                to="/collections"
                                className="block text-center mt-4 text-sm text-indigo-600 hover:underline"
                            >
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