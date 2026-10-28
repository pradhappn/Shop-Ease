// Reusable product tile showing key product information and cart actions.
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = async () => {
        // Adds one unit through shared cart state; unavailable items are disabled below.
        const result = await addToCart(product._id, 1);
        if (result.success) {
            // Optional: Show success notification
            console.log('Added to cart!');
        }
    };

    return (
        <div className="product-card">
            {/* Product imagery and name both open the matching details page. */}
            <Link to={`/products/${product._id}`} className="product-image-link">
                <div className="product-image-wrapper">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                    />
                </div>
            </Link>

            <div className="product-info">
                <Link to={`/products/${product._id}`} className="product-name-link">
                    <h3 className="product-name">{product.name}</h3>
                </Link>

                <p className="product-price">{formatPrice(product.price)}</p>

                {product.ratings && (
                    <div className="product-rating">
                        <span className="stars">{'★'.repeat(Math.round(product.ratings.average))}</span>
                        <span className="rating-text">({product.ratings.count})</span>
                    </div>
                )}

                {/* Purchase controls reflect current stock availability. */}
                <div className="product-actions">
                    <button
                        className="btn btn-primary add-to-cart-btn"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>

                    <button className="btn btn-secondary cart-icon-btn">
                        🛒
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
