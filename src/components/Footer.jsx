import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__grid">
                <div>
                    <div className="footer__brand-text">
                        Court<span>Vista</span>
                    </div>
                    <p className="footer__description">
                        India's trusted platform for discovering verified legal professionals.
                        Find, compare, and connect with the right lawyer for your needs.
                    </p>
                </div>

                <div>
                    <h4 className="footer__heading">Platform</h4>
                    <ul className="footer__list">
                        <li><Link to="/search">Find a Lawyer</Link></li>
                        <li><Link to="/compare">Compare Lawyers</Link></li>
                        <li><Link to="/qna">Legal Q&A</Link></li>
                        <li><a href="#how-it-works">How It Works</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="footer__heading">Practice Areas</h4>
                    <ul className="footer__list">
                        <li><Link to="/search?area=criminal">Criminal Defense</Link></li>
                        <li><Link to="/search?area=family">Family Law</Link></li>
                        <li><Link to="/search?area=corporate">Corporate Law</Link></li>
                        <li><Link to="/search?area=property">Property Law</Link></li>
                        <li><Link to="/search?area=tax">Tax Law</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="footer__heading">Company</h4>
                    <ul className="footer__list">
                        <li><a href="#about">About Us</a></li>
                        <li><a href="#contact">Contact</a></li>
                        <li><a href="#privacy">Privacy Policy</a></li>
                        <li><a href="#terms">Terms of Service</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer__bottom">
                <span>© 2026 CourtVista. All rights reserved.</span>
                <span>Made with care for better access to justice</span>
            </div>
        </footer>
    );
}
