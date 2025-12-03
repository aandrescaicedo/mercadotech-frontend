import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import storeService from '../services/storeService';
import { AuthContext } from '../context/AuthContext';

const AdminDashboardPage = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const data = await storeService.getAllStores();
                setStores(data);
            } catch (error) {
                console.error('Error fetching stores:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'ADMIN') {
            fetchStores();
        } else {
            navigate('/');
        }
    }, [user, navigate]);

    const handleApprove = async (id) => {
        try {
            const updatedStore = await storeService.approveStore(id);
            setStores(stores.map(store => store._id === id ? updatedStore : store));
            alert('Tienda aprobada exitosamente');
        } catch (error) {
            console.error('Error approving store:', error);
            alert('Error al aprobar la tienda');
        }
    };

    if (loading) return <div className="text-center py-12">Cargando...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
                <Link to="/categories" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                    Gestionar Categorías
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {stores.map((store) => (
                        <li key={store._id} className="px-4 py-4 sm:px-6 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-indigo-600">{store.name}</h3>
                                <p className="text-sm text-gray-500">{store.description}</p>
                                <p className="text-sm text-gray-400">Dueño: {store.owner?.email}</p>
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${store.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        store.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                    {store.status === 'APPROVED' ? 'APROBADA' : store.status === 'PENDING' ? 'PENDIENTE' : 'RECHAZADA'}
                                </span>
                            </div>
                            <div>
                                {store.status === 'PENDING' && (
                                    <button
                                        onClick={() => handleApprove(store._id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
                                    >
                                        Aprobar
                                    </button>
                                )}
                            </div>
                        </li>
                    ))}
                    {stores.length === 0 && (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                            No hay tiendas registradas.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
