import axios from 'axios';
import authService from './authService';

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/cart`;

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

const getCart = async () => {
    const response = await axios.get(API_URL, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const updateCart = async (items) => {
    const response = await axios.put(API_URL, { items }, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const syncCart = async (items) => {
    const response = await axios.post(`${API_URL}/sync`, { items }, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const cartService = {
    getCart,
    updateCart,
    syncCart,
};

export default cartService;
