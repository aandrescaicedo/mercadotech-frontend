import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api/v1/stores';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

const createStore = async (storeData) => {
    const response = await axios.post(API_URL, storeData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const getMyStore = async () => {
    const response = await axios.get(`${API_URL}/my-store`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const getAllStores = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const updateStore = async (storeData) => {
    const response = await axios.put(`${API_URL}/my-store`, storeData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const approveStore = async (storeId) => {
    const response = await axios.patch(`${API_URL}/${storeId}/status`, {}, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const storeService = {
    createStore,
    getMyStore,
    getAllStores,
    updateStore,
    approveStore,
};

export default storeService;
