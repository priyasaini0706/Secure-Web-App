import React, { useState, useEffect } from 'react';
import API_BASE from '../config';
import { Link } from 'react-router-dom';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
}

const AdminProducts = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800');
    
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isVulnerable, setIsVulnerable] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/products/secure`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error('Failed to fetch products', err);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const isEditing = editingId !== null;
        const method = isEditing ? 'PUT' : 'POST';
        const baseUrl = isVulnerable ? `${API_BASE}/api/products/vulnerable` : `${API_BASE}/api/products/secure`;
        const endpoint = isEditing ? `${baseUrl}/${editingId}` : baseUrl;

        const options: RequestInit = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, description, price: Number(price), image }),
        };

        if (!isVulnerable) {
            options.credentials = 'include';
        }

        try {
            const res = await fetch(endpoint, options);
            const data = await res.json();
            setMessage(data.message || `Product ${isEditing ? 'updated' : 'added'} successfully`);
            
            if (res.ok) {
                resetForm();
                fetchProducts();
            }
        } catch (err) {
            setMessage(`Error ${isEditing ? 'updating' : 'adding'} product`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setName('');
        setDescription('');
        setPrice('');
        setImage('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800');
        setEditingId(null);
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price.toString());
        setImage(product.image);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        
        const endpoint = isVulnerable ? `${API_BASE}/api/products/vulnerable/${id}` : `${API_BASE}/api/products/secure/${id}`;
        const options: RequestInit = {
            method: 'DELETE',
        };

        if (!isVulnerable) {
            options.credentials = 'include';
        }

        try {
            const res = await fetch(endpoint, options);
            const data = await res.json();
            alert(data.message);
            fetchProducts();
        } catch (err) {
            alert('Error deleting product');
        }
    };

    return (
        <div className="p-10 max-w-6xl mx-auto min-h-screen">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Product Management</h1>
                    <p className="text-gray-500 mt-1">Add, edit and manage your store's catalog</p>
                </div>
                <div className="flex items-center gap-4 bg-gray-100 p-1 rounded-xl border border-gray-200">
                    <button
                        onClick={() => setIsVulnerable(false)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${!isVulnerable ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Secure Mode
                    </button>
                    <button
                        onClick={() => setIsVulnerable(true)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition ${isVulnerable ? 'bg-red-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Vulnerable Mode
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                {isVulnerable ? (
                                    <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                                ) : (
                                    <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
                                )}
                                {editingId ? 'Update Product' : 'Add New Product'}
                            </h2>
                            {editingId && (
                                <button onClick={resetForm} className="text-xs text-gray-400 hover:text-gray-600 underline">Cancel Edit</button>
                            )}
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Title</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                    placeholder="What's the name of the product?"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Product Details</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition h-32"
                                    placeholder="Tell us more about this item..."
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                                        placeholder="29.99"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Image Upload</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full text-xs text-gray-500 file:mr-2 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-indigo-600 hover:file:bg-gray-200 cursor-pointer"
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-2">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Preview</p>
                                <div className="h-32 w-full rounded-xl border-2 border-dashed border-gray-100 overflow-hidden">
                                    <img src={image} alt="Product Preview" className="h-full w-full object-cover" />
                                </div>
                            </div>
                            
                            {message && (
                                <div className={`p-3 rounded-lg text-sm font-medium ${message.toLowerCase().includes('error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 rounded-xl font-bold text-white transition transform active:scale-95 shadow-lg ${isVulnerable ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'}`}
                            >
                                {loading ? 'Saving...' : editingId ? 'Update Item' : 'Create Product'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Current Catalog</h3>
                            <span className="text-xs font-medium bg-gray-200 px-2 py-1 rounded-md text-gray-600">{products.length} Items</span>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {products.length === 0 ? (
                                <div className="p-10 text-center text-gray-400 italic">No products in catalog</div>
                            ) : (
                                products.map((product) => (
                                    <div key={product.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition group">
                                        <div className="flex items-center gap-4">
                                            <img src={product.image} alt={product.name} className="h-16 w-16 rounded-lg object-cover bg-gray-100" />
                                            <div>
                                                <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition">{product.name}</h4>
                                                <p className="text-sm text-gray-500 line-clamp-1 max-w-md">{product.description}</p>
                                                <p className="text-sm font-semibold text-indigo-600 mt-1">${product.price}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(product)}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                                title="Edit Product"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                                                title="Delete Product"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    
                    <div className="mt-8 flex flex-col items-center gap-4">
                         <Link to="/product" className="text-indigo-600 font-semibold hover:underline flex items-center gap-2">
                            View Product Page
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                         </Link>
                         
                         <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-center mt-4 w-full">
                             <h4 className="text-amber-800 font-bold mb-2">Academic Demonstration</h4>
                             <Link to="/xss-demo" className="inline-block bg-amber-600 text-white px-4 py-2 rounded-md font-bold text-sm shadow-sm hover:bg-amber-700 transition">
                                 View XSS Vulnerability Demo
                             </Link>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default AdminProducts;
