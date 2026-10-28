
// Alternate catalog page that filters the fetched product list by URL search/category values.
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "../styles/Product.css"

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const searchTerm = (searchParams.get("search") || "")
    .trim()
    .toLowerCase();

  const categoryTerm = (
    searchParams.get("category") || ""
  )
    .trim()
    .toLowerCase();

  useEffect(() => {
    // Load the product catalog once; text and category filtering happen locally below.
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/products");
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

  const filteredProducts = products.filter((product) => {
    // Match the query against product text and compare category case-insensitively.
    const searchableText = [
      product.name,
      product.description,
      product.category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);

    const matchesCategory =
      !categoryTerm ||
      (product.category || "").trim().toLowerCase() ===
        categoryTerm;

    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <main className="page-container">
        <h1>Our Products</h1>
        <p>Loading products...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <h1>Our Products</h1>
        <p role="alert">{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="products-heading">
        <div>
          <p>DISCOVER SHOPEASE</p>
          <h1>
            {categoryTerm
              ? `Shop ${categoryTerm}`
              : "Explore Our Products"}
          </h1>
          <p>
            {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {(searchTerm || categoryTerm) && (
          <Link to="/products" className="primary-link">
            Clear filters
          </Link>
        )}
      </div>

      {/* Provide an empty-state message or render the filtered product cards. */}
      {filteredProducts.length === 0 ? (
        <section className="products-empty">
          <h2>No products found</h2>
          <p>
            Try another search or explore our full collection.
          </p>
          <Link to="/products" className="primary-link">
            View all products
          </Link>
        </section>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <article
              className="product-card"
              key={product._id}
            >
              <Link
                to={`/products/${product._id}`}
                className="product-card-image"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                />
              </Link>

              <div className="product-card-content">
                <p className="product-card-category">
                  {product.category}
                </p>

                <h2>
                  <Link to={`/products/${product._id}`}>
                    {product.name}
                  </Link>
                </h2>

                <p className="product-card-description">
                  {product.description}
                </p>

                <div className="product-card-bottom">
                  <strong>
                    ₹{Number(product.price).toLocaleString("en-IN")}
                  </strong>

                  <Link
                    to={`/products/${product._id}`}
                    className="primary-link"
                  >
                    View Details
                  </Link>
                </div>

                <p className="product-stock">
                  {product.stock > 0
                    ? "In stock"
                    : "Out of stock"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
