import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import orderService from '../services/orderService';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
    const { cartItems, getCartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const handleInputChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const orderData = {
                items: cartItems.map((item) => ({
                    product: item._id,
                    quantity: item.quantity,
                    store: typeof item.store === 'object' ? item.store._id : item.store,
                })),
                shippingAddress,
            };

            await orderService.createOrder(orderData);
            clearCart();

            // Get unique store names for the alert
            const storeNames = [...new Set(cartItems.map(item => item.store?.name || 'Tienda'))].join(', ');
            alert(`¡Pedido realizado con éxito! Su pedido ha sido enviado a: ${storeNames}.`);

            navigate('/catalog');
        } catch (error) {
            console.error('Error creating order:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Error al procesar el pedido';
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return <div className="text-center py-12">Su carrito está vacío.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>
                    <ul className="divide-y divide-gray-200 bg-white shadow rounded-lg p-4">
                        {cartItems.map((item) => (
                            <li key={item._id} className="py-4 flex justify-between">
                                <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">Cant: {item.quantity}</p>
                                </div>
                                <p className="font-medium">${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                            </li>
                        ))}
                        <li className="py-4 flex justify-between font-bold text-lg border-t mt-2 pt-4">
                            <span>Total</span>
                            <span>${getCartTotal().toLocaleString('es-CO')}</span>
                        </li>
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Dirección de Envío</h2>
                    <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Dirección</label>
                            <input
                                type="text"
                                name="address"
                                required
                                value={shippingAddress.address}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ciudad</label>
                            <input
                                type="text"
                                name="city"
                                required
                                value={shippingAddress.city}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Código Postal</label>
                            <input
                                type="text"
                                name="postalCode"
                                required
                                value={shippingAddress.postalCode}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">País</label>
                            <input
                                type="text"
                                name="country"
                                required
                                value={shippingAddress.country}
                                onChange={handleInputChange}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                        >
                            {loading ? 'Procesando...' : 'Confirmar Pedido'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
