import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="app-nav">
      <div className="nav-container">
        
        {/* Brand LEFT aligned */}
        <div className="brand">
          <div className="logo">VC</div>
          <div>
            <div className="brand-title">VeriCert</div>
            <div className="brand-sub">Academic Credential Verification</div>
          </div>
        </div>
<div>
    </div>
        {/* Desktop Nav Links */}
        <nav className={`nav-links ${open ? "open" : ""}`} style={{justifyContent:"center",alignContent:"center"}}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/upload" onClick={() => setOpen(false)}>Upload</Link>
        </nav>

       
      </div>
    </header>
  );
}
