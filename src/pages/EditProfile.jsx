import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './EditProfile.css';

export default function EditProfile() {
    const { user, updateProfile, getDashboardPath } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
        // Lawyer-specific
        jurisdiction: user?.jurisdiction || '',
        experience: user?.experience || '',
        languages: user?.languages || '',
    });
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');

    const isLawyer = user?.role === 'lawyer';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setSaved(false);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setError('Name is required.');
            return;
        }

        const updates = {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            bio: formData.bio.trim(),
        };

        if (isLawyer) {
            updates.jurisdiction = formData.jurisdiction.trim();
            updates.experience = formData.experience.trim();
            updates.languages = formData.languages.trim();
        }

        const result = updateProfile(updates);
        if (result.success) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="edit-profile container animate-fade-in-up">
            <div className="edit-profile__header">
                <button
                    className="edit-profile__back"
                    onClick={() => navigate(getDashboardPath())}
                >
                    ← Back to Dashboard
                </button>
                <h1 className="edit-profile__title">Edit Profile</h1>
                <p className="edit-profile__subtitle">
                    Update your personal information{isLawyer ? ' and professional details' : ''}
                </p>
            </div>

            <form className="edit-profile__form" onSubmit={handleSubmit}>
                {/* Avatar preview */}
                <div className="edit-profile__avatar-section">
                    <div className={`edit-profile__avatar ${isLawyer ? 'edit-profile__avatar--lawyer' : ''}`}>
                        {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                        <div className="edit-profile__avatar-name">{formData.name || 'Your Name'}</div>
                        <div className="edit-profile__avatar-role">
                            <span className={`dashboard__role-badge dashboard__role-badge--${user?.role}`}>
                                {user?.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="edit-profile__section">
                    <h2 className="edit-profile__section-title">Personal Information</h2>

                    <div className="edit-profile__field-group">
                        <div className="edit-profile__field">
                            <label htmlFor="ep-name">Full Name *</label>
                            <input
                                id="ep-name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Your full name"
                                required
                            />
                        </div>
                        <div className="edit-profile__field">
                            <label htmlFor="ep-email">Email Address</label>
                            <input
                                id="ep-email"
                                type="email"
                                value={formData.email}
                                disabled
                                className="edit-profile__input--disabled"
                            />
                            <span className="edit-profile__hint">Email cannot be changed</span>
                        </div>
                    </div>

                    <div className="edit-profile__field-group">
                        <div className="edit-profile__field">
                            <label htmlFor="ep-phone">Phone Number</label>
                            <input
                                id="ep-phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 XXXXX XXXXX"
                            />
                        </div>
                    </div>

                    <div className="edit-profile__field">
                        <label htmlFor="ep-bio">
                            {isLawyer ? 'Professional Summary' : 'About You'}
                        </label>
                        <textarea
                            id="ep-bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            placeholder={isLawyer
                                ? 'Describe your practice, areas of expertise, and approach to client service...'
                                : 'Tell us a bit about yourself...'}
                            rows={4}
                        />
                    </div>
                </div>

                {/* Lawyer-specific fields */}
                {isLawyer && (
                    <div className="edit-profile__section">
                        <h2 className="edit-profile__section-title">Professional Details</h2>

                        <div className="edit-profile__field-group">
                            <div className="edit-profile__field">
                                <label htmlFor="ep-jurisdiction">Jurisdiction / Location</label>
                                <input
                                    id="ep-jurisdiction"
                                    name="jurisdiction"
                                    type="text"
                                    value={formData.jurisdiction}
                                    onChange={handleChange}
                                    placeholder="e.g. Mumbai, Maharashtra"
                                />
                            </div>
                            <div className="edit-profile__field">
                                <label htmlFor="ep-experience">Years of Experience</label>
                                <input
                                    id="ep-experience"
                                    name="experience"
                                    type="text"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    placeholder="e.g. 12"
                                />
                            </div>
                        </div>

                        <div className="edit-profile__field">
                            <label htmlFor="ep-languages">Languages Spoken</label>
                            <input
                                id="ep-languages"
                                name="languages"
                                type="text"
                                value={formData.languages}
                                onChange={handleChange}
                                placeholder="e.g. English, Hindi, Marathi"
                            />
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="edit-profile__actions">
                    {error && <div className="edit-profile__error">{error}</div>}
                    {saved && <div className="edit-profile__success">✅ Profile updated successfully!</div>}
                    <div className="edit-profile__buttons">
                        <button
                            type="button"
                            className="btn btn--outline"
                            onClick={() => navigate(getDashboardPath())}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn--gold">
                            Save Changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
