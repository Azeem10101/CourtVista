import { Link } from 'react-router-dom';
import { getInitials, practiceAreas } from '../data/lawyers';
import RatingBadge from './RatingBadge';
import './LawyerCard.css';

export default function LawyerCard({ lawyer, onCompareToggle, isCompared = false }) {
    const specNames = lawyer.specializations
        .map((s) => practiceAreas.find((pa) => pa.id === s)?.name)
        .filter(Boolean)
        .join(' · ');

    return (
        <div className="lawyer-card animate-fade-in-up">
            <Link to={`/lawyer/${lawyer.id}`} className="lawyer-card__avatar">
                {getInitials(lawyer.name)}
            </Link>

            <div className="lawyer-card__content">
                <div className="lawyer-card__header">
                    <div>
                        <Link to={`/lawyer/${lawyer.id}`} className="lawyer-card__name">
                            {lawyer.name}
                        </Link>
                        <div className="lawyer-card__specializations">{specNames}</div>
                    </div>
                    <RatingBadge rating={lawyer.rating} small />
                </div>

                <div className="lawyer-card__meta">
                    <span className="lawyer-card__meta-item">
                        <span className="lawyer-card__meta-icon">📍</span> {lawyer.city}
                    </span>
                    <span className="lawyer-card__meta-item">
                        <span className="lawyer-card__meta-icon">⏳</span> {lawyer.experience} yrs exp
                    </span>
                    <span className="lawyer-card__meta-item">
                        <span className="lawyer-card__meta-icon">💬</span> {lawyer.reviewCount} reviews
                    </span>
                    <span className="lawyer-card__meta-item">
                        <span className="lawyer-card__meta-icon">💰</span> {lawyer.feesRange}
                    </span>
                </div>

                <div className="lawyer-card__badges">
                    {lawyer.verified && (
                        <span className="lawyer-card__verified">✓ Verified</span>
                    )}
                    {lawyer.languages.map((lang) => (
                        <span key={lang} className="chip">{lang}</span>
                    ))}
                </div>

                <div className="lawyer-card__actions">
                    <Link to={`/lawyer/${lawyer.id}`} className="btn btn--primary btn--sm">
                        View Profile
                    </Link>
                    <Link to={`/book/${lawyer.id}`} className="btn btn--outline btn--sm">
                        Book Consultation
                    </Link>
                    {onCompareToggle && (
                        <button
                            className={`lawyer-card__compare-toggle ${isCompared ? 'lawyer-card__compare-toggle--active' : ''}`}
                            onClick={() => onCompareToggle(lawyer.id)}
                        >
                            {isCompared ? '✓ Comparing' : '+ Compare'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
