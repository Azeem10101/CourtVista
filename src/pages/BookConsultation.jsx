import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { lawyers, practiceAreas, getInitials } from '../data/lawyers';
import './BookConsultation.css';

export default function BookConsultation() {
    const { id } = useParams();
    const lawyer = lawyers.find((l) => l.id === parseInt(id));
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        caseType: '',
        date: '',
        time: '',
        message: '',
    });

    if (!lawyer) {
        return (
            <div className="book-page container">
                <div className="search-page__no-results">
                    <h3>Lawyer not found</h3>
                    <Link to="/search" className="btn btn--primary" style={{ marginTop: '1rem' }}>
                        Browse Lawyers
                    </Link>
                </div>
            </div>
        );
    }

    const specNames = lawyer.specializations
        .map((s) => practiceAreas.find((pa) => pa.id === s)?.name)
        .filter(Boolean)
        .join(' · ');

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="book-page container">
                <div className="book-confirmation animate-fade-in-up">
                    <div className="book-confirmation__icon">✅</div>
                    <h2 className="book-confirmation__title">Consultation Request Sent!</h2>
                    <p className="book-confirmation__text">
                        Your consultation request has been sent to {lawyer.name}.
                        They will contact you within 24 hours to confirm the appointment.
                    </p>
                    <div className="book-confirmation__details">
                        <div className="book-confirmation__detail">
                            <span className="book-confirmation__detail-label">Lawyer</span>
                            <span className="book-confirmation__detail-value">{lawyer.name}</span>
                        </div>
                        <div className="book-confirmation__detail">
                            <span className="book-confirmation__detail-label">Your Name</span>
                            <span className="book-confirmation__detail-value">{formData.name}</span>
                        </div>
                        <div className="book-confirmation__detail">
                            <span className="book-confirmation__detail-label">Email</span>
                            <span className="book-confirmation__detail-value">{formData.email}</span>
                        </div>
                        {formData.date && (
                            <div className="book-confirmation__detail">
                                <span className="book-confirmation__detail-label">Preferred Date</span>
                                <span className="book-confirmation__detail-value">{formData.date}</span>
                            </div>
                        )}
                        {formData.time && (
                            <div className="book-confirmation__detail">
                                <span className="book-confirmation__detail-label">Preferred Time</span>
                                <span className="book-confirmation__detail-value">{formData.time}</span>
                            </div>
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                        <Link to={`/lawyer/${lawyer.id}`} className="btn btn--outline">
                            Back to Profile
                        </Link>
                        <Link to="/" className="btn btn--primary">
                            Go Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="book-page container">
            <div className="book-page__header">
                <h1 className="book-page__title">Book a Consultation</h1>
                <p className="book-page__subtitle">Fill in your details to request a consultation</p>
            </div>

            <div className="book-page__lawyer-summary">
                <div className="book-page__lawyer-avatar">{getInitials(lawyer.name)}</div>
                <div>
                    <div className="book-page__lawyer-name">{lawyer.name}</div>
                    <div className="book-page__lawyer-spec">{specNames}</div>
                </div>
                <div className="book-page__lawyer-fee">
                    <div className="book-page__lawyer-fee-label">Consultation Fee</div>
                    <div className="book-page__lawyer-fee-value">{lawyer.feesRange}</div>
                </div>
            </div>

            <form className="book-form" onSubmit={handleSubmit}>
                <div className="book-form__grid">
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Full Name *</label>
                        <input
                            className="form-input"
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email Address *</label>
                        <input
                            className="form-input"
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="you@example.com"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="phone">Phone Number</label>
                        <input
                            className="form-input"
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="+91 XXXXX XXXXX"
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="caseType">Case Type</label>
                        <select
                            className="form-select"
                            id="caseType"
                            name="caseType"
                            value={formData.caseType}
                            onChange={handleChange}
                        >
                            <option value="">Select a case type</option>
                            {practiceAreas.map((pa) => (
                                <option key={pa.id} value={pa.id}>{pa.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="date">Preferred Date</label>
                        <input
                            className="form-input"
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="time">Preferred Time</label>
                        <select
                            className="form-select"
                            id="time"
                            name="time"
                            value={formData.time}
                            onChange={handleChange}
                        >
                            <option value="">Select a time slot</option>
                            <option value="09:00 - 10:00 AM">09:00 - 10:00 AM</option>
                            <option value="10:00 - 11:00 AM">10:00 - 11:00 AM</option>
                            <option value="11:00 - 12:00 PM">11:00 - 12:00 PM</option>
                            <option value="02:00 - 03:00 PM">02:00 - 03:00 PM</option>
                            <option value="03:00 - 04:00 PM">03:00 - 04:00 PM</option>
                            <option value="04:00 - 05:00 PM">04:00 - 05:00 PM</option>
                            <option value="05:00 - 06:00 PM">05:00 - 06:00 PM</option>
                        </select>
                    </div>
                    <div className="form-group book-form__full">
                        <label className="form-label" htmlFor="message">Brief Description of Your Case</label>
                        <textarea
                            className="form-textarea"
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Describe your legal issue briefly..."
                            rows={4}
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn--gold btn--lg book-form__submit" style={{ width: '100%' }}>
                    Send Consultation Request
                </button>
            </form>
        </div>
    );
}
