import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Search.css';
import { jsPDF } from 'jspdf';

const Search = () => {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sites, setSites] = useState([]);
  const [category, setCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/sites/`)
      .then(res => setSites(res.data))
      .catch(err => console.error('Site load failed:', err));
  }, []);

  const handleSearch = async () => {
    if (!username.trim()) return;
    setLoading(true);
    setSearched(false);
    try {
      const res = await axios.post('http://localhost:8000/api/username-osint/', { username });
      setResults(res.data.results);
      setSearched(true);
    } catch (err) {
      console.error('Search failed:', err);
    }
    setLoading(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`Username OSINT Report for: ${username}`, 10, 10);
    results.forEach((r, i) => {
      doc.text(`${i + 1}. ${r.site}`, 10, 20 + i * 10);
    });
    doc.save(`${username}_osint_report.pdf`);
  };

  const extractSiteName = (url) => {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      return url;
    }
  };

  // Filter results by search and category
  const filteredResults = results
    .filter((item) => {
      const siteObj = sites.find(s => item.site.includes(s.url_template.replace('{username}', '')));
      if (!siteObj) return false;
      if (category !== 'all' && siteObj.category !== category) return false;
      if (!siteObj.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
    });

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
        {results.length > 0 && <button onClick={exportToPDF}>📄 Export PDF</button>}
      </div>

      {searched && (
        <>
          <div className="filters">
            <input
              type="text"
              placeholder="Search site name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="category-scroll">
              {[
                'all', 'social', 'developer', 'job', 'shopping', 'forum',
                'adult', 'video', 'education', 'travel', 'indian',
                'finance', 'blog', 'other'
              ].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={category === cat ? 'active' : ''}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <ul className="result-list">
            {filteredResults.map((item, idx) => (
              <li key={idx} className="result-item">
                <a href={item.site} target="_blank" rel="noopener noreferrer">
                  🟢 {extractSiteName(item.site)}
                </a>
              </li>
            ))}
          </ul>

          {filteredResults.length === 0 && (
            <p>No matching results found in this category or site name.</p>
          )}
        </>
      )}

      {loading && <p>⏳ Loading...</p>}
    </div>
  );
};

export default Search;
