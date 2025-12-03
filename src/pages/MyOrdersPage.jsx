import { useState, useEffect, useContext } from 'react';
import orderService from '../services/orderService';
import { AuthContext } from '../context/AuthContext';

const MyOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchOrders();
        }
    }, [user]);

    if (loading) return <div className="text-center py-12">Cargando pedidos...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Mis Pedidos</h1>

            {orders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No has realizado ningún pedido aún.</div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                            <div className="flex justify-between items-center border-b pb-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Pedido ID: {order._id}</p>
                                    <p className="text-sm text-gray-500">Fecha: {new Date(order.createdAt).toLocaleDateString('es-CO')}</p>
                                </div>
                                <div>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {order.status === 'PENDING' ? 'PENDIENTE' :
                                            order.status === 'PAID' ? 'PAGADO' :
                                                order.status === 'SHIPPED' ? 'ENVIADO' :
                                                    order.status === 'DELIVERED' ? 'ENTREGADO' : 'CANCELADO'}
                                    </span>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Artículos:</h4>
                                <ul className="divide-y divide-gray-200">
                                    {order.items.map((item, index) => (
                                        <li key={index} className="py-2 flex justify-between">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>${item.price.toLocaleString('es-CO')}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t">
                                <div>
                                    <p className="text-sm text-gray-600">Dirección: {order.shippingAddress.address}, {order.shippingAddress.city}</p>
                                </div>
                                <div className="text-xl font-bold text-indigo-600">
                                    Total: ${order.total.toLocaleString('es-CO')}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrdersPage;
