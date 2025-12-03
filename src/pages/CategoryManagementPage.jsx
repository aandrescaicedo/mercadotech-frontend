import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import categoryService from '../services/categoryService';

const CategoryManagementPage = () => {
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            navigate('/');
            return;
        }
        fetchCategories();
    }, [user, navigate]);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await categoryService.updateCategory(editingId, formData);
                alert('¡Categoría actualizada exitosamente!');
            } else {
                await categoryService.createCategory(formData);
                alert('¡Categoría creada exitosamente!');
            }
            setFormData({ name: '', description: '' });
            setShowForm(false);
            setEditingId(null);
            fetchCategories();
        } catch (error) {
            console.error('Error saving category:', error);
            alert('Error al guardar la categoría');
        }
    };

    const handleEdit = (category) => {
        setEditingId(category._id);
        setFormData({ name: category.name, description: category.description });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            try {
                await categoryService.deleteCategory(id);
                alert('¡Categoría eliminada exitosamente!');
                fetchCategories();
            } catch (error) {
                console.error('Error deleting category:', error);
                alert('Error al eliminar la categoría');
            }
        }
    };

    const handleCancel = () => {
        setFormData({ name: '', description: '' });
        setShowForm(false);
        setEditingId(null);
    };

    if (loading) return <div className="text-center py-12">Cargando...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                    Agregar Categoría
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="mb-8 bg-white shadow sm:rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows="3"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                />
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    type="submit"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                                >
                                    {editingId ? 'Actualizar' : 'Crear'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* Categories List */}
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {categories.map((category) => (
                        <li key={category._id} className="px-4 py-4 sm:px-6 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-indigo-600">{category.name}</h3>
                                <p className="text-sm text-gray-500">{category.description}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(category)}
                                    className="text-indigo-600 hover:text-indigo-900"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(category._id)}
                                    className="text-red-600 hover:text-red-900"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                    {categories.length === 0 && (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                            No hay categorías aún. ¡Agrega tu primera categoría!
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default CategoryManagementPage;
