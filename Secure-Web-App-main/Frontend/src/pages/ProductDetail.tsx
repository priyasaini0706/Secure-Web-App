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

    useEffect(() => {
        fetch(`${API_BASE}/api/products/secure`)
            .then(res => res.json())
            .then(data => {
                const found = data.find((p: Product) => p.id === Number(id));
                setProduct(found);
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = () => {
        if (!product) return;
        addToCart({ ...product, quantity: 1 });
        alert(`${product.name} added to cart!`);
    };

    if (loading) return <div className="p-10">Loading...</div>;
    if (!product) return <div className="p-10">Product not found.</div>;

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">

                    {/* Image */}
                    <div>
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full rounded-lg object-cover"
                        />
                    </div>

                    {/* Details */}
                    <div className="mt-10 lg:mt-0 px-4">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {product.name}
                        </h1>
                        <p className="mt-4 text-2xl font-semibold text-indigo-600">
                            ${product.price}
                        </p>
                        <p className="mt-4 text-gray-600">{product.description}</p>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-md font-semibold hover:bg-indigo-500"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={() => navigate(-1)}
                                className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-semibold hover:bg-gray-50"
                            >
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;