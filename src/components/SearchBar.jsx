import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { practiceAreas, cities } from '../data/lawyers';
import './SearchBar.css';

export default function SearchBar({ hero = false, initialArea = '', initialCity = '' }) {
    const [area, setArea] = useState(initialArea);
    const [city, setCity] = useState(initialCity);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (area) params.set('area', area);
        if (city) params.set('city', city);
        navigate(`/search?${params.toString()}`);
    };

    return (
        <form className={`search-bar ${hero ? 'search-bar--hero' : ''}`} onSubmit={handleSubmit}>
            <div className="search-bar__field">
                <span className="search-bar__icon">⚖️</span>
                <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    aria-label="Practice area"
                >
                    <option value="">All Practice Areas</option>
                    {practiceAreas.map((pa) => (
                        <option key={pa.id} value={pa.id}>{pa.name}</option>
                    ))}
                </select>
            </div>
            <div className="search-bar__field">
                <span className="search-bar__icon">📍</span>
                <input
                    type="text"
                    placeholder="City or location"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    list="cities-list"
                    aria-label="Location"
                />
                <datalist id="cities-list">
                    {cities.map((c) => (
                        <option key={c} value={c} />
                    ))}
                </datalist>
            </div>
            <button type="submit" className="search-bar__submit">
                Search
            </button>
        </form>
    );
}
