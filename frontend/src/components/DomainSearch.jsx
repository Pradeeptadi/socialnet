import React, { useState } from 'react';
import axios from 'axios';
import './DomainSearch.css'; // Optional styling

const DomainSearch = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!domain.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post('https://socialnet-backend.onrender.com/api/domain-osint/', {
        domain: domain,
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
      <h2>🌐 Domain OSINT Lookup</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter domain (e.g., example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && <p className="loading-text">⏳ Searching domain...</p>}

      {result && !result.error && (
        <div className="results-card">
          <h3>🔍 Domain Intelligence</h3>

          {result.whois && (
            <>
              <h4>📄 WHOIS Info</h4>
              <pre>{JSON.stringify(result.whois, null, 2)}</pre>
            </>
          )}

          {result.dns_records && (
            <>
              <h4>🧾 DNS Records</h4>
              <pre>{JSON.stringify(result.dns_records, null, 2)}</pre>
            </>
          )}

          {result.ssl_info && (
            <>
              <h4>🔐 SSL Info</h4>
              <pre>{JSON.stringify(result.ssl_info, null, 2)}</pre>
            </>
          )}

          {result.blacklist && (
            <>
              <h4>🚫 Blacklist Status</h4>
              <pre>{JSON.stringify(result.blacklist, null, 2)}</pre>
            </>
          )}

          {result.ip_geolocation && (
            <>
              <h4>🌍 IP Geolocation</h4>
              <pre>{JSON.stringify(result.ip_geolocation, null, 2)}</pre>
            </>
          )}

          {result.technologies && (
            <>
              <h4>🛠️ Technology Stack</h4>
              <pre>{JSON.stringify(result.technologies, null, 2)}</pre>
            </>
          )}
        </div>
      )}

      {!loading && result?.error && (
        <p className="error-text">❌ {result.error}</p>
      )}

      {!loading && !result && (
        <p className="hint-text">Enter a domain and click search.</p>
      )}
    </div>
  );
};

export default DomainSearch;
