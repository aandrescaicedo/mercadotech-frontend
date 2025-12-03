/**
 * AuthContext.jsx - Contexto de Autenticación Global
 * 
 * Propósito: Gestionar el estado de autenticación en toda la aplicación
 * 
 * Responsabilidades:
 * - Mantener información del usuario autenticado
 * - Proveer funciones de login, register, logout
 * - Cargar usuario desde localStorage al iniciar
 * - Proporcionar estado de carga (loading)
 * 
 * Estado proporcionado:
 * - user: { id, email, role } | null
 * - loading: boolean
 * 
 * Funciones proporcionadas:
 * - login(email, password)
 * - register(email, password, role)
 * - googleLogin(email, googleId)
 * - logout()
 * 
 * Usado en:
 * - App.jsx (como Provider en la raíz)
 * - LoginPage, RegisterPage (para autenticación)
 * - Navbar (mostrar usuario y opciones según rol)
 * - PrivateRoute (proteger rutas)
 * - Todas las páginas que necesiten saber si hay usuario
 */

import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';

/**
 * Contexto de autenticación
 * Exportado para usar con useContext(AuthContext)
 */
export const AuthContext = createContext();

/**
 * Provider de autenticación
 * 
 * @component
 * @param {Object} props
 * @param {ReactNode} props.children - Componentes hijos
 * 
 * @description
 * Envuelve la aplicación para proveer estado de autenticación global.
 * Al montar, carga el usuario desde localStorage si existe.
 * Renderiza children solo cuando loading=false para evitar parpadeos.
 */
export const AuthProvider = ({ children }) => {
    /**
     * Estado del usuario actual
     * null = no autenticado
     * { id, email, role } = autenticado
     */
    const [user, setUser] = useState(null);

    /**
     * Estado de carga inicial
     * true = verificando localStorage
     * false = verificación completada
     */
    const [loading, setLoading] = useState(true);

    /**
     * Efecto: Cargar usuario desde localStorage al montar
     * 
     * Flujo:
     * 1. Intenta obtener usuario de localStorage
     * 2. Si existe, actualiza estado user
     * 3. Marca loading como false
     * 
     * Permite persistir sesión entre recargas de página.
     */
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser.user);
        }
        setLoading(false);
    }, []);

    /**
     * Iniciar sesión
     * 
     * @async
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @returns {Promise<Object>} Datos del login (user, token)
     * @throws {Error} Si las credenciales son inválidas
     * 
     * @description
     * 1. Llama a authService.login() → API
     * 2. Actualiza estado local con el usuario
     * 3. authService ya guardó en localStorage
     * 4. Retorna data para que el componente pueda redirigir
     */
    const login = async (email, password) => {
        try {
            const data = await authService.login({ email, password });
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Registrar nuevo usuario
     * 
     * @async
     * @param {string} email - Email del usuario
     * @param {string} password - Contraseña
     * @param {string} role - Rol (CLIENT, STORE, ADMIN)
     * @returns {Promise<Object>} Datos del registro (user, token)
     * @throws {Error} Si el email ya existe
     * 
     * @description
     * Similar a login, pero crea un nuevo usuario.
     * Automáticamente inicia sesión después de registrar.
     */
    const register = async (email, password, role) => {
        try {
            const data = await authService.register({ email, password, role });
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Cerrar sesión
     * 
     * @description
     * 1. Llama a authService.logout() → Limpia localStorage
     * 2. Actualiza estado local a null
     * 3. El usuario es redirigido a la página de login
     */
    const logout = () => {
        authService.logout();
        setUser(null);
    };

    /**
     * Login con Google (simulado en MVP)
     * 
     * @async
     * @param {string} email - Email de Google
     * @param {string} googleId - ID de Google
     * @returns {Promise<Object>} Datos del login
     * @throws {Error} Si hay error en el proceso
     * 
     * @description
     * En el MVP, el googleId es generado por el frontend.
     * En producción, usaría OAuth real de Google.
     */
    const googleLogin = async (email, googleId) => {
        try {
            const data = await authService.googleLogin(email, googleId);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    /**
     * Renderizar Provider
     * 
     * value: Objeto con estado y funciones disponibles globalmente
     * 
     * Nota: Solo renderiza children cuando loading=false
     * Esto evita que componentes intenten usar el contexto
     * antes de que se cargue el usuario de localStorage.
     */
    return (
        <AuthContext.Provider value={{ user, login, register, googleLogin, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
