// Shared storefront footer with brand information and links to the main public pages.
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="store-footer">
            {/* Brand summary and secondary navigation. */}
            <div className="store-footer-content">
                <div className="store-footer-brand">
                    <Link to="/" className="store-footer-logo">
                        Shop<span>Ease</span>.
                    </Link>
                    <p>Discover products for your everyday life, all in one place.</p>
                </div>

                <nav className="store-footer-links" aria-label="Footer navigation">
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/testimonials">Reviews</Link>
                </nav>
            </div>

            {/* Uses the current year so the copyright stays up to date. */}
            <div className="store-footer-bottom">
                <p>© {new Date().getFullYear()} ShopEase. All rights reserved.</p>
            </div>
        </footer>
    );
}
