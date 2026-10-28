
// Storefront landing page: loads products and presents categories, featured items, and shopping links.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { formatPrice } from "../utils/currency";
import "../styles/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch current catalog data for the category and featured-product sections.
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products", { params: { limit: 100 } });
        setProducts(response.data.products || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Unable to load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Categories are generated from real database products.
  const categories = [
    ...new Set(
      products
        .map((product) => product.category?.trim())
        .filter(Boolean)
    ),
  ].slice(0, 6);

  // The current catalog is also the source for the home-page featured collection.
  const featuredProducts = products;

  return (
    <main className="home-page">
      {/* Hero introduces the store and directs shoppers to the catalog. */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-eyebrow">
            WELCOME TO SHOPEASE
          </span>

          <h1>
            Find what you love.
            <br />
            <span>Shop with ease.</span>
          </h1>

          <p>
            Discover products for your everyday life,
            all in one place.
          </p>

          <Link to="/products" className="home-button">
            Shop Now <span aria-hidden="true">→</span>
          </Link>

          <div className="hero-note">
            <span>✦</span> Discover something new today
          </div>
        </div>

        <div className="hero-decoration" aria-hidden="true">
          <div className="hero-circle hero-circle-one" />
          <div className="hero-circle hero-circle-two" />
          <div className="hero-shopping-bag">S</div>
          <span className="hero-sparkle sparkle-one">✦</span>
          <span className="hero-sparkle sparkle-two">✧</span>
        </div>
      </section>

      {/* Brief benefits explain the intended shopping experience. */}
      <section className="home-benefits">
        <div>
          <span className="benefit-icon">◇</span>
          <div>
            <strong>Easy browsing</strong>
            <p>Explore our collection</p>
          </div>
        </div>

        <div>
          <span className="benefit-icon">♡</span>
          <div>
            <strong>Find your favorites</strong>
            <p>Products for your needs</p>
          </div>
        </div>

        <div>
          <span className="benefit-icon">↗</span>
          <div>
            <strong>Simple shopping</strong>
            <p>Browse with confidence</p>
          </div>
        </div>
      </section>

      {/* Product-derived categories link to the full catalog. */}
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">EXPLORE</span>
            <h2>Shop by category</h2>
            <p>Find something that fits your style.</p>
          </div>

          <Link to="/products" className="text-link">
            All products →
          </Link>
        </div>

        {loading ? (
          <p className="home-message">Loading categories...</p>
        ) : categories.length > 0 ? (
          <div className="category-grid">
            {categories.map((category, index) => (
              <Link
                to="/products"
                className={`category-card category-${index % 4}`}
                key={category}
              >
                <span className="category-number">
                  0{index + 1}
                </span>
                <h3>{category}</h3>
                <span className="category-arrow">↗</span>
              </Link>
            ))}
          </div>
        ) : (
          <p className="home-message">
            Categories will appear when products are available.
          </p>
        )}
      </section>

      {/* Featured product cards expose prices, stock status, and detail links. */}
      <section className="home-section featured-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">OUR COLLECTION</span>
            <h2>Discover our products</h2>
            <p>Explore the latest additions to ShopEase.</p>
          </div>

          <Link to="/products" className="text-link">
            View all →
          </Link>
        </div>

        {loading ? (
          <p className="home-message">Loading products...</p>
        ) : error ? (
          <div className="home-error">
            <p>{error}</p>
            <button
              className="home-button"
              onClick={() => window.location.reload()}
            >
              Try again
            </button>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="featured-grid">
            {featuredProducts.map((product) => (
              <article className="featured-card" key={product._id}>
                <Link
                  to={`/products/${product._id}`}
                  className="featured-image"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                  <span className="image-view-label">
                    View product ↗
                  </span>
                </Link>

                <div className="featured-info">
                  <span className="product-category">
                    {product.category}
                  </span>

                  <Link
                    to={`/products/${product._id}`}
                    className="product-name-link"
                  >
                    <h3>{product.name}</h3>
                  </Link>

                  <div className="featured-bottom">
                    <strong>{formatPrice(product.price)}</strong>

                    <Link
                      to={`/products/${product._id}`}
                      className="product-arrow"
                      aria-label={`View ${product.name}`}
                    >
                      →
                    </Link>
                  </div>

                  <p className={
                    product.stock > 0
                      ? "stock-label"
                      : "stock-label out-of-stock"
                  }>
                    {product.stock > 0
                      ? "In stock"
                      : "Currently unavailable"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="home-empty">
            <span>◇</span>
            <h3>Your next favorite is waiting</h3>
            <p>Products will appear here once added to ShopEase.</p>
          </div>
        )}

        <div className="center-action">
          <Link to="/products" className="home-button">
            Explore All Products →
          </Link>
        </div>
      </section>

      {/* Promotional banner offers another path into the product catalog. */}
      <section className="home-promo">
        <div className="promo-content">
          <span className="section-eyebrow">YOUR NEXT FIND</span>
          <h2>Good finds.
            <br />
            Simple shopping.
          </h2>
          <p>
            Take a look through our collection and discover
            something that belongs in your everyday life.
          </p>
          <Link to="/products" className="promo-button">
            Start Exploring →
          </Link>
        </div>

        <div className="promo-art" aria-hidden="true">
          <div className="promo-ring" />
          <div className="promo-card promo-card-back">S</div>
          <div className="promo-card promo-card-front">
            <span>SHOPEASE</span>
            <strong>Find<br />your thing.</strong>
            <span className="promo-star">✦</span>
          </div>
        </div>
      </section>

      {/* Closing call to action gives shoppers a final route to browse products. */}
      <section className="home-bottom-cta">
        <div>
          <h2>Ready to find something you love?</h2>
          <p>Your next discovery is just a click away.</p>
        </div>
        <Link to="/products" className="home-button">
          Shop Now →
        </Link>
      </section>
    </main>
  );
}
