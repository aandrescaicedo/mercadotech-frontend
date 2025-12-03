import axios from 'axios';
import authService from './authService';

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/orders`;

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

const createOrder = async (orderData) => {
    const response = await axios.post(API_URL, orderData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const getMyOrders = async () => {
    const response = await axios.get(`${API_URL}/my-orders`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const getStoreOrders = async () => {
    const response = await axios.get(`${API_URL}/store-orders`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const updateOrderStatus = async (orderId, status) => {
    const response = await axios.patch(`${API_URL}/${orderId}/status`, { status }, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const orderService = {
    createOrder,
    getMyOrders,
    getStoreOrders,
    updateOrderStatus,
};

export default orderService;
