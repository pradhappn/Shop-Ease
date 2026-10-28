// Responsive site header with route navigation, product search, and account actions.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const handleSearch = (event) => {
        // Sends the search query to the product listing through its URL parameters.
        event.preventDefault();

        const query = search.trim();

        navigate(
            query
                ? `/products?search=${encodeURIComponent(query)}`
                : "/products"
        );

        setMenuOpen(false);
    };

    const closeMenu = () => setMenuOpen(false);

    const handleLogout = () => {
        // Ends the session, closes the mobile menu, and returns to the home page.
        logout();
        closeMenu();
        navigate("/");
    };

    return (
        <header className="store-header">
            <nav className="store-navbar" aria-label="Main navigation">
                <Link to="/" className="store-logo" onClick={closeMenu}>
                    Shop<span>Ease</span>
                    <span className="logo-dot">.</span>
                </Link>

                <button
                    type="button"
                    className="mobile-menu-toggle"
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? "✕" : "☰"}
                </button>

                {/* Collapsible navigation, search, and account links for desktop and mobile. */}
                <div className={`navbar-content ${menuOpen ? "menu-open" : ""}`}>
                    <div className="navbar-links">
                        <Link to="/" onClick={closeMenu}>Home</Link>
                        <Link to="/products" onClick={closeMenu}>Products</Link>
                        <Link to="/testimonials" onClick={closeMenu}>Reviews</Link>
                    </div>

                    <form className="navbar-search" onSubmit={handleSearch} role="search">
                        <span aria-hidden="true">⌕</span>
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search products..."
                            aria-label="Search products"
                            maxLength={100}
                        />
                        <button type="submit">Search</button>
                    </form>

                    <div className="navbar-account">
                        {user ? (
                            <>
                                <Link to="/profile" className="account-link" onClick={closeMenu}>
                                    My Profile
                                </Link>
                                <button
                                    type="button"
                                    className="logout-button"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="account-link" onClick={closeMenu}>
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="register-link"
                                    onClick={closeMenu}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}
