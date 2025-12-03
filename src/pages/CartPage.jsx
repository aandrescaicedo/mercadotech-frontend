import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useContext(CartContext);

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h2>
                <Link to="/" className="text-indigo-600 hover:text-indigo-500">
                    Continuar Comprando
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <ul className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                        <li key={item._id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                            <div className="flex items-center flex-1">
                                <div className="flex-shrink-0 h-16 w-16 bg-gray-200 rounded-md overflow-hidden">
                                    {item.images && item.images.length > 0 ? (
                                        <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-gray-400 text-xs">Sin Img</div>
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.store?.name}</p>
                                    <p className="text-sm font-bold text-indigo-600">${item.price.toLocaleString('es-CO')}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div className="flex items-center border rounded-md">
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                        -
                                    </button>
                                    <span className="px-3 py-1 text-gray-900">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item._id)}
                                    className="text-red-600 hover:text-red-800 font-medium"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="px-4 py-4 sm:px-6 bg-gray-50 flex justify-between items-center">
                    <button
                        onClick={clearCart}
                        className="text-sm text-red-600 hover:text-red-800"
                    >
                        Vaciar Carrito
                    </button>
                    <div className="text-right">
                        <p className="text-lg font-medium text-gray-900">Total: ${parseFloat(getCartTotal()).toLocaleString('es-CO')}</p>
                        <Link to="/checkout" className="mt-2 inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700">
                            Proceder al Pago
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
