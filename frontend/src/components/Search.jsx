import React, { useState } from 'react';
import axios from 'axios';

function Search() {
  const [username, setUsername] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!username) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('http://127.0.0.1:8000/api/username-osint/', {
        username: username.trim(),
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Failed to fetch results' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h2>🔍 Username OSINT Search</h2>

      <input
        type="text"
        placeholder="Enter username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ padding: '0.5rem', width: '300px' }}
      />

      <button
        onClick={handleSearch}
        style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
      >
        Search
      </button>

      {loading && <p>Loading...</p>}

      {result && result.details && (
        <div style={{ marginTop: '2rem' }}>
          <h4>🌐 Found on:</h4>
          <ul>
            {Object.entries(result.details).map(([platform, link]) => (
              <li key={platform}>
                <a href={link} target="_blank" rel="noopener noreferrer">
                  🔗 {platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {result && result.error && (
        <p style={{ color: 'red' }}>{result.error}</p>
      )}
    </div>
  );
}

export default Search;
