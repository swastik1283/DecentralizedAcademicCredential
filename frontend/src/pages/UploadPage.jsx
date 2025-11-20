import React, { useState } from "react";
import CertificateUpload from "../components/CertificateUpload";
import ResultCard from "../components/ResultCard";

export default function UploadPage() {
  const [result, setResult] = useState(null);
  const [approved, setApproved] = useState(false);

  const API_BASE = import.meta.env.VITE_API_BASE;

  // Register certificate to blockchain
  const registerCertificate = async () => {
    if (!result) return alert("No certificate to register");

    try {
      const res = await fetch(`${API_BASE}/api/certificate/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      });

      const data = await res.json();
      if (!data.success) return alert("Failed to register");

      setResult((prev) => ({ ...prev, blockchainTx: data.blockchainTx }));
      setApproved(true);
      alert("Certificate successfully added to blockchain!");
    } catch (err) {
      alert("Register failed");
    }
  };

  // Handle new result
  const handleNewResult = (data) => {
    setApproved(false);
    setResult(data);
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* MAIN FLEX GRID */}
      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          display: "flex",
          gap: "40px",
          padding: "20px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SECTION (dynamic width) */}
        <div style={{ flex: "1 1 600px", minWidth: "380px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "26px",
              width: "100%",
            }}
          >
            <div>
              <h2 style={{ marginBottom: 6, fontSize: 26, fontWeight: 700 }}>
                Upload & Verify Certificate
              </h2>

              <p style={{ opacity: 0.75, fontSize: 16, lineHeight: "22px" }}>
                Upload a certificate to check authenticity using AI. <br />
                You can officially register it on blockchain after verification.
              </p>
            </div>

            {/* Upload Card */}
            <div
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                backdropFilter: "blur(12px)",
                padding: "28px",
                borderRadius: "16px",
                boxShadow: "0 6px 28px rgba(0,0,0,0.25)",
                transition: "0.3s ease",
              }}
            >
              <CertificateUpload onResult={handleNewResult} />
            </div>
          </div>

          {/* Approve / Reject Buttons */}
          {result && !approved && (
            <div
              style={{
                marginTop: 24,
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              {/* APPROVE BUTTON */}
              <button
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  background: "linear-gradient(90deg,#22c55e,#16a34a)",
                  border: "none",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "0.25s",
                }}
                onClick={registerCertificate}
              >
                ✔ Approve & Register
              </button>

              {/* REJECT BUTTON */}
              <button
                style={{
                  flex: 1,
                  padding: 14,
                  borderRadius: 12,
                  background: "linear-gradient(90deg,#ef4444,#b91c1c)",
                  border: "none",
                  color: "white",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "0.25s",
                }}
                onClick={() => {
                  setResult(null);
                  setApproved(false);
                }}
              >
                ✖ Reject
              </button>
            </div>
          )}

          {/* APPROVED MESSAGE */}
          {approved && (
            <div style={{ marginTop: 20, color: "lime", fontWeight: 600 }}>
              Certificate successfully registered!
            </div>
          )}
        </div>

        {/* RIGHT SIDE — QUICK PREVIEW */}
        <aside style={{ flex: "0 1 350px", minWidth: "300px" }}>
          <div
            className="card"
            style={{
              background: "rgba(255,255,255,0.04)",
              padding: 20,
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
              width: "100%",
            }}
          >
            <h4 style={{ marginBottom: 10, fontSize: 18, fontWeight: 600 }}>
              Quick Preview
            </h4>

            {result ? (
              <ResultCard key={JSON.stringify(result)} result={result} />
            ) : (
              <p style={{ opacity: 0.5, fontSize: 14 }}>
                After verification, the result will appear here.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
