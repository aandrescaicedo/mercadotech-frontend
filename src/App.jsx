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

import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider, CartContext } from './context/CartContext';
import { useContext } from 'react';
import { ShoppingBag } from 'lucide-react';
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
    const location = useLocation();

    const handleLogout = () => {
        if (window.confirm("¿Estás seguro que deseas salir de MercadoTech?")) {
            logout();
            navigate('/');
        }
    };

    // Helper para crear enlaces con estado activo
    const NavLink = ({ to, children, className = "" }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`
                    px-3 py-2 rounded-lg font-medium transition-all duration-200
                    ${isActive
                        ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                    }
                    ${className}
                `}
            >
                {children}
            </Link>
        );
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to={user ? "/catalog" : "/"} className="flex items-center space-x-2 group">
                            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
                                <ShoppingBag className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                MercadoTech
                            </span>
                        </Link>
                    </div>

                    {/* Links de navegación */}
                    <div className="flex items-center space-x-2">
                        {/* Catálogo */}
                        <NavLink to="/catalog">Catálogo</NavLink>

                        {/* Mis Pedidos - Solo para clientes autenticados */}
                        {user && user.role === 'CLIENT' && (
                            <NavLink to="/my-orders">Mis Pedidos</NavLink>
                        )}

                        {/* Carrito con contador */}
                        <NavLink to="/cart" className="relative">
                            Carrito
                            {getCartCount() > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-md">
                                    {getCartCount()}
                                </span>
                            )}
                        </NavLink>

                        {/* Opciones según autenticación */}
                        {user ? (
                            <>
                                {/* Mi Tienda - Solo para STORE */}
                                {user.role === 'STORE' && (
                                    <NavLink to="/store-dashboard">Mi Tienda</NavLink>
                                )}

                                {/* Panel Admin - Solo para ADMIN */}
                                {user.role === 'ADMIN' && (
                                    <>
                                        <NavLink to="/admin">Tiendas</NavLink>
                                        <NavLink to="/categories">Categorías</NavLink>
                                    </>
                                )}

                                {/* Email del usuario */}
                                <span className="text-sm text-gray-600 px-3 py-2">
                                    Hola, <span className="font-medium text-gray-900">{user.email.split('@')[0]}</span>
                                </span>

                                {/* Botón de Salir */}
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-105"
                                >
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Login */}
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200"
                                >
                                    Ingresar
                                </Link>
                                {/* Registro */}
                                <Link
                                    to="/register"
                                    className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                                >
                                    Registrarse
                                </Link>
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
