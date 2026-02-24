import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { lawyers, practiceAreas, getInitials, getRatingColor } from '../data/lawyers';
import './Dashboard.css';

function getStoredConsultations() {
    try {
        return JSON.parse(localStorage.getItem('courtvista_consultations')) || [];
    } catch {
        return [];
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '—';
    try {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
}

function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

function getStatusSummary(consultations) {
    const pending = consultations.filter((c) => c.status === 'pending').length;
    const confirmed = consultations.filter((c) => c.status === 'confirmed').length;
    if (confirmed > 0 && pending > 0) return `You have ${confirmed} confirmed and ${pending} pending consultation${pending > 1 ? 's' : ''}`;
    if (confirmed > 0) return `You have ${confirmed} confirmed consultation${confirmed > 1 ? 's' : ''}`;
    if (pending > 0) return `You have ${pending} pending consultation${pending > 1 ? 's' : ''}`;
    return 'Find and connect with the right legal professional';
}

const TAB_FILTERS = ['all', 'pending', 'confirmed', 'declined'];

export default function UserDashboard() {
    const { user } = useAuth();
    const [consultations] = useState(getStoredConsultations);
    const [activeTab, setActiveTab] = useState('all');

    const myConsultations = useMemo(() =>
        consultations.filter((c) => {
            if (c.clientUserId && c.clientUserId === user?.id) return true;
            return c.clientEmail?.toLowerCase() === user?.email?.toLowerCase();
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        [consultations, user]
    );

    const pending = myConsultations.filter((c) => c.status === 'pending');
    const confirmed = myConsultations.filter((c) => c.status === 'confirmed');
    const declined = myConsultations.filter((c) => c.status === 'declined');

    const filteredConsultations = activeTab === 'all'
        ? myConsultations
        : myConsultations.filter((c) => c.status === activeTab);

    // Upcoming: nearest confirmed consultation
    const upcomingConsultation = confirmed
        .filter((c) => c.date && new Date(c.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

    // Recommended lawyers (top 3 by rating that user hasn't booked)
    const bookedLawyerIds = new Set(myConsultations.map((c) => c.lawyerId));
    const recommendedLawyers = [...lawyers]
        .filter((l) => !bookedLawyerIds.has(l.id))
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3);

    const tabCounts = {
        all: myConsultations.length,
        pending: pending.length,
        confirmed: confirmed.length,
        declined: declined.length,
    };

    return (
        <div className="dashboard dashboard--user container animate-fade-in-up">
            {/* ─── Welcome Banner ─── */}
            <div className="user-banner">
                <div className="user-banner__content">
                    <div className="user-banner__greeting">{getGreeting()},</div>
                    <h1 className="user-banner__name">{user?.name}</h1>
                    <p className="user-banner__status">{getStatusSummary(myConsultations)}</p>
                </div>
                <div className="user-banner__actions">
                    <Link to="/search" className="btn btn--gold">
                        🔍 Find a Lawyer
                    </Link>
                </div>
            </div>

            {/* ─── Stats ─── */}
            <div className="dashboard__stats">
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon">📅</div>
                    <div className="dashboard__stat-number">{myConsultations.length}</div>
                    <div className="dashboard__stat-label">Total Consultations</div>
                </div>
                <div className="dashboard__stat-card dashboard__stat-card--pending">
                    <div className="dashboard__stat-icon">🕐</div>
                    <div className="dashboard__stat-number">{pending.length}</div>
                    <div className="dashboard__stat-label">Awaiting Response</div>
                </div>
                <div className="dashboard__stat-card dashboard__stat-card--confirmed">
                    <div className="dashboard__stat-icon">✅</div>
                    <div className="dashboard__stat-number">{confirmed.length}</div>
                    <div className="dashboard__stat-label">Confirmed</div>
                </div>
                <div className="dashboard__stat-card dashboard__stat-card--declined">
                    <div className="dashboard__stat-icon">↩️</div>
                    <div className="dashboard__stat-number">{declined.length}</div>
                    <div className="dashboard__stat-label">Declined</div>
                </div>
            </div>

            {/* ─── Upcoming Appointment Spotlight ─── */}
            {upcomingConsultation && (
                <div className="spotlight-card">
                    <div className="spotlight-card__badge">🗓️ Upcoming Appointment</div>
                    <div className="spotlight-card__content">
                        <div className="spotlight-card__lawyer">
                            <div className="spotlight-card__avatar">⚖️</div>
                            <div>
                                <div className="spotlight-card__name">{upcomingConsultation.lawyerName}</div>
                                <div className="spotlight-card__meta">
                                    {upcomingConsultation.caseTypeName || 'Consultation'}
                                </div>
                            </div>
                        </div>
                        <div className="spotlight-card__schedule">
                            <div className="spotlight-card__date">
                                <span className="spotlight-card__label">Date</span>
                                <span className="spotlight-card__value">{formatDate(upcomingConsultation.date)}</span>
                            </div>
                            {upcomingConsultation.time && (
                                <div className="spotlight-card__time">
                                    <span className="spotlight-card__label">Time</span>
                                    <span className="spotlight-card__value">{upcomingConsultation.time}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── My Consultations (Tabbed) ─── */}
            <div className="dashboard__section">
                <h2 className="dashboard__section-title">
                    📋 My Consultations
                </h2>

                <div className="dashboard__tabs">
                    {TAB_FILTERS.map((tab) => (
                        <button
                            key={tab}
                            className={`dashboard__tab ${activeTab === tab ? 'dashboard__tab--active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            {tabCounts[tab] > 0 && (
                                <span className="dashboard__tab-count">{tabCounts[tab]}</span>
                            )}
                        </button>
                    ))}
                </div>

                {filteredConsultations.length === 0 ? (
                    <div className="dashboard__empty-state">
                        <div className="dashboard__empty-icon">
                            {activeTab === 'all' ? '📭' : activeTab === 'pending' ? '🕐' : activeTab === 'confirmed' ? '✅' : '↩️'}
                        </div>
                        <h3 className="dashboard__empty-title">
                            {activeTab === 'all' ? 'No consultations yet' : `No ${activeTab} consultations`}
                        </h3>
                        <p className="dashboard__empty-text">
                            {activeTab === 'all'
                                ? 'Book your first consultation with a lawyer to get started.'
                                : `You don't have any ${activeTab} consultations right now.`}
                        </p>
                        {activeTab === 'all' && (
                            <Link to="/search" className="btn btn--gold" style={{ marginTop: '1rem' }}>
                                Find a Lawyer
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="dashboard__consultation-list">
                        {filteredConsultations.map((c) => {
                            const lawyerData = lawyers.find((l) => l.id === c.lawyerId);
                            const specs = lawyerData
                                ? lawyerData.specializations
                                    .map((s) => practiceAreas.find((pa) => pa.id === s)?.name)
                                    .filter(Boolean)
                                    .join(' · ')
                                : '';

                            return (
                                <div key={c.id} className={`dashboard__consultation-item dashboard__consultation-item--${c.status}`}>
                                    <div className="dashboard__consultation-header">
                                        <div className="dashboard__consultation-client">
                                            <div className="dashboard__consultation-avatar dashboard__consultation-avatar--lawyer">
                                                {lawyerData ? getInitials(lawyerData.name) : '⚖️'}
                                            </div>
                                            <div>
                                                <div className="dashboard__consultation-name">{c.lawyerName}</div>
                                                {specs && (
                                                    <div className="dashboard__consultation-email">{specs}</div>
                                                )}
                                            </div>
                                        </div>
                                        <span className={`dashboard__status-badge dashboard__status-badge--${c.status}`}>
                                            {c.status === 'pending' && '🕐 '}
                                            {c.status === 'confirmed' && '✅ '}
                                            {c.status === 'declined' && '❌ '}
                                            {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                                        </span>
                                    </div>

                                    <div className="dashboard__consultation-details">
                                        {c.caseTypeName && (
                                            <div className="dashboard__consultation-detail">
                                                <span className="dashboard__detail-label">Case Type</span>
                                                <span className="dashboard__detail-value">{c.caseTypeName}</span>
                                            </div>
                                        )}
                                        {c.date && (
                                            <div className="dashboard__consultation-detail">
                                                <span className="dashboard__detail-label">Date</span>
                                                <span className="dashboard__detail-value">{formatDate(c.date)}</span>
                                            </div>
                                        )}
                                        {c.time && (
                                            <div className="dashboard__consultation-detail">
                                                <span className="dashboard__detail-label">Time</span>
                                                <span className="dashboard__detail-value">{c.time}</span>
                                            </div>
                                        )}
                                        <div className="dashboard__consultation-detail">
                                            <span className="dashboard__detail-label">Booked</span>
                                            <span className="dashboard__detail-value">{formatDate(c.createdAt)}</span>
                                        </div>
                                    </div>

                                    {(lawyerData || c.status === 'confirmed') && (
                                        <div className="dashboard__consultation-actions">
                                            {lawyerData && (
                                                <Link to={`/lawyer/${lawyerData.id}`} className="btn btn--outline btn--sm">
                                                    View Lawyer Profile
                                                </Link>
                                            )}
                                            {c.status === 'confirmed' && (
                                                <Link to={`/messages/${c.id}`} className="btn btn--gold btn--sm">
                                                    💬 Message Lawyer
                                                </Link>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ─── Recommended Lawyers ─── */}
            {recommendedLawyers.length > 0 && (
                <div className="dashboard__section">
                    <h2 className="dashboard__section-title">
                        ⭐ Recommended for You
                    </h2>
                    <div className="recommended-grid">
                        {recommendedLawyers.map((lawyer) => {
                            const specs = lawyer.specializations
                                .map((s) => practiceAreas.find((pa) => pa.id === s)?.name)
                                .filter(Boolean);
                            return (
                                <Link key={lawyer.id} to={`/lawyer/${lawyer.id}`} className="recommended-card">
                                    <div className="recommended-card__avatar">
                                        {getInitials(lawyer.name)}
                                    </div>
                                    <div className="recommended-card__info">
                                        <div className="recommended-card__name">{lawyer.name}</div>
                                        <div className="recommended-card__specs">{specs.join(' · ')}</div>
                                        <div className="recommended-card__meta">
                                            <span
                                                className="recommended-card__rating"
                                                style={{ color: getRatingColor(lawyer.rating) }}
                                            >
                                                ★ {lawyer.rating}
                                            </span>
                                            <span className="recommended-card__exp">{lawyer.experience}y exp</span>
                                            <span className="recommended-card__city">{lawyer.city}</span>
                                        </div>
                                    </div>
                                    <div className="recommended-card__fee">{lawyer.feesRange}</div>
                                </Link>
                            );
                        })}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
                        <Link to="/search" className="btn btn--outline btn--sm">View All Lawyers →</Link>
                    </div>
                </div>
            )}

            {/* ─── Quick Actions ─── */}
            <div className="dashboard__section">
                <h2 className="dashboard__section-title">Quick Actions</h2>
                <div className="dashboard__actions-grid">
                    <Link to="/profile/edit" className="dashboard__action-card">
                        <span className="dashboard__action-icon">✏️</span>
                        <span className="dashboard__action-label">Edit Profile</span>
                        <span className="dashboard__action-desc">Update your personal info</span>
                    </Link>
                    <Link to="/search" className="dashboard__action-card">
                        <span className="dashboard__action-icon">🔍</span>
                        <span className="dashboard__action-label">Find a Lawyer</span>
                        <span className="dashboard__action-desc">Search by specialization & location</span>
                    </Link>
                    <Link to="/messages" className="dashboard__action-card">
                        <span className="dashboard__action-icon">💬</span>
                        <span className="dashboard__action-label">Messages</span>
                        <span className="dashboard__action-desc">Chat with your lawyers</span>
                    </Link>
                    <Link to="/compare" className="dashboard__action-card">
                        <span className="dashboard__action-icon">📊</span>
                        <span className="dashboard__action-label">Compare Lawyers</span>
                        <span className="dashboard__action-desc">Side-by-side comparison</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
