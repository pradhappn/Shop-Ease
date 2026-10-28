// Product detail page: fetches one item and supports add-to-cart and buy-now actions.
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { productsAPI } from "../services/api";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);

  useEffect(() => {
    // Reload the selected product whenever the route's product ID changes.
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await productsAPI.getById(id);

        setProduct(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
          "Unable to load this product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handlePurchase = async (buyNow) => {
    // Return signed-out shoppers to this page after login; otherwise update cart
    // and either confirm the add or proceed directly to checkout.
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    setActionError("");
    setActionMessage("");
    if (buyNow) {
      setBuyingNow(true);
    } else {
      setAddingToCart(true);
    }

    const result = await addToCart(product._id);
    if (!result.success) {
      setActionError(result.message);
    } else if (buyNow) {
      navigate("/checkout");
    } else {
      setActionMessage("Added to your cart.");
    }

    setAddingToCart(false);
    setBuyingNow(false);
  };

  if (loading) {
    // Keep the page layout simple while product data is being fetched.
    return (
      <main className="product-details-page">
        <p>Loading product...</p>
      </main>
    );
  }

  if (error) {
    // Show a recoverable error with a link back to the product catalog.
    return (
      <main className="product-details-page">
        <p className="error-message">{error}</p>

        <Link to="/products">
          Back to Products
        </Link>
      </main>
    );
  }

  if (!product) {
    // Handle an empty API response separately from request failures.
    return (
      <main className="product-details-page">
        <p>Product not found.</p>

        <Link to="/products">
          Back to Products
        </Link>
      </main>
    );
  }

  return (
    <main className="product-details-page">
      <Link to="/products" className="product-details-back">
        ← Back to Products
      </Link>

      <section className="product-details">
        {/* Product image and details are kept together for responsive layout. */}
        <div className="product-details-image">
          <img
            src={product.image}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.style.visibility = "hidden";
            }}
          />
        </div>

        <div className="product-details-content">
          <p className="product-details-category">{product.category}</p>

          <h1>{product.name}</h1>

          <h2 className="product-details-description-heading">Description</h2>
          <p className="product-details-description">{product.description}</p>

          <p className="product-details-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </p>

          <p className={product.stock > 0 ? "product-details-stock" : "product-details-stock out-of-stock"}>
            {product.stock > 0
              ? `${product.stock} available`
              : "Out of stock"}
          </p>

          {actionError && <p className="product-action-error" role="alert">{actionError}</p>}
          {actionMessage && <p className="product-action-success" role="status">{actionMessage}</p>}

          {/* Disable purchase actions when sold out or a request is in progress. */}
          <div className="product-details-actions">
            <button
              type="button"
              className="product-details-cart-button"
              onClick={() => handlePurchase(false)}
              disabled={product.stock <= 0 || addingToCart || buyingNow}
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
            <button
              type="button"
              className="product-details-buy-button"
              onClick={() => handlePurchase(true)}
              disabled={product.stock <= 0 || addingToCart || buyingNow}
            >
              {buyingNow ? "Continuing..." : "Buy Now"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}