import { Link } from 'react-router-dom';
import { getInitials, practiceAreas, getRatingColor, getRatingLabel } from '../data/lawyers';
import './CompareTable.css';

export default function CompareTable({ lawyers, onRemove }) {
    if (!lawyers.length) return null;

    const getSpecNames = (specIds) =>
        specIds
            .map((id) => practiceAreas.find((pa) => pa.id === id)?.name)
            .filter(Boolean);

    const rows = [
        {
            label: 'CourtVista Rating',
            render: (l) => (
                <span style={{ color: getRatingColor(l.rating), fontWeight: 700, fontSize: '1.25rem' }}>
                    {l.rating.toFixed(1)} <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>({getRatingLabel(l.rating)})</span>
                </span>
            ),
        },
        {
            label: 'Experience',
            render: (l) => <span className="compare-table__highlight">{l.experience} years</span>,
        },
        {
            label: 'Specializations',
            render: (l) => (
                <div className="compare-table__chips">
                    {getSpecNames(l.specializations).map((n) => (
                        <span key={n} className="chip">{n}</span>
                    ))}
                </div>
            ),
        },
        { label: 'Jurisdiction', render: (l) => l.jurisdiction },
        { label: 'Fees', render: (l) => <span className="compare-table__highlight">{l.feesRange}</span> },
        { label: 'Reviews', render: (l) => `${l.reviewCount} reviews` },
        {
            label: 'Languages',
            render: (l) => (
                <div className="compare-table__chips">
                    {l.languages.map((lang) => (
                        <span key={lang} className="chip">{lang}</span>
                    ))}
                </div>
            ),
        },
        { label: 'Verified', render: (l) => l.verified ? <span className="chip chip--green">✓ Verified</span> : <span className="chip">Not Verified</span> },
        { label: 'Education', render: (l) => l.education },
        {
            label: '',
            render: (l) => (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    <Link to={`/lawyer/${l.id}`} className="btn btn--primary btn--sm">View Profile</Link>
                    <Link to={`/book/${l.id}`} className="btn btn--gold btn--sm">Book</Link>
                </div>
            ),
        },
    ];

    return (
        <div className="compare-table-wrapper">
            <table className="compare-table">
                <thead>
                    <tr>
                        <th></th>
                        {lawyers.map((l) => (
                            <td key={l.id} className="compare-table__header-cell">
                                <div className="compare-table__avatar">{getInitials(l.name)}</div>
                                <div className="compare-table__name">{l.name}</div>
                                <div className="compare-table__city">📍 {l.city}</div>
                                <button className="compare-table__remove" onClick={() => onRemove(l.id)}>
                                    ✕ Remove
                                </button>
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, i) => (
                        <tr key={i}>
                            <th>{row.label}</th>
                            {lawyers.map((l) => (
                                <td key={l.id}>{row.render(l)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
