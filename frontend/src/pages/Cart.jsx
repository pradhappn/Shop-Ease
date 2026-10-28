// Shopping cart page for editing item quantities and continuing to checkout.
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/currency';
import './Cart.css';

const Cart = () => {
    const { cart, updateQuantity, removeFromCart, calculateTotal, loading } = useCart();
    const navigate = useNavigate();

    const handleQuantityChange = async (productId, newQuantity) => {
        // Prevent quantities below one; valid updates are saved by the cart context.
        if (newQuantity < 1) return;
        await updateQuantity(productId, newQuantity);
    };

    const handleRemove = async (productId) => {
        // Remove the selected product through the shared cart state.
        await removeFromCart(productId);
    };

    const handleCheckout = () => {
        // Continue to the protected shipping and payment step.
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Loading cart...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <h1 className="page-title">Shopping Cart</h1>

                {/* Empty cart prompt or item list with a live order summary. */}
                {cart.items.length === 0 ? (
                    <div className="empty-cart">
                        <div className="empty-cart-icon">🛒</div>
                        <h2>Your cart is empty</h2>
                        <p>Add some products to get started!</p>
                        <button onClick={() => navigate('/products')} className="btn btn-primary">
                            Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cart.items.map((item) => (
                                <div key={item.product._id} className="cart-item">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="cart-item-image"
                                    />

                                    <div className="cart-item-details">
                                        <h3 className="cart-item-name">{item.product.name}</h3>
                                        <p className="cart-item-price">{formatPrice(item.product.price)}</p>
                                    </div>

                                    <div className="quantity-controls">
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <span className="quantity-value">{item.quantity}</span>
                                        <button
                                            className="quantity-btn"
                                            onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item-total">
                                        {formatPrice(item.product.price * item.quantity)}
                                    </div>

                                    <button
                                        className="remove-btn"
                                        onClick={() => handleRemove(item.product._id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Subtotal and total are calculated from shared cart contents. */}
                        <div className="cart-summary">
                            <h2>Order Summary</h2>

                            <div className="summary-row">
                                <span>Subtotal</span>
                                <span>{formatPrice(calculateTotal())}</span>
                            </div>

                            <div className="summary-row">
                                <span>Shipping</span>
                                <span>{formatPrice(0)}</span>
                            </div>

                            <div className="summary-row total">
                                <span>Total</span>
                                <span>{formatPrice(calculateTotal())}</span>
                            </div>

                            <button className="btn btn-primary btn-full" onClick={handleCheckout}>
                                Proceed to Checkout
                            </button>

                            <div className="payment-methods">
                                <span>💳</span>
                                <span>💰</span>
                                <span>🔒</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
