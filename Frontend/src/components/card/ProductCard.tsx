const ProductCard = () => {
    return (
        <div className="group relative rounded-lg border border-gray-200 p-3 hover:shadow-md transition">
            <div className="relative">
                <img
                    src="https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg"
                    alt="Photo"
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover lg:h-80"
                />
                <button
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
                        Basic Tee
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">Black</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">$35</p>
            </div>
        </div>
    );
};

export default ProductCard;
