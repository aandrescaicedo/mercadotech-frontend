/**
 * authService.js - Servicio de Autenticación (Frontend)
 * 
 * Propósito: Comunicación con el backend para autenticación
 * 
 * Responsabilidades:
 * - Hacer peticiones HTTP al backend de auth
 * - Guardar/cargar/eliminar datos de localStorage
 * - Gestionar token JWT en el cliente
 * 
 * Base URL: http://localhost:5000/api/v1/auth
 * 
 * Funciones exportadas:
 * - register(userData) - Registrar usuario
 * - login(userData) - Iniciar sesión
 * - googleLogin(email, googleId) - Login social
 * - logout() - Cerrar sesión (limpia localStorage)
 * - getCurrentUser() - Obtener usuario de localStorage
 * 
 * Estructura en localStorage:
 * Key: 'user'
 * Value: JSON.stringify({
 *   user: { id, email, role },
 *   token: "jwt_token_here"
 * })
 */

import axios from 'axios';

/**
 * URL base de la API de autenticación
 * En producción, esto vendría de una variable de entorno
 */
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/auth`;

/**
 * Registrar nuevo usuario
 * 
 * @async
 * @param {Object} userData - Datos del registro
 * @param {string} userData.email - Email del usuario
 * @param {string} userData.password - Contraseña
 * @param {string} userData.role - Rol (CLIENT, STORE, ADMIN)
 * 
 * @returns {Promise<Object>} { user: {...}, token: string }
 * @throws {AxiosError} Si el email ya existe o hay error de red
 * 
 * @endpoint POST /api/v1/auth/register
 * 
 * @description
 * 1. Envía petición POST al backend
 * 2. Backend crea usuario y retorna token
 * 3. Guarda respuesta completa en localStorage
 * 4. Retorna data para uso en el contexto
 */
const register = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

/**
 * Iniciar sesión
 * 
 * @async
 * @param {Object} userData - Credenciales
 * @param {string} userData.email - Email
 * @param {string} userData.password - Contraseña
 * 
 * @returns {Promise<Object>} { user: {...}, token: string }
 * @throws {AxiosError} Si las credenciales son inválidas
 * 
 * @endpoint POST /api/v1/auth/login
 * 
 * @description
 * Similar a register pero para usuarios existentes.
 * El token se guarda en localStorage para persistir sesión.
 */
const login = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

/**
 * Cerrar sesión
 * 
 * @description
 * Simplemente elimina el item 'user' de localStorage.
 * No hace petición al backend (JWT es stateless).
 * 
 * Después de esto, getCurrentUser() retornará null.
 */
const logout = () => {
    localStorage.removeItem('user');
};

/**
 * Obtener usuario actual desde localStorage
 * 
 * @returns {Object|null} { user: {...}, token: string } o null
 * 
 * @description
 * Parsea el JSON guardado en localStorage.
 * Si no existe o está corrupto, retorna null.
 * 
 * Usado en:
 * - AuthContext (al montar, para cargar sesión)
 * - Otros services (para obtener token)
 */
const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

/**
 * Login con Google (simulado en MVP)
 * 
 * @async
 * @param {string} email - Email de Google
 * @param {string} googleId - ID de Google
 * 
 * @returns {Promise<Object>} { user: {...}, token: string }
 * @throws {AxiosError} Si hay error en el proceso
 * 
 * @endpoint POST /api/v1/auth/google-login
 * 
 * @description
 * En el MVP, el googleId es generado en el frontend.
 * En producción, esto integraría con Google OAuth:
 * 1. Mostrar popup de Google
 * 2. Obtener token de Google
 * 3. Enviar a backend para validar
 * 4. Backend crea/actualiza usuario
 */
const googleLogin = async (email, googleId) => {
    const response = await axios.post(`${API_URL}/google-login`, { email, googleId });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

/**
 * Objeto de servicio exportado
 * Contiene todas las funciones de autenticación
 */
const authService = {
    register,
    login,
    googleLogin,
    logout,
    getCurrentUser,
};

export default authService;
