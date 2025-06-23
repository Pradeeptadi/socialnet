// frontend/src/components/Search.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLoading(true);
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
    <div className="search-container" style={{ padding: '20px' }}>
      <h2>🔍 Username OSINT Search</h2>

      <input
        type="text"
        placeholder="Enter a username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: '10px', width: '250px', marginRight: '10px' }}
      />

      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      <div style={{ marginTop: '20px' }}>
        {results.length > 0 && (
          <ul>
            {results.map((item, i) => (
              <li key={i}>
                <a href={item.site} target="_blank" rel="noopener noreferrer">
                  {item.site}
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
