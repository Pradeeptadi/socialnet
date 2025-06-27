import React from 'react';

const Home = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome to TraceIntel</h1>
      <p>This is your all-in-one OSINT tool. Choose a feature from the navigation bar to begin:</p>
      <ul>
        <li>🔍 Username OSINT</li>
        <li>📞 Phone Number OSINT (coming soon)</li>
        <li>📧 Email OSINT (coming soon)</li>
        <li>🖼️ Metadata Extraction (coming soon)</li>
        <li>🌐 Social Media Tracker (coming soon)</li>
      </ul>
    </div>
  );
};

export default Home;
