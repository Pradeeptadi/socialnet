
import React, { useState } from 'react';
import axios from 'axios';
import './DomainSearch.css';

const DomainSearch = () => {
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = axios.post(`${process.env.REACT_APP_API}/api/domain-osint/`, { domain });
      setResult(res.data);
    } catch (err) {
      console.error('Search failed:', err);
      setResult({ error: 'Search failed. Check if the backend server is running.' });
    }

    setLoading(false);
  };

  const toArray = (value) => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === 'string') return [value];
    return [];
  };

  const formatDate = (input) => {
    if (!input) return 'N/A';
    const raw = Array.isArray(input) ? input[0] : input;
    const isoMatch = raw.match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    if (isoMatch) {
      const d = new Date(isoMatch[0]);
      return isNaN(d.getTime()) ? 'Invalid Date' : d.toLocaleString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    }

    const pythonMatch = raw.match(/\d{4},\s?\d{1,2},\s?\d{1,2},\s?\d{1,2}/);
    if (pythonMatch) {
      const parts = pythonMatch[0].split(',').map(n => parseInt(n));
      const d = new Date(parts[0], parts[1] - 1, parts[2], parts[3]);
      return d.toLocaleString('en-IN', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true
      });
    }

    return 'Invalid Date';
  };

  return (
    <div className="domain-container">
      <h2>🌐 Domain OSINT Lookup</h2>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Enter domain (e.g. example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />
        <button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {loading && <p className="loading">⏳ Running domain analysis...</p>}

      {result && !result.error && (
        <div className="results">
          <h3>📋 Results for: {result.domain}</h3>

          <div className="result-card">
            <h4 className="section-title">🧾 WHOIS</h4>
            <p><strong>Registrar:</strong> {result.whois?.registrar || 'N/A'}</p>
            <p><strong>Creation Date:</strong> {formatDate(result.whois?.creation_date)}</p>
            <p><strong>Expiration Date:</strong> {formatDate(result.whois?.expiration_date)}</p>
            <p><strong>Name Servers:</strong></p>
            <ul>
              {toArray(result.whois?.name_servers).map((ns, idx) => (
                <li key={idx}>{ns}</li>
              ))}
            </ul>
            <p><strong>Emails:</strong></p>
            <ul>
              {toArray(result.whois?.emails).map((email, idx) => (
                <li key={idx}>{email}</li>
              ))}
            </ul>
          </div>

          <div className="result-card">
            <h4 className="section-title">🧭 DNS Records</h4>
            {result.dns ? (
              <ul className="list-block">
                {Object.entries(result.dns).map(([recordType, values]) => (
                  <li key={recordType}>
                    <strong>{recordType}:</strong>
                    <ul>
                      {toArray(values).length > 0 ? toArray(values).map((val, idx) => (
                        <li key={idx}>{val}</li>
                      )) : <li>None</li>}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No DNS record found.</p>
            )}
          </div>

          <div className="result-card">
            <h4 className="section-title">🌍 IP Geolocation</h4>
            {result.ip_geolocation ? (
              <ul className="list-block">
                <li><strong>IP:</strong> {result.ip_geolocation.ip || 'N/A'}</li>
                <li><strong>ASN:</strong> {result.ip_geolocation.asn || 'N/A'}</li>
                <li><strong>Country:</strong> {result.ip_geolocation.country || 'Unknown'}</li>
                <li><strong>Organization:</strong> {result.ip_geolocation.org || result.ip_geolocation.description || 'N/A'}</li>
              </ul>
            ) : (
              <p>No geolocation info available.</p>
            )}
          </div>

          <div className="result-card">
            <h4 className="section-title">🔐 SSL Certificate</h4>
            {result.ssl && result.ssl.issuer ? (
              <ul className="list-block">
                <li><strong>Issuer:</strong> {result.ssl.issuer.organizationName || 'N/A'} ({result.ssl.issuer.countryName || 'N/A'})</li>
                <li><strong>Common Name:</strong> {result.ssl.subject?.commonName || 'N/A'}</li>
                <li><strong>Valid From:</strong> {formatDate(result.ssl.valid_from)}</li>
                <li><strong>Valid To:</strong> {formatDate(result.ssl.valid_to)}</li>
              </ul>
            ) : (
              <p>SSL certificate details not available.</p>
            )}
          </div>

          <div className="result-card">
            <h4 className="section-title">🛰 Subdomains</h4>
            {Array.isArray(result.subdomains) && result.subdomains.length > 0 ? (
              <ul className="list-block">
                {result.subdomains.map((sub, idx) => (
                  <li key={idx}>{sub}</li>
                ))}
              </ul>
            ) : (
              <p>{typeof result.subdomains === 'string' ? result.subdomains : 'No subdomains found.'}</p>
            )}
          </div>

          <div className="result-card">
            <h4 className="section-title">🚨 Blacklist Info</h4>
            {result.blacklist ? (
              <>
                <p><strong>Status:</strong> {result.blacklist.status || 'N/A'}</p>
                {result.blacklist.google_safe_browsing && (
                  <p>
                    <strong>Google Safe Browsing:</strong>{' '}
                    <a href={result.blacklist.google_safe_browsing} target="_blank" rel="noopener noreferrer">
                      View Report
                    </a>
                  </p>
                )}
              </>
            ) : (
              <p>No blacklist info found.</p>
            )}
          </div>

          <div className="result-card">
            <h4 className="section-title">🧩 Technology Stack</h4>
            {result.technologies && result.technologies.tech_stack ? (
              <p>{result.technologies.tech_stack}</p>
            ) : (
              <p>N/A — Technology stack not detected. Consider integrating Wappalyzer or BuiltWith API.</p>
            )}
          </div>
        </div>
      )}

      {result?.error && <p className="error-text">❌ {result.error}</p>}
    </div>
  );
};

export default DomainSearch;
