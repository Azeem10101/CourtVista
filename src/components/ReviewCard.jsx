import './ReviewCard.css';

export default function ReviewCard({ review }) {
    const initials = review.reviewer
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    return (
        <div className="review-card">
            <div className="review-card__header">
                <div className="review-card__author">
                    <div className="review-card__avatar">{initials}</div>
                    <div>
                        <div className="review-card__name">{review.reviewer}</div>
                        <div className="review-card__date">{formatDate(review.date)}</div>
                    </div>
                </div>
                <div className="review-card__stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`review-card__star ${star <= review.rating ? 'review-card__star--filled' : ''}`}
                        >
                            ★
                        </span>
                    ))}
                </div>
            </div>
            <p className="review-card__text">{review.text}</p>
            <div className="review-card__helpful">
                <button className="review-card__helpful-btn">👍 Helpful ({review.helpful})</button>
            </div>
        </div>
    );
}
