import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    const { addToCart } = useCart();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigating to detail page
        addToCart({ ...product, quantity: 1 });
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="group relative rounded-lg border border-gray-200 p-3 hover:shadow-md transition">
            <Link to={`/product/${product.id}`}>
                <div className="relative">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="aspect-square w-full rounded-md bg-gray-200 object-cover lg:h-80"
                    />
                    <button
                        onClick={handleAddToCart}
                        className="
                            absolute bottom-3 left-1/2 -translate-x-1/2
                            w-[90%] rounded-md bg-indigo-600 px-4 py-2
                            text-sm font-semibold text-white
                            opacity-0 group-hover:opacity-100
                            transition-all duration-300
                            hover:bg-indigo-700
                            shadow-sm
                        "
                    >
                        Add to Cart
                    </button>
                </div>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800">
                            {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">
                            {product.description}
                        </p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                        ${product.price}
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
