import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSidebar';
import LawyerCard from '../components/LawyerCard';
import { lawyers } from '../data/lawyers';
import { getDynamicLawyers } from '../context/AuthContext';
import './Search.css';

const ITEMS_PER_PAGE = 6;

export default function Search({ compareIds, onCompareToggle }) {
    const [searchParams] = useSearchParams();
    const initialArea = searchParams.get('area') || '';
    const initialCity = searchParams.get('city') || '';

    // Dynamic lawyers from localStorage — re-read whenever localStorage changes
    const [dynamicLawyers, setDynamicLawyers] = useState(() => getDynamicLawyers());

    useEffect(() => {
        // Re-sync when another tab/window updates localStorage
        const handleStorage = () => setDynamicLawyers(getDynamicLawyers());
        window.addEventListener('storage', handleStorage);
        // Also refresh on mount every time the component is visited
        setDynamicLawyers(getDynamicLawyers());
        return () => window.removeEventListener('storage', handleStorage);
    }, []);

    // Merge static lawyers with dynamically registered ones.
    // Dynamic lawyer IDs are strings (e.g. 'user-16...'), static IDs are numbers,
    // so there is no collision. Static profiles take precedence.
    // Merge static lawyers with dynamically registered ones.
    const allLawyers = useMemo(() => {
        const staticIds = new Set(lawyers.map((l) => l.id));
        const newOnes = dynamicLawyers.filter((dl) => !staticIds.has(dl.id));
        const combined = [...lawyers, ...newOnes];

        // Enrich with live ratings for filtering and sorting
        return combined.map(l => {
            try {
                const reviews = JSON.parse(localStorage.getItem(`courtvista_reviews_${l.id}`)) || [];
                if (reviews.length > 0) {
                    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
                    return {
                        ...l,
                        liveRating: parseFloat(avg.toFixed(1)),
                        liveReviewCount: reviews.length + (l.reviewCount || 0)
                    };
                }
            } catch (e) { }
            return { ...l, liveRating: l.rating || 0, liveReviewCount: l.reviewCount || 0 };
        });
    }, [dynamicLawyers]);

    const [filters, setFilters] = useState({
        areas: initialArea ? [initialArea] : [],
        city: initialCity,
        minExperience: 0,
        minRating: 0,
        languages: [],
        gender: '',
        verifiedOnly: false,
    });

    const [sortBy, setSortBy] = useState('rating');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleClearFilters = () => {
        setFilters({
            areas: [],
            city: '',
            minExperience: 0,
            minRating: 0,
            languages: [],
            gender: '',
            verifiedOnly: false,
        });
        setCurrentPage(1);
    };

    const filtered = useMemo(() => {
        let result = [...allLawyers];

        if (filters.areas.length > 0) {
            result = result.filter((l) =>
                l.specializations.some((s) => filters.areas.includes(s))
            );
        }

        if (filters.city) {
            result = result.filter((l) =>
                l.city.toLowerCase().includes(filters.city.toLowerCase())
            );
        }

        if (filters.minExperience) {
            result = result.filter((l) => l.experience >= filters.minExperience);
        }

        if (filters.minRating) {
            result = result.filter((l) => l.liveRating >= filters.minRating);
        }

        if (filters.languages.length > 0) {
            result = result.filter((l) =>
                filters.languages.some((lang) => l.languages.includes(lang))
            );
        }

        if (filters.gender) {
            result = result.filter((l) => l.gender === filters.gender);
        }

        if (filters.verifiedOnly) {
            result = result.filter((l) => l.verified);
        }

        // Sort
        switch (sortBy) {
            case 'rating':
                result.sort((a, b) => b.liveRating - a.liveRating);
                break;
            case 'experience':
                result.sort((a, b) => b.experience - a.experience);
                break;
            case 'reviews':
                result.sort((a, b) => b.liveReviewCount - a.liveReviewCount);
                break;
            case 'fees_low':
                result.sort((a, b) => a.consultationFee - b.consultationFee);
                break;
            case 'fees_high':
                result.sort((a, b) => b.consultationFee - a.consultationFee);
                break;
            default:
                break;
        }

        return result;
    }, [filters, sortBy, allLawyers]);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginatedResults = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="search-page container">
            <div className="search-page__header">
                <h1 className="search-page__title">Find a Lawyer</h1>
                <div className="search-page__search-wrap">
                    <SearchBar initialArea={initialArea} initialCity={initialCity} />
                </div>
            </div>

            <button
                className="search-page__mobile-filter-btn"
                onClick={() => setShowFilters(!showFilters)}
            >
                {showFilters ? '✕ Hide Filters' : '☰ Show Filters'}
            </button>

            <div className="search-page__layout">
                <div className={showFilters ? 'search-page__sidebar' : 'search-page__sidebar search-page__sidebar--hidden'}>
                    <FilterSidebar
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClear={handleClearFilters}
                    />
                </div>

                <div className="search-page__results">
                    <div className="search-page__results-header">
                        <div className="search-page__count">
                            Showing <strong>{filtered.length}</strong> lawyer{filtered.length !== 1 ? 's' : ''}
                        </div>
                        <div className="search-page__sort">
                            <span className="search-page__sort-label">Sort by:</span>
                            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                <option value="rating">Highest Rating</option>
                                <option value="experience">Most Experienced</option>
                                <option value="reviews">Most Reviews</option>
                                <option value="fees_low">Lowest Fees</option>
                                <option value="fees_high">Highest Fees</option>
                            </select>
                        </div>
                    </div>

                    {paginatedResults.length > 0 ? (
                        <div className="search-page__results-list">
                            {paginatedResults.map((lawyer) => (
                                <LawyerCard
                                    key={lawyer.id}
                                    lawyer={lawyer}
                                    onCompareToggle={onCompareToggle}
                                    isCompared={compareIds.includes(lawyer.id)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="search-page__no-results">
                            <div className="search-page__no-results-icon">🔍</div>
                            <h3>No lawyers found</h3>
                            <p>Try adjusting your filters or search criteria</p>
                        </div>
                    )}

                    {totalPages > 1 && (
                        <div className="search-page__pagination">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    className={`search-page__page-btn ${page === currentPage ? 'search-page__page-btn--active' : ''}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
