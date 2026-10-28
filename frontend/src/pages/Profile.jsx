// Account profile page showing signed-in user details, shopping links, and logout.
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        // End the session and return to the public storefront.
        logout();
        navigate('/');
    };

    return (
        <main className="profile-page">
            <div className="container profile-container">
                <div className="profile-heading">
                    <span className="profile-eyebrow">YOUR ACCOUNT</span>
                    <h1>My Profile</h1>
                    <p>View your account details and continue shopping.</p>
                </div>

                {/* Identity summary and account metadata come from auth context. */}
                <section className="profile-card profile-user-card" aria-labelledby="profile-user-name">
                    <div className="profile-avatar" aria-hidden="true">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 id="profile-user-name">{user?.name || 'ShopEase customer'}</h2>
                        <p>{user?.email}</p>
                    </div>
                </section>

                <section className="profile-card" aria-labelledby="profile-details-heading">
                    <div className="profile-card-heading">
                        <h2 id="profile-details-heading">Personal information</h2>
                        <span>Account details</span>
                    </div>
                    <dl className="profile-details">
                        <div className="profile-info-row">
                            <dt>Name</dt>
                            <dd>{user?.name || 'Not provided'}</dd>
                        </div>
                        <div className="profile-info-row">
                            <dt>Email address</dt>
                            <dd>{user?.email || 'Not provided'}</dd>
                        </div>
                        <div className="profile-info-row">
                            <dt>Account type</dt>
                            <dd>{user?.role === 'admin' ? 'Administrator' : 'Customer'}</dd>
                        </div>
                    </dl>
                </section>

                {/* Shortcuts let customers return to shopping or inspect their cart. */}
                <section className="profile-card" aria-labelledby="profile-actions-heading">
                    <div className="profile-card-heading">
                        <h2 id="profile-actions-heading">Quick links</h2>
                        <span>Manage your shopping</span>
                    </div>
                    <div className="profile-account-actions">
                        <Link to="/cart" className="profile-action-btn">
                            View my cart <span aria-hidden="true">→</span>
                        </Link>
                        <Link to="/products" className="profile-action-btn">
                            Browse products <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </section>

                <button type="button" className="profile-logout" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </main>
    );
};

export default Profile;
