import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, X, Check } from 'lucide-react';

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const [showImageModal, setShowImageModal] = useState(false);

    const handleOpenModal = () => {
        setQuantity(1);
        setShowModal(true);
    };

    const handleConfirmAddToCart = () => {
        addToCart(product, quantity);
        setShowModal(false);
        alert(`Se agregaron ${quantity} unidad(es) de "${product.name}" al carrito.`);
    };

    // Helper to validate image URL
    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // If it's a local file path string from DB, return null (placeholder will be shown)
        // or you could implement a logic to strip the local path if you are serving files statically
        return null;
    };

    const imageUrl = getImageUrl(product.images && product.images.length > 0 ? product.images[0] : null);

    return (
        <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                {/* Product Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden group">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                            onClick={() => setShowImageModal(true)}
                            onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Sin+Imagen'; }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                            <span className="text-sm">Sin imagen</span>
                        </div>
                    )}

                    {/* Quick Add Button (visible on hover) */}
                    <button
                        onClick={handleOpenModal}
                        className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-indigo-50 text-indigo-600"
                        title="Agregar al carrito"
                    >
                        <ShoppingCart size={20} />
                    </button>
                </div>

                {/* Product Details */}
                <div className="p-4 flex flex-col flex-grow">
                    <div className="mb-2">
                        <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                            {product.category?.name || 'General'}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2" title={product.name}>
                        {product.name}
                    </h3>

                    <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">Precio</span>
                            <span className="text-xl font-bold text-gray-900">
                                ${product.price?.toLocaleString()}
                            </span>
                        </div>

                        <button
                            onClick={handleOpenModal}
                            className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Agregar
                        </button>
                    </div>

                    {product.store && (
                        <div className="mt-3 text-xs text-gray-400 flex items-center gap-1">
                            <span>Vendido por:</span>
                            <span className="font-medium text-gray-600">{product.store.name}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Agregar al Carrito</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600 mb-4">
                                ¿Deseas agregar <strong>{product.name}</strong> al carrito?
                            </p>

                            <div className="flex items-center gap-4">
                                <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button
                                        className="px-3 py-1 hover:bg-gray-100 border-r border-gray-300"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        max={product.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, Math.min(product.stock, parseInt(e.target.value) || 1)))}
                                        className="w-16 text-center py-1 focus:outline-none"
                                    />
                                    <button
                                        className="px-3 py-1 hover:bg-gray-100 border-l border-gray-300"
                                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="text-xs text-gray-500">(Stock: {product.stock})</span>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleConfirmAddToCart}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium flex items-center gap-2"
                            >
                                <Check size={16} /> Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Zoom Modal */}
            {showImageModal && imageUrl && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300"
                        >
                            <X size={32} />
                        </button>
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default ProductCard;
