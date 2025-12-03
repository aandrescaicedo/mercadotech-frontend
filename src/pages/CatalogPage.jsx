import { useState, useEffect } from 'react';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import ProductCard from '../components/ProductCard';

const CatalogPage = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await categoryService.getAllCategories();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const filters = { search, category, minPrice, maxPrice };
            // Remove empty filters
            Object.keys(filters).forEach(key => filters[key] === '' && delete filters[key]);

            const data = await productService.getAllProducts(filters);
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleClearFilters = () => {
        setSearch('');
        setCategory('');
        setMinPrice('');
        setMaxPrice('');
        // We need to trigger fetchProducts with empty filters. 
        // Since fetchProducts reads from state which might not be updated yet, 
        // we can pass empty filters directly or rely on a separate useEffect if we had one.
        // But fetchProducts uses current state variables. 
        // To ensure it uses cleared values, we can pass them as arguments or modify fetchProducts.
        // A cleaner way given current structure is to call getAllProducts directly here or modify fetchProducts to accept overrides.
        // Let's modify fetchProducts to accept optional filters, otherwise it uses state.
        // Actually, simpler: just set state and call a version that takes args, 
        // OR just reload the page/component? No, that's bad UX.

        // Let's refactor fetchProducts slightly to accept params, or just call service directly here.
        // Calling service directly is safest to ensure "clean" fetch.
        setLoading(true);
        productService.getAllProducts({})
            .then(data => setProducts(data))
            .catch(error => console.error('Error clearing filters:', error))
            .finally(() => setLoading(false));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Catálogo del Marketplace</h1>

                <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-sm space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                        <input
                            type="text"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                            placeholder="Nombre o descripción del producto"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="">Todas las Categorías</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio Mín</label>
                        <input
                            type="number"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                            placeholder="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                    </div>

                    <div className="w-full md:w-32">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Precio Máx</label>
                        <input
                            type="number"
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border"
                            placeholder="1000"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    <div className="flex space-x-2 w-full md:w-auto">
                        <button
                            type="submit"
                            className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Filtrar
                        </button>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="flex-1 md:flex-none bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Limpiar
                        </button>
                    </div>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-12">Cargando productos...</div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CatalogPage;
