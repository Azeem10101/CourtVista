import { getRatingColor, getRatingLabel } from '../data/lawyers';
import './RatingBadge.css';

export default function RatingBadge({ rating, small = false, showLabel = true }) {
    const color = getRatingColor(rating);
    const label = getRatingLabel(rating);

    return (
        <div className="rating-badge">
            <div
                className={`rating-badge__score ${small ? 'rating-badge__score--sm' : ''}`}
                style={{ background: color }}
            >
                {rating.toFixed(1)}
            </div>
            {showLabel && (
                <div className="rating-badge__meta">
                    <span className="rating-badge__label">CourtVista Rating</span>
                    <span className="rating-badge__text">{label}</span>
                </div>
            )}
        </div>
    );
}
