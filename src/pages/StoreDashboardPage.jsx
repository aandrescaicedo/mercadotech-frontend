import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import storeService from '../services/storeService';
import productService from '../services/productService';
import orderService from '../services/orderService';
import { AuthContext } from '../context/AuthContext';
import ProductForm from '../components/ProductForm';

const StoreDashboardPage = () => {
    const [store, setStore] = useState(null);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editData, setEditData] = useState({ name: '', description: '' });
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const myStore = await storeService.getMyStore();
                if (!myStore) {
                    navigate('/create-store');
                    setLoading(false);
                    return;
                }
                setStore(myStore);
                setEditData({ name: myStore.name, description: myStore.description });

                const storeProducts = await productService.getProductsByStore(myStore._id);
                setProducts(storeProducts);

                const storeOrders = await orderService.getStoreOrders();
                setOrders(storeOrders);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching store data:', error);
                if (error.response?.status === 404) {
                    navigate('/create-store');
                }
                setLoading(false);
            }
        };

        if (user?.role === 'STORE') {
            fetchStoreData();
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    const handleProductAdded = async () => {
        setShowForm(false);
        setEditingProduct(null);
        const storeProducts = await productService.getProductsByStore(store._id);
        setProducts(storeProducts);
    };

    const handleDeleteProduct = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este producto?')) {
            try {
                await productService.deleteProduct(id);
                setProducts(products.filter(p => p._id !== id));
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const handleEditStore = async (e) => {
        e.preventDefault();
        try {
            const updated = await storeService.updateStore(editData);
            setStore(updated);
            setShowEditForm(false);
            alert('¡Tienda actualizada exitosamente!');
        } catch (error) {
            console.error('Error updating store:', error);
            alert('Error al actualizar la tienda');
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            alert('Estado del pedido actualizado');
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Error al actualizar el estado');
        }
    };

    if (loading) return <div className="text-center py-12">Cargando...</div>;
    if (!store) return <div className="text-center py-12">Cargando tienda...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{store.name}</h1>
                    <p className="text-gray-500">{store.description}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${store.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {store.status === 'APPROVED' ? 'APROBADA' : store.status === 'PENDING' ? 'PENDIENTE' : 'RECHAZADA'}
                    </span>
                    <button
                        onClick={() => setShowEditForm(!showEditForm)}
                        className="ml-4 text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                        Editar Información
                    </button>
                </div>
                {activeTab === 'products' && (
                    <button
                        onClick={() => { setEditingProduct(null); setShowForm(true); }}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Agregar Producto
                    </button>
                )}
            </div>

            {/* Edit Store Form */}
            {showEditForm && (
                <div className="mb-8 bg-white shadow sm:rounded-lg p-6">
                    <form onSubmit={handleEditStore}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre de la Tienda</label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    value={editData.description}
                                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                    required
                                    rows="3"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                >
                                    Guardar Cambios
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowEditForm(false)}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`${activeTab === 'products'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Productos
                    </button>
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`${activeTab === 'orders'
                            ? 'border-indigo-500 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        Pedidos
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'products' ? (
                <>
                    {/* Product Form (Add or Edit) */}
                    {showForm && (
                        <div className="mb-8">
                            <ProductForm
                                storeId={store._id}
                                product={editingProduct}
                                onProductAdded={handleProductAdded}
                                onCancel={() => { setShowForm(false); setEditingProduct(null); }}
                            />
                        </div>
                    )}

                    {/* Products List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {products.map((product) => (
                                <li key={product._id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
                                    <div className="flex-1">
                                        {product.images && product.images.length > 0 && (
                                            <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded mb-2" />
                                        )}
                                        <h3 className="text-lg font-medium text-indigo-600">{product.name}</h3>
                                        <p className="text-sm text-gray-500">{product.description}</p>
                                        <div className="mt-1 text-sm text-gray-900">
                                            Precio: ${product.price.toLocaleString('es-CO')} | Stock: {product.stock}
                                        </div>
                                        {product.category && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                                {product.category.name || product.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEditProduct(product)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDeleteProduct(product._id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </li>
                            ))}
                            {products.length === 0 && (
                                <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                    No hay productos aún. ¡Agrega tu primer producto!
                                </li>
                            )}
                        </ul>
                    </div>
                </>
            ) : (
                /* Orders List */
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <li key={order._id} className="px-4 py-4 sm:px-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Pedido #{order._id.slice(-6)}</h3>
                                        <p className="text-sm text-gray-500">
                                            Cliente: {order.user?.email}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Fecha: {new Date(order.createdAt).toLocaleDateString('es-CO')}
                                        </p>
                                        <div className="mt-2">
                                            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Artículos</h4>
                                            <ul className="mt-1 space-y-1">
                                                {order.items.map((item, idx) => (
                                                    <li key={idx} className="text-sm text-gray-700">
                                                        {item.name} x {item.quantity} - ${item.price.toLocaleString('es-CO')}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="mt-2 text-sm font-bold text-gray-900">
                                            Total: ${order.total.toLocaleString('es-CO')}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                        >
                                            <option value="PENDING">PENDIENTE</option>
                                            <option value="PAID">PAGADO</option>
                                            <option value="SHIPPED">ENVIADO</option>
                                            <option value="DELIVERED">ENTREGADO</option>
                                            <option value="CANCELLED">CANCELADO</option>
                                        </select>
                                    </div>
                                </div>
                            </li>
                        ))}
                        {orders.length === 0 && (
                            <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                                No hay pedidos aún.
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default StoreDashboardPage;
