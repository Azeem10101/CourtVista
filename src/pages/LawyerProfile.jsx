import { useParams, Link } from 'react-router-dom';
import { lawyers, practiceAreas, getInitials } from '../data/lawyers';
import RatingBadge from '../components/RatingBadge';
import ReviewCard from '../components/ReviewCard';
import './LawyerProfile.css';

export default function LawyerProfile() {
    const { id } = useParams();
    const lawyer = lawyers.find((l) => l.id === parseInt(id));

    if (!lawyer) {
        return (
            <div className="profile-page container">
                <div className="search-page__no-results">
                    <div className="search-page__no-results-icon">🔍</div>
                    <h3>Lawyer not found</h3>
                    <p>The profile you&apos;re looking for doesn&apos;t exist.</p>
                    <Link to="/search" className="btn btn--primary" style={{ marginTop: '1rem' }}>
                        Browse Lawyers
                    </Link>
                </div>
            </div>
        );
    }

    const specNames = lawyer.specializations
        .map((s) => practiceAreas.find((pa) => pa.id === s)?.name)
        .filter(Boolean);

    const avgStars = lawyer.reviews.length
        ? (lawyer.reviews.reduce((sum, r) => sum + r.rating, 0) / lawyer.reviews.length).toFixed(1)
        : 0;

    const starCounts = [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: lawyer.reviews.filter((r) => r.rating === star).length,
        pct: lawyer.reviews.length
            ? (lawyer.reviews.filter((r) => r.rating === star).length / lawyer.reviews.length) * 100
            : 0,
    }));

    return (
        <div className="profile-page container">
            {/* ─── HEADER ─── */}
            <div className="profile-header animate-fade-in-up">
                <div className="profile-header__avatar">
                    {getInitials(lawyer.name)}
                </div>
                <div className="profile-header__info">
                    <h1 className="profile-header__name">{lawyer.name}</h1>
                    <div className="profile-header__specializations">{specNames.join(' · ')}</div>

                    <div className="profile-header__meta">
                        <span className="profile-header__meta-item">📍 {lawyer.city}</span>
                        <span className="profile-header__meta-item">🏛️ {lawyer.jurisdiction}</span>
                        <span className="profile-header__meta-item">⏳ {lawyer.experience} years experience</span>
                        <span className="profile-header__meta-item">💬 {lawyer.reviewCount} reviews</span>
                    </div>

                    <div className="profile-header__badges">
                        {lawyer.verified && (
                            <span className="chip chip--green">✓ Credentials Verified</span>
                        )}
                        {lawyer.languages.map((lang) => (
                            <span key={lang} className="chip">{lang}</span>
                        ))}
                    </div>

                    <div className="profile-header__actions">
                        <Link to={`/book/${lawyer.id}`} className="btn btn--gold">
                            Book a Consultation
                        </Link>
                        <a href={`tel:+91-XXXXXXXXXX`} className="btn btn--outline">
                            📞 Contact
                        </a>
                    </div>
                </div>

                <div className="profile-header__rating">
                    <RatingBadge rating={lawyer.rating} />
                </div>
            </div>

            {/* ─── BODY ─── */}
            <div className="profile-body">
                <div className="profile-main">
                    {/* About */}
                    <div className="profile-section">
                        <h2 className="profile-section__title">About</h2>
                        <p className="profile-bio">{lawyer.bio}</p>
                    </div>

                    {/* Case Statistics */}
                    <div className="profile-section">
                        <h2 className="profile-section__title">Case Statistics</h2>
                        <div className="profile-case-stats">
                            <div className="profile-case-stat">
                                <div className="profile-case-stat__icon">📁</div>
                                <div className="profile-case-stat__number">{lawyer.totalCases}</div>
                                <div className="profile-case-stat__label">Total Cases Handled</div>
                            </div>
                            <div className="profile-case-stat">
                                <div className="profile-case-stat__icon profile-case-stat__icon--green">✅</div>
                                <div className="profile-case-stat__number">{lawyer.totalCases - lawyer.pendingCases}</div>
                                <div className="profile-case-stat__label">Cases Resolved</div>
                            </div>
                            <div className="profile-case-stat">
                                <div className="profile-case-stat__icon profile-case-stat__icon--amber">⏳</div>
                                <div className="profile-case-stat__number">{lawyer.pendingCases}</div>
                                <div className="profile-case-stat__label">Pending Cases</div>
                            </div>
                        </div>
                    </div>

                    {/* Practice Areas */}
                    <div className="profile-section">
                        <h2 className="profile-section__title">Practice Areas</h2>
                        <div className="profile-tags">
                            {specNames.map((name) => (
                                <span key={name} className="chip chip--gold">{name}</span>
                            ))}
                        </div>
                    </div>

                    {/* Credentials */}
                    <div className="profile-section">
                        <h2 className="profile-section__title">Credentials</h2>
                        <div className="profile-credentials">
                            <div className="profile-credential">
                                <div className="profile-credential__icon">🎓</div>
                                <div>
                                    <div className="profile-credential__label">Education</div>
                                    <div className="profile-credential__value">{lawyer.education}</div>
                                </div>
                            </div>
                            <div className="profile-credential">
                                <div className="profile-credential__icon">📋</div>
                                <div>
                                    <div className="profile-credential__label">Bar Council Registration</div>
                                    <div className="profile-credential__value">{lawyer.barCouncilNumber}</div>
                                </div>
                            </div>
                            <div className="profile-credential">
                                <div className="profile-credential__icon">🏛️</div>
                                <div>
                                    <div className="profile-credential__label">Jurisdiction</div>
                                    <div className="profile-credential__value">{lawyer.jurisdiction}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Awards */}
                    {lawyer.awards.length > 0 && (
                        <div className="profile-section">
                            <h2 className="profile-section__title">Awards & Recognition</h2>
                            <div className="profile-awards">
                                {lawyer.awards.map((award, idx) => (
                                    <div key={idx} className="profile-award">
                                        🏆 {award}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews */}
                    <div className="profile-section">
                        <h2 className="profile-section__title">Client Reviews</h2>

                        <div className="reviews-summary">
                            <div className="reviews-summary__score">
                                <div className="reviews-summary__number">{avgStars}</div>
                                <div className="reviews-summary__count">{lawyer.reviews.length} reviews</div>
                            </div>
                            <div className="reviews-summary__bars">
                                {starCounts.map(({ star, count, pct }) => (
                                    <div key={star} className="reviews-summary__bar">
                                        <span>{star}★</span>
                                        <div className="reviews-summary__bar-track">
                                            <div
                                                className="reviews-summary__bar-fill"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <span>{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {lawyer.reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                </div>

                {/* SIDEBAR */}
                <div className="profile-sidebar">
                    <div className="profile-section">
                        <h2 className="profile-section__title">Consultation Fees</h2>
                        <div className="profile-sidebar__fees">
                            <div className="profile-sidebar__fee-row">
                                <span className="profile-sidebar__fee-label">Consultation</span>
                                <span className="profile-sidebar__fee-value">{lawyer.feesRange}</span>
                            </div>
                        </div>
                        <Link
                            to={`/book/${lawyer.id}`}
                            className="btn btn--gold btn--lg"
                            style={{ width: '100%', marginTop: 'var(--space-5)' }}
                        >
                            Book a Consultation
                        </Link>
                    </div>

                    <div className="profile-section">
                        <h2 className="profile-section__title">Languages</h2>
                        <div className="profile-tags">
                            {lawyer.languages.map((lang) => (
                                <span key={lang} className="chip">{lang}</span>
                            ))}
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2 className="profile-section__title">Jurisdiction</h2>
                        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--gray-600)' }}>
                            {lawyer.jurisdiction}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
