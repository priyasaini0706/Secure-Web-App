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
import ProductCard from "../components/card/ProductCard";
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

    useEffect(() => {
        fetch(`${API_BASE}/api/products/secure`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500">Loading products...</p>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Our Products
                </h2>
                <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Product;