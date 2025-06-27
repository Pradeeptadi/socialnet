import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';  // Optional: Create this for styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2>🔎 TraceIntel OSINT</h2>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/username-osint">Username OSINT</Link></li>
       <li><Link to="/phone-osint">Phone Number OSINT</Link></li>
       <li><Link to="/domain-osint">Domain OSINT</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
