import React from "react";
import { Link } from "react-router-dom";

export default function Homepage() {

  return (
    <div className="container" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
      {/* Internal CSS injected as a <style> tag */}
      <style>
        {`
          .hero {
            display: flex;
            gap: 28px;
            align-items: center;
            margin: 36px auto;
            padding: 32px;
            border-radius: 14px;
            background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
            box-shadow: 0 10px 30px rgba(2,6,23,0.6);
            flex-wrap: wrap;
          }
          .hero-left {
            flex: 1 1 280px;
            min-width: 240px;
          }
          .preview {
            width: 420px;
            max-width: 100%;
            padding: 16px;
            border-radius: 10px;
            background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
            border: 1px solid rgba(255,255,255,0.03);
            box-sizing: border-box;
          }
          .preview img {
            width: 100%;
            border-radius: 8px;
            object-fit: cover;
            display: block;
          }
          .hero-title {
            font-size: 2.1rem;
            line-height: 1.05;
            margin-bottom: 12px;
            color: #eaf2ff;
          }
          .hero-sub {
            color: #94a3b8;
            margin-bottom: 18px;
            font-size: 15px;
            max-width: 620px;
          }
          .role-grid {
            display: flex;
            gap: 18px;
            margin-top: 8px;
            flex-wrap: wrap;
          }
          .role-card {
            background: rgba(255,255,255,0.03);
            border-radius: 12px;
            padding: 18px;
            min-width: 210px;
            flex: 1 1 200px;
            box-shadow: 0 6px 18px rgba(2,6,23,0.6);
            border: 1px solid rgba(255,255,255,0.03);
            margin-bottom: 12px;
          }
          .role-card h4 { margin-bottom: 8px; color: #fff; }
          .role-card p { color: #94a3b8; font-size: 13px; margin-bottom: 12px; }
          .role-cta {
            display: inline-block;
            background: linear-gradient(90deg,#3b82f6,#06b6d4);
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
          }
          .page-section {
            margin: 28px auto;
            max-width: 1100px;
            padding: 0 20px;
          }
          .card {
            background: rgba(255,255,255,0.04);
            padding: 18px;
            border-radius: 12px;
            border: 1px solid rgba(255,255,255,0.03);
          }
          @media (max-width: 900px) {
            .hero {
              flex-direction: column;
              align-items: stretch;
              padding: 18px;
            }
            .role-grid {
              flex-direction: column;
            }
            .preview {
              width: 100%;
            }
          }
        `}
      </style>
      {/* Main content unchanged */}
      <section className="hero">
        <div className="hero-left">
          <h1 className="hero-title">Secure, Decentralized Certificate Verification</h1>
          <p className="hero-sub">
            Verify academic credentials instantly using AI authenticity scoring and immutable blockchain proof.
            Trusted by universities and recruiters — share a verification link or QR with employers.
          </p>
          <div className="role-grid">
            <div className="role-card">
              <h4>Institution</h4>
              <p className="muted">Issue & upload certificates. Save proofs to blockchain for immutable integrity.</p>
              <Link to="/institution" className="role-cta">Issue Certificate</Link>
            </div>
            <div className="role-card">
              <h4>Student</h4>
              <p className="muted">View, download and share your verified certificate via link or QR directly on profiles.</p>
              <Link to="/student/lookup" className="role-cta">View Certificates</Link>
            </div>
            <div className="role-card">
              <h4>Verifier</h4>
              <p className="muted">Quickly validate certificate authenticity using AI scores and on-chain proof.</p>
              <Link to="/upload" className="role-cta">Verify Now</Link>
            </div>
          </div>
        </div>
        
      </section>
      <section className="page-section">
        <div className="card">
          <h3 style={{marginBottom:8}}>Why this matters</h3>
          <div className="small">
            Academic fraud delays admissions and hiring. VeriCert combines AI-driven anomaly detection (layout, seal, signature)
            with Ethereum immutability so verifiers can check authenticity in seconds.
          </div>
        </div>
      </section>
    </div>
  );
}
