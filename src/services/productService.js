import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api/v1/products';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

const createProduct = async (productData) => {
    const response = await axios.post(API_URL, productData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const getProductsByStore = async (storeId) => {
    const response = await axios.get(`${API_URL}/store/${storeId}`);
    return response.data;
};

const getAllProducts = async (filters) => {
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
};

const deleteProduct = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const updateProduct = async (id, productData) => {
    const response = await axios.put(`${API_URL}/${id}`, productData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const productService = {
    createProduct,
    getProductsByStore,
    getAllProducts,
    deleteProduct,
    updateProduct,
};

export default productService;
