import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

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
                    <Link to="/search" className="btn btn--gold btn--sm">
                        Get Started
                    </Link>
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
                <Link
                    to="/search"
                    className="btn btn--gold btn--lg"
                    style={{ marginTop: 'var(--space-4)' }}
                    onClick={() => setMobileOpen(false)}
                >
                    Get Started
                </Link>
            </div>
        </nav>
    );
}
