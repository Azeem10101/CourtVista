import { practiceAreas, cities, languages as langList } from '../data/lawyers';
import './FilterSidebar.css';

export default function FilterSidebar({ filters, onFilterChange, onClear }) {
    const handleCheckbox = (key, value) => {
        const current = filters[key] || [];
        const updated = current.includes(value)
            ? current.filter((v) => v !== value)
            : [...current, value];
        onFilterChange(key, updated);
    };

    return (
        <aside className="filter-sidebar">
            <div className="filter-sidebar__title">
                Filters
                <button className="filter-sidebar__clear" onClick={onClear}>
                    Clear all
                </button>
            </div>

            <div className="filter-sidebar__section">
                <div className="filter-sidebar__section-title">Practice Area</div>
                <div className="filter-sidebar__options">
                    {practiceAreas.map((pa) => (
                        <label key={pa.id} className="filter-sidebar__option">
                            <input
                                type="checkbox"
                                checked={(filters.areas || []).includes(pa.id)}
                                onChange={() => handleCheckbox('areas', pa.id)}
                            />
                            {pa.name}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-sidebar__section">
                <div className="filter-sidebar__section-title">Location</div>
                <select
                    className="filter-sidebar__select"
                    value={filters.city || ''}
                    onChange={(e) => onFilterChange('city', e.target.value)}
                >
                    <option value="">All Cities</option>
                    {cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div className="filter-sidebar__section">
                <div className="filter-sidebar__section-title">Minimum Experience</div>
                <div className="filter-sidebar__options">
                    {[5, 10, 15, 20].map((y) => (
                        <label key={y} className="filter-sidebar__option">
                            <input
                                type="radio"
                                name="minExp"
                                checked={filters.minExperience === y}
                                onChange={() => onFilterChange('minExperience', y)}
                            />
                            {y}+ years
                        </label>
                    ))}
                    <label className="filter-sidebar__option">
                        <input
                            type="radio"
                            name="minExp"
                            checked={!filters.minExperience}
                            onChange={() => onFilterChange('minExperience', 0)}
                        />
                        Any
                    </label>
                </div>
            </div>

            <div className="filter-sidebar__section">
                <div className="filter-sidebar__section-title">Minimum Rating</div>
                <div className="filter-sidebar__options">
                    {[9, 8.5, 8, 7].map((r) => (
                        <label key={r} className="filter-sidebar__option">
                            <input
                                type="radio"
                                name="minRating"
                                checked={filters.minRating === r}
                                onChange={() => onFilterChange('minRating', r)}
                            />
                            {r}+ ★
                        </label>
                    ))}
                    <label className="filter-sidebar__option">
                        <input
                            type="radio"
                            name="minRating"
                            checked={!filters.minRating}
                            onChange={() => onFilterChange('minRating', 0)}
                        />
                        Any
                    </label>
                </div>
            </div>

            <div className="filter-sidebar__section">
                <div className="filter-sidebar__section-title">Languages</div>
                <div className="filter-sidebar__options">
                    {langList.slice(0, 6).map((lang) => (
                        <label key={lang} className="filter-sidebar__option">
                            <input
                                type="checkbox"
                                checked={(filters.languages || []).includes(lang)}
                                onChange={() => handleCheckbox('languages', lang)}
                            />
                            {lang}
                        </label>
                    ))}
                </div>
            </div>

            <div className="filter-sidebar__section">
                <div className="filter-sidebar__section-title">Gender</div>
                <div className="filter-sidebar__options">
                    {['Male', 'Female'].map((g) => (
                        <label key={g} className="filter-sidebar__option">
                            <input
                                type="radio"
                                name="gender"
                                checked={filters.gender === g}
                                onChange={() => onFilterChange('gender', g)}
                            />
                            {g}
                        </label>
                    ))}
                    <label className="filter-sidebar__option">
                        <input
                            type="radio"
                            name="gender"
                            checked={!filters.gender}
                            onChange={() => onFilterChange('gender', '')}
                        />
                        Any
                    </label>
                </div>
            </div>

            <div className="filter-sidebar__section">
                <div className="filter-sidebar__toggle">
                    <span>Verified Only</span>
                    <button
                        className={`filter-sidebar__switch ${filters.verifiedOnly ? 'filter-sidebar__switch--on' : ''}`}
                        onClick={() => onFilterChange('verifiedOnly', !filters.verifiedOnly)}
                        aria-label="Toggle verified only"
                    />
                </div>
            </div>
        </aside>
    );
}
