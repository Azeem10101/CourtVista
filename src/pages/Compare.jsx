import { Link } from 'react-router-dom';
import { lawyers } from '../data/lawyers';
import CompareTable from '../components/CompareTable';
import './Compare.css';

export default function Compare({ compareIds, onRemove }) {
    const compareLawyers = compareIds
        .map((id) => lawyers.find((l) => l.id === id))
        .filter(Boolean);

    return (
        <div className="compare-page container">
            <h1 className="compare-page__title">Compare Lawyers</h1>
            <p className="compare-page__subtitle">
                Compare up to 3 lawyers side-by-side to make an informed decision
            </p>

            {compareLawyers.length > 0 ? (
                <CompareTable lawyers={compareLawyers} onRemove={onRemove} />
            ) : (
                <div className="compare-page__empty">
                    <div className="compare-page__empty-icon">📊</div>
                    <h3>No lawyers selected for comparison</h3>
                    <p>
                        Go to the search page and click the &ldquo;+ Compare&rdquo; button on lawyer cards
                        to add them to your comparison list.
                    </p>
                    <Link to="/search" className="btn btn--gold">
                        Find Lawyers to Compare
                    </Link>
                </div>
            )}
        </div>
    );
}
