import React, { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

const API_BASE = import.meta.env.VITE_API_BASE;
const Front_API=import.meta.env.VITE_FRONTEND_API_BASE;
export default function CertificateUpload({ onResult }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [verifyUrl, setVerifyUrl] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");
    const fd = new FormData();
    fd.append("certificate", file);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/certificate/verify-only`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      onResult?.(data);

      // Build QR link using certificate hash
      const url = `${Front_API}/verify/${data.hash}`;
      setVerifyUrl(url);

      return data;
    } catch (err) {
      console.error(err);
      alert("Upload failed — check backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 540,
        margin: "0 auto",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.03)",
        borderRadius: 12,
        padding: 20,
        boxShadow: "0 6px 18px rgba(2,6,23,0.20)",
      }}
    >
      <form
        onSubmit={handleVerify}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <label style={{ fontSize: 14, color: "#bcd3f0", fontWeight: 500 }}>
          Select certificate (image / PDF)
        </label>
        <input
          type="file"
          accept="image/*,application/pdf"
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid #334155",
            background: "#0f172a",
            color: "#e6eef8",
            fontSize: 14,
          }}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button
            type="submit"
            style={{
              flex: 1,
              borderRadius: 10,
              padding: "10px 20px",
              background: "linear-gradient(90deg,#22c55e,#16a34a)",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "opacity 0.2s",
            }}
            disabled={loading}
          >
            {loading ? "Verifying…" : "Upload & Verify"}
          </button>
        </div>
      </form>

      {/* QR BLOCK */}
     
    </div>
  );
}
