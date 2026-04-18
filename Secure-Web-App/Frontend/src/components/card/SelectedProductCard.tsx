// const SelectedProductCard = () => {
//     return (
//         <div>
//             <a href="1" className="group relative mb-2 block h-96 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3">
//                 <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&q=75&fit=crop&crop=top&w=600&h=700" loading="lazy" alt="PhotobyAustinWade" className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110" />

//                 <div className="absolute bottom-2 left-0 flex gap-2">
//                     <span className="rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">-50%</span>
//                     <span className="rounded-lg bg-white px-3 py-1.5 text-sm font-bold uppercase tracking-wider text-gray-800">New</span>
//                 </div>
//             </a>

//             <div className="flex items-start justify-between gap-2 px-2">
//                 <div className="flex flex-col">
//                     <a href="1" className="text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl">Fancy Outfit</a>
//                     <span className="text-gray-500">by Fancy Brand</span>
//                 </div>

//                 <div className="flex flex-col items-end">
//                     <span className="font-bold text-gray-600 lg:text-lg">$19.99</span>
//                     <span className="text-sm text-red-500 line-through">$39.99</span>
//                 </div>
//             </div>
//         </div>

//     )
// }
// export default SelectedProductCard;


import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import API_BASE from "../../config";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

const SelectedProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            quantity: 1
        });
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="group">
            <Link
                to={`/product/${product.id}`}
                className="relative mb-2 block h-96 overflow-hidden rounded-lg bg-gray-100 shadow-lg lg:mb-3"
            >
                <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition duration-200 group-hover:scale-110"
                />
                <div className="absolute bottom-2 left-0 flex gap-2">
                    <span className="rounded-r-lg bg-red-500 px-3 py-1.5 text-sm font-semibold uppercase tracking-wider text-white">
                        New
                    </span>
                </div>
            </Link>

            <div className="flex items-start justify-between gap-2 px-2">
                <div className="flex flex-col">
                    <Link
                        to={`/product/${product.id}`}
                        className="text-lg font-bold text-gray-800 transition duration-100 hover:text-gray-500 lg:text-xl"
                    >
                        {product.name}
                    </Link>
                    <span className="text-gray-500">{product.description}</span>
                </div>

                <div className="flex flex-col items-end">
                    <span className="font-bold text-gray-600 lg:text-lg">
                        ${product.price}
                    </span>
                </div>
            </div>

            {/* Add to Cart Button */}
            <div className="px-2 mt-3">
                <button
                    onClick={handleAddToCart}
                    className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

const SelectedProduct = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_BASE}/api/products/secure`)
            .then(res => res.json())
            .then(data => {
                // Show only first 4 products on home page
                setProducts(data.slice(0, 4));
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-16">
                <p className="text-gray-500">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="bg-white py-6 sm:py-8 lg:py-12">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">

                {/* Section Header */}
                <div className="mb-6 flex items-end justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                        Featured Products
                    </h2>
                    <Link
                        to="/product"
                        className="inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                        View All Products
                    </Link>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-2 md:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
                    {products.map(product => (
                        <SelectedProductCard key={product.id} product={product} />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default SelectedProduct;