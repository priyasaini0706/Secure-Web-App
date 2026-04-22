import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API_BASE from "../config";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isVulnerable, setIsVulnerable] = useState(false);

    useEffect(() => {
        const endpoint = isVulnerable ? `${API_BASE}/api/products/vulnerable` : `${API_BASE}/api/products/secure`;
        setLoading(true);
        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                const found = data.find((p: Product) => p.id === Number(id));
                setProduct(found);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [id, isVulnerable]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({ ...product, quantity: 1 });
        alert(`${product.name} added to cart!`);
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );
    
    if (!product) return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
            <h1 className="text-2xl font-bold text-gray-800">Product not found.</h1>
            <button onClick={() => navigate("/product")} className="mt-4 text-indigo-600 hover:underline">Back to products</button>
        </div>
    );

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Display settings */}
                <div className="flex justify-end mb-8">
                    <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
                        <button
                            onClick={() => setIsVulnerable(false)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${!isVulnerable ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Default View
                        </button>
                        <button
                            onClick={() => setIsVulnerable(true)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition ${isVulnerable ? 'bg-red-600 text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Unfiltered
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 lg:grid lg:grid-cols-2 lg:gap-x-0">
                    {/* Image */}
                    <div className="relative h-96 lg:h-auto overflow-hidden">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover transition duration-700 hover:scale-105"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-900 border border-gray-200">
                           Premium Choice
                        </div>
                    </div>

                    {/* Details */}
                    <div className="p-8 lg:p-16 flex flex-col justify-center">
                        <div className="mb-8">
                            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                                {isVulnerable ? (
                                    <span dangerouslySetInnerHTML={{ __html: product.name }} />
                                ) : (
                                    <span>{product.name}</span>
                                )}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-3xl font-black text-indigo-600">
                                    ${product.price}
                                </span>
                                <span className="bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                                    In Stock
                                </span>
                            </div>
                            <div className="prose prose-indigo text-gray-600 leading-relaxed text-lg">
                                {isVulnerable ? (
                                    <p dangerouslySetInnerHTML={{ __html: product.description }} />
                                ) : (
                                    <p>{product.description}</p>
                                )}
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-gray-900 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:bg-indigo-600 transition duration-300 shadow-xl transform active:scale-95"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => navigate("/product")}
                                className="w-full border-2 border-gray-100 text-gray-500 py-4 px-8 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:text-gray-900 transition duration-300"
                            >
                                Continue Shopping
                            </button>
                        </div>
                        
                        <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-3 gap-4">
                            <div className="text-center">
                                <div className="text-xl mb-1">🚚</div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Fast Delivery</p>
                            </div>
                            <div className="text-center">
                                <div className="text-xl mb-1">🛡️</div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Secure Pay</p>
                            </div>
                            <div className="text-center">
                                <div className="text-xl mb-1">✨</div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Best Quality</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;