// Reviews landing page displaying products that have review ratings in the catalog.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import '../styles/Reviews.css';

const Reviews = () => {
    const [ratedProducts, setRatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Load rated products and omit items without any submitted ratings.
        const fetchRatedProducts = async () => {
            try {
                const response = await productsAPI.getAll({ limit: 100 });
                const products = response.data.products || [];
                setRatedProducts(
                    products.filter((product) => product.ratings?.count > 0)
                );
            } catch (requestError) {
                setError(
                    requestError.response?.data?.message ||
                    'Product ratings are unavailable right now.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchRatedProducts();
    }, []);

    return (
        <main className="reviews-page">
            <section className="reviews-hero">
                <span className="reviews-eyebrow">SHOP WITH CONFIDENCE</span>
                <h1>Customer Reviews</h1>
                <p>
                    See what shoppers think about products in our collection.
                    Ratings shown here come from product review data.
                </p>
                <Link to="/products" className="reviews-button">
                    Explore products <span aria-hidden="true">→</span>
                </Link>
            </section>

            {/* Render loading, error, rated-product, or no-ratings content. */}
            <section className="reviews-content" aria-labelledby="reviews-list-heading">
                <div className="reviews-section-heading">
                    <div>
                        <span className="reviews-eyebrow">REAL PRODUCT RATINGS</span>
                        <h2 id="reviews-list-heading">Ratings from our collection</h2>
                    </div>
                    {!loading && !error && ratedProducts.length > 0 && (
                        <span className="reviews-count">
                            {ratedProducts.length} rated {ratedProducts.length === 1 ? 'product' : 'products'}
                        </span>
                    )}
                </div>

                {loading ? (
                    <p className="reviews-message">Loading product ratings...</p>
                ) : error ? (
                    <p className="reviews-message reviews-error">{error}</p>
                ) : ratedProducts.length > 0 ? (
                    <div className="reviews-grid">
                        {/* Each card links shoppers to the product associated with its rating. */}
                        {ratedProducts.map((product) => (
                            <article className="review-product-card" key={product._id}>
                                <Link to={`/products/${product._id}`} className="review-product-image">
                                    <img src={product.image} alt={product.name} loading="lazy" />
                                </Link>
                                <div className="review-product-info">
                                    <span className="review-product-category">{product.category}</span>
                                    <h3>
                                        <Link to={`/products/${product._id}`}>{product.name}</Link>
                                    </h3>
                                    <div
                                        className="review-rating"
                                        aria-label={`${product.ratings.average} out of 5 stars, ${product.ratings.count} ratings`}
                                    >
                                        <span aria-hidden="true">
                                            {'★'.repeat(Math.round(product.ratings.average))}
                                            {'☆'.repeat(5 - Math.round(product.ratings.average))}
                                        </span>
                                        <strong>{Number(product.ratings.average).toFixed(1)}</strong>
                                        <span className="review-rating-count">
                                            ({product.ratings.count} {product.ratings.count === 1 ? 'rating' : 'ratings'})
                                        </span>
                                    </div>
                                    <Link to={`/products/${product._id}`} className="review-view-link">
                                        View product →
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="reviews-empty">
                        <span className="reviews-empty-stars" aria-hidden="true">☆ ☆ ☆ ☆ ☆</span>
                        <h3>No product ratings yet</h3>
                        <p>
                            Ratings will appear here when customers have reviewed products.
                            Browse the collection to find something you love.
                        </p>
                        <Link to="/products" className="reviews-button">
                            Browse all products <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
};

export default Reviews;
