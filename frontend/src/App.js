import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Search from './components/Search';  // Your username OSINT component
import PhoneOSINT from './components/PhoneSearch';
import DomainSearch from './components/DomainSearch';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/username-osint" element={<Search />} />
          <Route path="/phone-osint" element={<PhoneOSINT />} />
          <Route path="/domain-osint" element={<DomainSearch />}/>
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;
