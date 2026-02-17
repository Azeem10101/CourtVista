import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, getDashboardPath } = useAuth();

    const links = [
        { to: '/', label: 'Home' },
        { to: '/search', label: 'Find a Lawyer' },
        { to: '/compare', label: 'Compare' },
        { to: '/qna', label: 'Legal Q&A' },
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <Link to="/" className="navbar__brand">
                    <div className="navbar__logo">CV</div>
                    <span className="navbar__brand-text">
                        Court<span>Vista</span>
                    </span>
                </Link>

                <div className="navbar__links">
                    {links.map((link) => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`navbar__link ${isActive(link.to) ? 'navbar__link--active' : ''}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                <div className="navbar__actions">
                    {user ? (
                        <>
                            <Link
                                to={getDashboardPath()}
                                className="navbar__user-btn"
                            >
                                <span className="navbar__user-avatar">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                                <span className="navbar__user-name">{user.name}</span>
                            </Link>
                            <button onClick={handleLogout} className="btn btn--outline btn--sm">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn--outline btn--sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn btn--gold btn--sm">
                                Register
                            </Link>
                        </>
                    )}
                    <button
                        className={`navbar__hamburger ${mobileOpen ? 'navbar__hamburger--open' : ''}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label="Toggle menu"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </div>

            <div className={`navbar__mobile-menu ${mobileOpen ? 'navbar__mobile-menu--open' : ''}`}>
                {links.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`navbar__link ${isActive(link.to) ? 'navbar__link--active' : ''}`}
                        onClick={() => setMobileOpen(false)}
                    >
                        {link.label}
                    </Link>
                ))}
                {user ? (
                    <>
                        <Link
                            to={getDashboardPath()}
                            className="navbar__link"
                            onClick={() => setMobileOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="btn btn--outline btn--lg"
                            style={{ marginTop: 'var(--space-4)' }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="navbar__link"
                            onClick={() => setMobileOpen(false)}
                        >
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="btn btn--gold btn--lg"
                            style={{ marginTop: 'var(--space-4)' }}
                            onClick={() => setMobileOpen(false)}
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
