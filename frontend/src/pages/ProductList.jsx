// Searchable and filterable catalog page that renders a reusable card for every product.
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();

    const category = searchParams.get('category') || 'all';
    const search = searchParams.get('search') || '';

    useEffect(() => {
        // Reload the catalog whenever the selected category or search query changes.
        fetchProducts();
    }, [category, search]);

    const fetchProducts = async () => {
        // Requests matching products and exposes loading/error states to the page.
        try {
            setLoading(true);
            setError('');
            const params = {};
            if (category !== 'all') params.category = category;
            if (search) params.search = search;

            const response = await productsAPI.getAll({ ...params, limit: 100 });
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(error.response?.data?.message || 'Unable to load products. Check that the backend is running and try again.');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (newCategory) => {
        // Keeps filters in the URL so catalog state can be shared and navigated.
        setSearchParams({ category: newCategory, search });
    };

    const handleSearch = (e) => {
        // Applies search text immediately by updating the URL query parameters.
        setSearchParams({ category, search: e.target.value });
    };

    const categories = ['all', 'Electronics', 'Clothing', 'Fashion', 'Accessories', 'Beauty', 'Home', 'Books', 'Sports'];

    return (
        <div className="products-page">
            <div className="container">
                <div className="products-header">
                    <h1 className="page-title">Our Products</h1>

                    <div className="search-bar">
                        <input
                            type="text"
                            className="input search-input"
                            placeholder="Search products..."
                            value={search}
                            onChange={handleSearch}
                        />
                        <span className="search-icon">🔍</span>
                    </div>
                </div>

                {/* Category choices drive the product query through URL state. */}
                <div className="category-filter">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            className={`category-btn ${category === cat ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(cat)}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Show loading, failure, empty, or populated catalog content. */}
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading products...</p>
                    </div>
                ) : error ? (
                    <div className="no-products">
                        <h2>Products could not be loaded</h2>
                        <p>{error}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="no-products">
                        <h2>No products found</h2>
                        <p>Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductList;
