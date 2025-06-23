import React, { useState } from 'react';
import axios from 'axios';
import './Search.css'; // You'll create this CSS file

const Search = () => {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLoading(true);
    setResults([]);
    try {
      const res = await axios.post('http://localhost:8000/api/username-osint/', { username });
      setResults(res.data.results);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div className="search-wrapper">
      <h2>🔍 Username OSINT Search</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="results">
        {loading && <p>Loading...</p>}

        {!loading && results.length > 0 && (
          <ul className="result-list">
            {results.map((item, i) => (
              <li key={i} className="result-item">
                <a href={item.site} target="_blank" rel="noopener noreferrer">
                  🌐 {item.site}
                </a>
              </li>
            ))}
          </ul>
        )}

        {!loading && results.length === 0 && <p>No results found.</p>}
      </div>
    </div>
  );
};

export default Search;
