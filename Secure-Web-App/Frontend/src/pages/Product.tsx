// import ProductCard from "../components/card/ProductCard";

// const Product = () => {
//     return (
//         <div className="bg-white">
//             <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
//                 <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
//                 <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
//                     <ProductCard/>
//                     <ProductCard/>
//                     <ProductCard/>
//                     <ProductCard/>
//                     <ProductCard/>
//                     <ProductCard/>
//                     <ProductCard/>
//                     <ProductCard/>
//                 </div>
//             </div>
//         </div>
//     )
// }
// export default Product;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API_BASE from "../config";

interface ProductData {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

const Product = () => {
    const [products, setProducts] = useState<ProductData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVulnerable, setIsVulnerable] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    useEffect(() => {
        const endpoint = isVulnerable ? `${API_BASE}/api/products/vulnerable` : `${API_BASE}/api/products/secure`;
        setLoading(true);
        fetch(endpoint)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [isVulnerable]);

    const handleAddToCart = (product: ProductData) => {
        addToCart({ ...product, quantity: 1 });
        alert(`${product.name} added to cart!`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500 animate-pulse font-medium text-lg">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 border-b pb-8">
                    <div>
                        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2">
                            {isVulnerable ? "Raw Gallery View" : "Our Collections"}
                        </h2>
                        <p className="text-gray-500 max-w-lg">
                            {isVulnerable 
                                ? "Developer mode: Rendering raw database entries for security testing." 
                                : "Standard mode: High-quality items with safe rendering."}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                        <button
                            onClick={() => setIsVulnerable(false)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${!isVulnerable ? 'bg-white text-indigo-600 shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Standard
                        </button>
                        <button
                            onClick={() => setIsVulnerable(true)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isVulnerable ? 'bg-red-600 text-white shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            Raw
                        </button>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 font-medium">No products found in this version.</p>
                    </div>
                ) : (
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {products.map(product => (
                            <div key={product.id} className="group relative flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500">
                                <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover object-center group-hover:scale-110 transition duration-700"
                                    />
                                    <button 
                                        onClick={() => navigate(`/product/${product.id}`)}
                                        className="absolute inset-0 z-10"
                                        aria-label="View Details"
                                    />
                                    <div className="absolute top-4 right-4 z-20">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAddToCart(product);
                                            }}
                                            className="bg-white/90 backdrop-blur-md p-2 rounded-full shadow-lg hover:bg-indigo-600 hover:text-white transition-colors duration-300"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition">
                                            {isVulnerable ? (
                                                <span dangerouslySetInnerHTML={{ __html: product.name }} />
                                            ) : (
                                                <span>{product.name}</span>
                                            )}
                                        </h3>
                                        <p className="text-xl font-black text-indigo-600">
                                            ${product.price}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">
                                        {isVulnerable ? (
                                            <span dangerouslySetInnerHTML={{ __html: product.description }} />
                                        ) : (
                                            <span>{product.description}</span>
                                        )}
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => navigate(`/product/${product.id}`)}
                                            className="py-3 rounded-xl bg-gray-50 text-gray-900 text-xs font-bold hover:bg-gray-100 transition duration-300"
                                        >
                                            Details
                                        </button>
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            className="py-3 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition duration-300 shadow-md"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};



export default Product;