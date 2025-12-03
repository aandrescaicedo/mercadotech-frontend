import axios from 'axios';
import authService from './authService';

const API_URL = 'http://localhost:5000/api/v1/categories';

const getAuthHeader = () => {
    const user = authService.getCurrentUser();
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

const getAllCategories = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

const createCategory = async (categoryData) => {
    const response = await axios.post(API_URL, categoryData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const updateCategory = async (id, categoryData) => {
    const response = await axios.put(`${API_URL}/${id}`, categoryData, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const deleteCategory = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
    });
    return response.data;
};

const categoryService = {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};

export default categoryService;
