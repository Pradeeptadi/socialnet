import React, { useState } from 'react';
import axios from 'axios';
import './PhoneSearch.css';

const PhoneSearch = () => {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!phone.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("https://socialnet-backend.onrender.com/api/phone-osint/", {
        phone_number: phone,
      });
      setResult(res.data);
    } catch (err) {
      console.error('Search failed:', err);
      setResult({ error: 'Request failed. Please try again.' });
    }

    setLoading(false);
  };

  return (
    <div className="search-wrapper">
      <h2>📞 Phone Number OSINT</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && <p className="loading-text">⏳ Searching phone number...</p>}

      {result && !result.error && (
        <div className="results-card">
          <h3>📋 Phone Number Details</h3>
          <p><strong>Number:</strong> {result.number}</p>
          <p><strong>Valid:</strong> {result.valid ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Possible:</strong> {result.possible ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Location:</strong> {result.location}</p>
          <p><strong>Carrier:</strong> {result.carrier}</p>
          <p><strong>Line Type:</strong> {result.line_type}</p>
        </div>
      )}

      {!loading && result?.error && (
        <p className="error-text">❌ {result.error}</p>
      )}

      {!loading && !result && (
        <p className="hint-text">Enter a phone number and click search.</p>
      )}
    </div>
  );
};

export default PhoneSearch;
