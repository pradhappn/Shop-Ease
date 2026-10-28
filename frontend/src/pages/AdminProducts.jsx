// Admin product catalog: creates, edits, deletes, and lists store products.
import { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import { formatPrice } from '../utils/currency';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: '',
        category: 'Electronics',
        stock: ''
    });

    useEffect(() => {
        // Populate the management table on first render.
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        // Read current product records from the products API.
        try {
            const response = await productsAPI.getAll({});
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        // Update the matching controlled product-form field.
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        // Save changes to the selected product or create a new catalog entry.
        e.preventDefault();
        try {
            if (editingProduct) {
                await productsAPI.update(editingProduct._id, formData);
            } else {
                await productsAPI.create(formData);
            }
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error('Error saving product:', error);
        }
    };

    const handleEdit = (product) => {
        // Load a product's values into the form for editing.
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        // Require confirmation before permanently removing a catalog product.
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productsAPI.delete(id);
                fetchProducts();
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
    };

    const resetForm = () => {
        // Clear the editor and return the form to new-product defaults.
        setFormData({
            name: '',
            description: '',
            price: '',
            image: '',
            category: 'Electronics',
            stock: ''
        });
        setEditingProduct(null);
        setShowForm(false);
    };

    return (
        <div className="admin-products-page">
            <div className="container">
                <div className="admin-header">
                    <h1 className="page-title">Product Management</h1>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : '+ Add Product'}
                    </button>
                </div>

                {/* Product editor is shown for either creation or editing. */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="product-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="input"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    name="category"
                                    className="select"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Beauty">Beauty</option>
                                    <option value="Home">Home</option>
                                    <option value="Books">Books</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                name="description"
                                className="textarea"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    className="input"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    className="input"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Image URL</label>
                            <input
                                type="url"
                                name="image"
                                className="input"
                                value={formData.image}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            {editingProduct ? 'Update Product' : 'Create Product'}
                        </button>
                    </form>
                )}

                {/* Catalog table provides quick edit and delete actions. */}
                <div className="products-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>
                                        <img src={product.image} alt={product.name} className="table-image" />
                                    </td>
                                    <td>{product.name}</td>
                                    <td><span className="badge">{product.category}</span></td>
                                    <td>{formatPrice(product.price)}</td>
                                    <td>{product.stock}</td>
                                    <td className="actions-cell">
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => handleEdit(product)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleDelete(product._id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts;
