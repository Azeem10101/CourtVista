import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

export default function LawyerDashboard() {
    const { user } = useAuth();

    return (
        <div className="dashboard container">
            <div className="dashboard__header">
                <div className="dashboard__welcome">Lawyer Portal</div>
                <h1 className="dashboard__title">{user?.name}</h1>
                <span className="dashboard__role-badge dashboard__role-badge--lawyer">Lawyer</span>
            </div>

            <div className="dashboard__stats">
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon">📁</div>
                    <div className="dashboard__stat-number">0</div>
                    <div className="dashboard__stat-label">Active Cases</div>
                </div>
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon">📅</div>
                    <div className="dashboard__stat-number">0</div>
                    <div className="dashboard__stat-label">Upcoming Consultations</div>
                </div>
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon">⭐</div>
                    <div className="dashboard__stat-number">0</div>
                    <div className="dashboard__stat-label">Client Reviews</div>
                </div>
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon">💬</div>
                    <div className="dashboard__stat-number">0</div>
                    <div className="dashboard__stat-label">Q&A Answers</div>
                </div>
            </div>

            <div className="dashboard__section">
                <h2 className="dashboard__section-title">Quick Actions</h2>
                <div className="dashboard__actions-grid">
                    <Link to="/search" className="dashboard__action-card">
                        <span className="dashboard__action-icon">👤</span>
                        <span className="dashboard__action-label">My Profile</span>
                        <span className="dashboard__action-desc">View your public profile</span>
                    </Link>
                    <Link to="/qna" className="dashboard__action-card">
                        <span className="dashboard__action-icon">💬</span>
                        <span className="dashboard__action-label">Answer Questions</span>
                        <span className="dashboard__action-desc">Help users with legal queries</span>
                    </Link>
                    <Link to="/" className="dashboard__action-card">
                        <span className="dashboard__action-icon">📈</span>
                        <span className="dashboard__action-label">View Platform</span>
                        <span className="dashboard__action-desc">See how users find you</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
