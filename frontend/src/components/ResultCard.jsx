import React, { useEffect, useState } from "react";

export default function ResultCard({ result }) {
    const API_BASE = import.meta.env.VITE_API_BASE;

  if (!result) return null;

  const {
    ocr,
    aiScore,
    finalScore,
    verdict,
    fileUrl,
    hash,
    blockchainTx,
  } = result;

  const score = Math.round(finalScore ?? aiScore?.finalScore ?? 0);

  const color = score > 75 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";

  // ---- Fully Dynamic Animation for bar ----
  const [width, setWidth] = useState("0%");

  useEffect(() => {
    // Reset bar instantly when a new result arrives
    setWidth("0%");

    const timeout = setTimeout(() => {
      setWidth(`${score}%`);
    }, 200);

    return () => clearTimeout(timeout);
  }, [result]); 

  return (
    <div style={{ width: "100%", padding: 10 }}>
      
      {/* ---------- PROGRESS BAR ---------- */}
      <div style={{ width: "100%", marginBottom: 20 }}>
        <div
          style={{
            textAlign: "center",
            fontSize: 26,
            fontWeight: 700,
            color: "#dff7ff",
          }}
        >
          {score}%
        </div>

        <div
          style={{
            width: "100%",
            height: 14,
            background: "#1e293b",
            borderRadius: 10,
            marginTop: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width,
              height: "100%",
              background: color,
              borderRadius: 10,
              transition: "width 1s ease-in-out",
            }}
          />
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 10,
            fontWeight: 600,
            color: "#fff",
            fontSize: 16,
          }}
        >
          {verdict}
        </div>
      </div>

      {/* ---------- CERTIFICATE PREVIEW ---------- */}
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 13, color: "#b8d2f0" }}>
          Certificate Preview
        </div>

        <img
          src={`${API_BASE}/${fileUrl}`}
          alt="certificate"
          style={{
            width: "100%",
            borderRadius: 8,
            marginTop: 8,
            background: "#0b152b",
            padding: 4,
            objectFit: "contain",
            maxHeight: 260,
          }}
        />
      </div>

      {/* ---------- OCR EXTRACT ---------- */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 13, color: "#b8d2f0" }}>OCR Extract</div>

        <pre
          style={{
            background: "#071227",
            color: "#bfe9ff",
            padding: 10,
            borderRadius: 8,
            marginTop: 6,
            fontSize: 13,
            maxHeight: 130,
            overflowY: "auto",
            overflowX: "hidden",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {ocr}
        </pre>
      </div>

      {/* ---------- HASH & TRANSACTION ---------- */}
      <div
        style={{
          marginTop: 14,
          padding: 10,
          background: "#0e1a33",
          borderRadius: 8,
          fontSize: 13,
        }}
      >
        <div style={{ marginBottom: 6 }}>
          <strong>Hash:</strong>{" "}
          <code style={{ color: "#9fc4ff", wordBreak: "break-all" }}>
            {hash}
          </code>
        </div>

        {blockchainTx ? (
          <div>
            <strong>Tx:</strong>{" "}
            <span style={{ color: "#9fc4ff", wordBreak: "break-all" }}>
              {blockchainTx}
            </span>
          </div>
        ) : (
          <div style={{ color: "#777" }}>
            Not registered on blockchain yet
          </div>
        )}
      </div>
    </div>
  );
}
