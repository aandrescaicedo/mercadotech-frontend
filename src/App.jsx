/**
 * App.jsx - Componente Principal de React
 * 
 * Propósito: Configurar la aplicación React con proveedores y rutas
 * 
 * Responsabilidades:
 * - Configurar React Router
 * - Proveer contextos globales (Auth, Cart)
 * - Definir todas las rutas de la aplicación
 * - Renderizar Navbar persistente (solo en rutas de la app)
 * - Implementar protección de rutas (PrivateRoute)
 * 
 * Estructura de Componentes:
 * Router
 *   └─ AuthProvider
 *       └─ CartProvider
 *           ├─ LandingPage (Ruta / sin Navbar)
 *           └─ MainLayout (Resto de rutas con Navbar)
 *               └─ Routes
 * 
 * Rutas configuradas:
 * - / → LandingPage (Página de ventas pública)
 * - /catalog → CatalogPage (Catálogo de productos)
 * - /login, /register → Auth (público)
 * - /cart → CartPage (público)
 * - /checkout → CheckoutPage (privado)
 * - /my-orders → MyOrdersPage (privado, CLIENT)
 * - /create-store → CreateStorePage (privado, STORE)
 * - /store-dashboard → StoreDashboardPage (privado, STORE)
 * - /admin → AdminDashboardPage (privado, ADMIN)
 * - /categories → CategoryManagementPage (privado, ADMIN)
 */

import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider, CartContext } from './context/CartContext';
import { useContext } from 'react';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CreateStorePage from './pages/CreateStorePage';
import StoreDashboardPage from './pages/StoreDashboardPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import MyOrdersPage from './pages/MyOrdersPage';
import LandingPage from './pages/LandingPage';

/**
 * Componente PrivateRoute - Protección de Rutas
 */
const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div>Cargando...</div>;

    return user ? children : <Navigate to="/login" />;
};

/**
 * Componente Navbar - Barra de Navegación
 */
const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { getCartCount } = useContext(CartContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm("¿Estás seguro que deseas salir de MercadoTech?")) {
            logout();
            navigate('/');
        }
    };

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex">
                        <Link to={user ? "/catalog" : "/"} className="flex-shrink-0 flex items-center text-xl font-bold text-indigo-600">
                            MercadoTech
                        </Link>
                    </div>

                    {/* Links de navegación */}
                    <div className="flex items-center space-x-4">
                        {/* Catálogo */}
                        <Link to="/catalog" className="text-gray-700 hover:text-indigo-600">Catálogo</Link>

                        {/* Mis Pedidos - Solo para clientes autenticados */}
                        {user && user.role === 'CLIENT' && (
                            <Link to="/my-orders" className="text-gray-700 hover:text-indigo-600">Mis Pedidos</Link>
                        )}

                        {/* Carrito con contador - Siempre visible */}
                        <Link to="/cart" className="text-gray-700 hover:text-indigo-600 relative">
                            Carrito
                            <span className="ml-1 bg-indigo-600 text-white text-xs rounded-full px-2 py-0.5">
                                {getCartCount()}
                            </span>
                        </Link>

                        {/* Opciones según autenticación */}
                        {user ? (
                            <>
                                {/* Email del usuario */}
                                <span className="text-gray-700 text-sm">Hola, {user.email}</span>

                                {/* Mi Tienda - Solo para STORE */}
                                {user.role === 'STORE' && (
                                    <Link to="/store-dashboard" className="text-gray-700 hover:text-indigo-600">Mi Tienda</Link>
                                )}

                                {/* Panel Admin - Solo para ADMIN */}
                                {user.role === 'ADMIN' && (
                                    <>
                                        <Link to="/admin" className="text-purple-600 hover:text-purple-800 font-semibold">Tiendas</Link>
                                        <Link to="/categories" className="text-purple-600 hover:text-purple-800 font-semibold">Categorías</Link>
                                    </>
                                )}

                                {/* Botón de Salir */}
                                <button onClick={handleLogout} className="text-red-600 hover:text-red-800 text-sm">Salir</button>
                            </>
                        ) : (
                            <>
                                {/* Login y Registro - Solo si no autenticado */}
                                <Link to="/login" className="text-gray-700 hover:text-indigo-600">Ingresar</Link>
                                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Registrarse</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

/**
 * Layout Principal para la aplicación (con Navbar)
 */
const MainLayout = () => {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <Outlet />
        </div>
    );
};

/**
 * Componente App - Raíz de la Aplicación
 */
function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        {/* Landing Page (Sin Navbar estándar) */}
                        <Route path="/" element={<LandingPage />} />

                        {/* Rutas de la Aplicación (Con Navbar) */}
                        <Route element={<MainLayout />}>
                            {/* Catálogo */}
                            <Route path="/catalog" element={<CatalogPage />} />

                            {/* Cart */}
                            <Route path="/cart" element={<CartPage />} />

                            {/* Checkout */}
                            <Route
                                path="/checkout"
                                element={
                                    <PrivateRoute>
                                        <CheckoutPage />
                                    </PrivateRoute>
                                }
                            />

                            {/* Auth */}
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />

                            {/* Create Store */}
                            <Route
                                path="/create-store"
                                element={
                                    <PrivateRoute>
                                        <CreateStorePage />
                                    </PrivateRoute>
                                }
                            />

                            {/* Store Dashboard */}
                            <Route
                                path="/store-dashboard"
                                element={
                                    <PrivateRoute>
                                        <StoreDashboardPage />
                                    </PrivateRoute>
                                }
                            />

                            {/* Admin Dashboard */}
                            <Route
                                path="/admin"
                                element={
                                    <PrivateRoute>
                                        <AdminDashboardPage />
                                    </PrivateRoute>
                                }
                            />

                            {/* Category Management */}
                            <Route
                                path="/categories"
                                element={
                                    <PrivateRoute>
                                        <CategoryManagementPage />
                                    </PrivateRoute>
                                }
                            />

                            {/* My Orders */}
                            <Route
                                path="/my-orders"
                                element={
                                    <PrivateRoute>
                                        <MyOrdersPage />
                                    </PrivateRoute>
                                }
                            />
                        </Route>
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
