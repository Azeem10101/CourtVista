import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function UserDashboard() {
    const { user } = useAuth();

    return (
        <div className="dashboard container">
            <div className="dashboard__header">
                <div className="dashboard__welcome">Welcome back</div>
                <h1 className="dashboard__title">{user?.name}</h1>
                <span className="dashboard__role-badge dashboard__role-badge--user">User</span>
            </div>

            <div className="dashboard__stats">
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon">🔍</div>
                    <div className="dashboard__stat-number">0</div>
                    <div className="dashboard__stat-label">Searches Made</div>
                </div>
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon">📅</div>
                    <div className="dashboard__stat-number">0</div>
                    <div className="dashboard__stat-label">Consultations Booked</div>
                </div>
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon">⭐</div>
                    <div className="dashboard__stat-number">0</div>
                    <div className="dashboard__stat-label">Reviews Written</div>
                </div>
            </div>

            <div className="dashboard__section">
                <h2 className="dashboard__section-title">Quick Actions</h2>
                <div className="dashboard__actions-grid">
                    <Link to="/search" className="dashboard__action-card">
                        <span className="dashboard__action-icon">🔍</span>
                        <span className="dashboard__action-label">Find a Lawyer</span>
                        <span className="dashboard__action-desc">Search by specialization & location</span>
                    </Link>
                    <Link to="/compare" className="dashboard__action-card">
                        <span className="dashboard__action-icon">📊</span>
                        <span className="dashboard__action-label">Compare Lawyers</span>
                        <span className="dashboard__action-desc">Side-by-side comparison</span>
                    </Link>
                    <Link to="/qna" className="dashboard__action-card">
                        <span className="dashboard__action-icon">❓</span>
                        <span className="dashboard__action-label">Ask a Question</span>
                        <span className="dashboard__action-desc">Get help from legal experts</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
