import { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { lawyers, practiceAreas, getInitials, qnaData } from '../data/lawyers';
import './Dashboard.css';

function getStoredConsultations() {
    try {
        return JSON.parse(localStorage.getItem('courtvista_consultations')) || [];
    } catch {
        return [];
    }
}

function updateConsultationStatus(consultationId, newStatus) {
    const all = getStoredConsultations();
    const updated = all.map((c) =>
        c.id === consultationId ? { ...c, status: newStatus } : c
    );
    localStorage.setItem('courtvista_consultations', JSON.stringify(updated));
    return updated;
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

const TAB_FILTERS = ['pending', 'confirmed', 'declined', 'all'];

export default function LawyerDashboard() {
    const { user } = useAuth();
    const [consultations, setConsultations] = useState(getStoredConsultations);
    const [activeTab, setActiveTab] = useState('pending');

    // Match to platform profile
    const platformProfile = useMemo(() =>
        lawyers.find((l) => l.name.toLowerCase().includes(user?.name?.toLowerCase() || '___')),
        [user]
    );

    // Specializations text
    const specNames = useMemo(() => {
        if (!platformProfile) return '';
        return platformProfile.specializations
            .map((s) => practiceAreas.find((pa) => pa.id === s)?.name)
            .filter(Boolean)
            .join(' · ');
    }, [platformProfile]);

    // Filter consultations for this lawyer
    const myConsultations = useMemo(() =>
        consultations.filter((c) => {
            if (platformProfile && c.lawyerId === platformProfile.id) return true;
            return c.lawyerName?.toLowerCase().includes(user?.name?.toLowerCase() || '___');
        }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        [consultations, platformProfile, user]
    );

    const pending = myConsultations.filter((c) => c.status === 'pending');
    const confirmed = myConsultations.filter((c) => c.status === 'confirmed');
    const declined = myConsultations.filter((c) => c.status === 'declined');

    const filteredConsultations = activeTab === 'all'
        ? myConsultations
        : myConsultations.filter((c) => c.status === activeTab);

    // Q&A answers by this lawyer
    const myQnAnswers = useMemo(() => {
        if (!platformProfile) return [];
        return qnaData.flatMap((q) =>
            q.answers
                .filter((a) => a.lawyerId === platformProfile.id)
                .map((a) => ({ ...a, question: q.question, category: q.category }))
        );
    }, [platformProfile]);

    // Today's appointments
    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = confirmed.filter((c) => c.date === todayStr);

    const tabCounts = {
        pending: pending.length,
        confirmed: confirmed.length,
        declined: declined.length,
        all: myConsultations.length,
    };

    const handleStatusChange = useCallback((consultationId, newStatus) => {
        const updated = updateConsultationStatus(consultationId, newStatus);
        setConsultations(updated);
    }, []);

    return (
        <div className="dashboard dashboard--lawyer container animate-fade-in-up">
            {/* ─── Lawyer Header Banner ─── */}
            <div className="lawyer-banner">
                <div className="lawyer-banner__profile">
                    <div className="lawyer-banner__avatar">
                        {platformProfile ? getInitials(platformProfile.name) : user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="lawyer-banner__info">
                        <h1 className="lawyer-banner__name">{user?.name}</h1>
                        <div className="lawyer-banner__meta">
                            {platformProfile ? (
                                <>
                                    <span>{platformProfile.jurisdiction}</span>
                                    <span className="lawyer-banner__sep">·</span>
                                    <span>{specNames}</span>
                                </>
                            ) : (
                                <span>Legal Professional</span>
                            )}
                        </div>
                        {platformProfile && (
                            <div className="lawyer-banner__badges">
                                <span className="lawyer-banner__badge">⚖️ {platformProfile.experience} Years</span>
                                <span className="lawyer-banner__badge">📋 Bar: {platformProfile.barCouncilNumber}</span>
                                {platformProfile.verified && (
                                    <span className="lawyer-banner__badge lawyer-banner__badge--verified">✓ Verified</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {platformProfile && (
                    <div className="lawyer-banner__rating">
                        <div className="lawyer-banner__rating-number">{platformProfile.rating}</div>
                        <div className="lawyer-banner__rating-stars">
                            {'★'.repeat(Math.round(platformProfile.rating / 2))}
                        </div>
                        <div className="lawyer-banner__rating-count">{platformProfile.reviewCount} reviews</div>
                    </div>
                )}
            </div>

            {/* ─── Today's Overview ─── */}
            <div className="dashboard__stats">
                <div className="dashboard__stat-card lawyer-stat--today">
                    <div className="dashboard__stat-icon">📅</div>
                    <div className="dashboard__stat-number">{todayAppointments.length}</div>
                    <div className="dashboard__stat-label">Today's Appointments</div>
                </div>
                <div className="dashboard__stat-card dashboard__stat-card--pending">
                    <div className="dashboard__stat-icon">🔔</div>
                    <div className="dashboard__stat-number">{pending.length}</div>
                    <div className="dashboard__stat-label">Awaiting Your Action</div>
                </div>
                <div className="dashboard__stat-card dashboard__stat-card--confirmed">
                    <div className="dashboard__stat-icon">👥</div>
                    <div className="dashboard__stat-number">{confirmed.length}</div>
                    <div className="dashboard__stat-label">Active Clients</div>
                </div>
                <div className="dashboard__stat-card">
                    <div className="dashboard__stat-icon">💬</div>
                    <div className="dashboard__stat-number">{myQnAnswers.length}</div>
                    <div className="dashboard__stat-label">Q&A Answers</div>
                </div>
            </div>

            {/* ─── Client Requests (Tabbed) ─── */}
            <div className="dashboard__section">
                <h2 className="dashboard__section-title">
                    👥 Client Requests
                    {pending.length > 0 && (
                        <span className="dashboard__count-badge">{pending.length} new</span>
                    )}
                </h2>

                <div className="dashboard__tabs">
                    {TAB_FILTERS.map((tab) => (
                        <button
                            key={tab}
                            className={`dashboard__tab ${activeTab === tab ? 'dashboard__tab--active' : ''} ${tab === 'pending' && pending.length > 0 ? 'dashboard__tab--alert' : ''}`}
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
                            {activeTab === 'pending' ? '📭' : activeTab === 'confirmed' ? '✅' : activeTab === 'declined' ? '🚫' : '📋'}
                        </div>
                        <h3 className="dashboard__empty-title">
                            {activeTab === 'pending' ? 'No pending requests' : `No ${activeTab} consultations`}
                        </h3>
                        <p className="dashboard__empty-text">
                            {activeTab === 'pending'
                                ? 'When clients book consultations with you, new requests will appear here.'
                                : `You don't have any ${activeTab} consultations right now.`}
                        </p>
                    </div>
                ) : (
                    <div className="dashboard__consultation-list">
                        {filteredConsultations.map((c) => (
                            <div key={c.id} className={`dashboard__consultation-item dashboard__consultation-item--${c.status}`}>
                                <div className="dashboard__consultation-header">
                                    <div className="dashboard__consultation-client">
                                        <div className="dashboard__consultation-avatar">
                                            {c.clientName?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <div className="dashboard__consultation-name">{c.clientName}</div>
                                            <div className="dashboard__consultation-email">{c.clientEmail}</div>
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
                                            <span className="dashboard__detail-label">Preferred Date</span>
                                            <span className="dashboard__detail-value">{formatDate(c.date)}</span>
                                        </div>
                                    )}
                                    {c.time && (
                                        <div className="dashboard__consultation-detail">
                                            <span className="dashboard__detail-label">Time Slot</span>
                                            <span className="dashboard__detail-value">{c.time}</span>
                                        </div>
                                    )}
                                    {c.phone && (
                                        <div className="dashboard__consultation-detail">
                                            <span className="dashboard__detail-label">Phone</span>
                                            <span className="dashboard__detail-value">{c.phone}</span>
                                        </div>
                                    )}
                                    <div className="dashboard__consultation-detail">
                                        <span className="dashboard__detail-label">Requested</span>
                                        <span className="dashboard__detail-value">{formatDate(c.createdAt)}</span>
                                    </div>
                                </div>

                                {c.message && (
                                    <div className="dashboard__consultation-message">
                                        <span className="dashboard__detail-label">Client Message</span>
                                        <p>{c.message}</p>
                                    </div>
                                )}

                                {c.status === 'pending' && (
                                    <div className="dashboard__consultation-actions">
                                        <button
                                            className="btn btn--confirm"
                                            onClick={() => handleStatusChange(c.id, 'confirmed')}
                                        >
                                            ✅ Accept Client
                                        </button>
                                        <button
                                            className="btn btn--decline"
                                            onClick={() => handleStatusChange(c.id, 'declined')}
                                        >
                                            ✗ Decline
                                        </button>
                                    </div>
                                )}
                                {c.status === 'confirmed' && (
                                    <div className="dashboard__consultation-actions">
                                        <Link to={`/messages/${c.id}`} className="btn btn--gold btn--sm">
                                            💬 Message Client
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Performance Snapshot ─── */}
            {platformProfile && (
                <div className="dashboard__section">
                    <h2 className="dashboard__section-title">📊 Practice Performance</h2>
                    <div className="performance-grid">
                        <div className="performance-card">
                            <div className="performance-card__value">{platformProfile.totalCases}</div>
                            <div className="performance-card__label">Total Cases Handled</div>
                        </div>
                        <div className="performance-card">
                            <div className="performance-card__value">{platformProfile.pendingCases}</div>
                            <div className="performance-card__label">Active Cases</div>
                        </div>
                        <div className="performance-card">
                            <div className="performance-card__value">{platformProfile.reviewCount}</div>
                            <div className="performance-card__label">Client Reviews</div>
                        </div>
                        <div className="performance-card">
                            <div className="performance-card__value">{platformProfile.feesRange}</div>
                            <div className="performance-card__label">Fee Range</div>
                        </div>
                    </div>
                    {platformProfile.awards.length > 0 && (
                        <div className="awards-list">
                            <div className="dashboard__detail-label" style={{ marginBottom: '8px' }}>Awards & Recognition</div>
                            {platformProfile.awards.map((award, i) => (
                                <div key={i} className="award-item">🏆 {award}</div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ─── Recent Q&A Activity ─── */}
            {myQnAnswers.length > 0 && (
                <div className="dashboard__section">
                    <h2 className="dashboard__section-title">💬 Your Q&A Contributions</h2>
                    <div className="qna-activity-list">
                        {myQnAnswers.slice(0, 3).map((answer) => (
                            <div key={answer.id} className="qna-activity-item">
                                <div className="qna-activity-item__question">
                                    <span className="qna-activity-item__q-badge">Q</span>
                                    {answer.question}
                                </div>
                                <div className="qna-activity-item__answer">{answer.text.substring(0, 140)}...</div>
                                <div className="qna-activity-item__meta">
                                    <span>👍 {answer.helpful} found helpful</span>
                                    <span className="chip chip--gold" style={{ fontSize: '0.65rem' }}>
                                        {practiceAreas.find((pa) => pa.id === answer.category)?.name}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
                        <Link to="/qna" className="btn btn--outline btn--sm">Answer More Questions →</Link>
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
                        <span className="dashboard__action-desc">Update your professional info</span>
                    </Link>
                    {platformProfile && (
                        <Link to={`/lawyer/${platformProfile.id}`} className="dashboard__action-card">
                            <span className="dashboard__action-icon">👤</span>
                            <span className="dashboard__action-label">My Public Profile</span>
                            <span className="dashboard__action-desc">See how clients view you</span>
                        </Link>
                    )}
                    <Link to="/messages" className="dashboard__action-card">
                        <span className="dashboard__action-icon">💬</span>
                        <span className="dashboard__action-label">Messages</span>
                        <span className="dashboard__action-desc">Chat with your clients</span>
                    </Link>
                    <Link to="/qna" className="dashboard__action-card">
                        <span className="dashboard__action-icon">❓</span>
                        <span className="dashboard__action-label">Answer Questions</span>
                        <span className="dashboard__action-desc">Build reputation on Q&A</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
