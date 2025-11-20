import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_BASE || "http://localhost:5001";

export default function PublicVerifyPage() {
  const { hash } = useParams();
  const [data, setData] = useState({ loading: true });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/api/certificate/lookup/${hash}`);
        const json = await res.json();

        setData({
          loading: false,
          found: json.success,
          cert: json.certificate || null,
        });
      } catch (err) {
        setData({ loading: false, error: err.message });
      }
    }

    load();
  }, [hash]);

  if (data.loading) return <div className="container">Loading...</div>;
  if (data.error) return <div className="container">Error: {data.error}</div>;

  if (!data.found)
    return (
      <div className="container">
        <h2>❌ Certificate Not Found</h2>
        <p>No record exists on blockchain for hash:</p>
        <code>{hash}</code>
      </div>
    );

  const cert = data.cert;

  return (
    <div className="container">
      <div className="card">
        <h2>Verified Certificate</h2>

       

        <div style={{ marginTop: 5 ,wordBreak:"break-word"}}>
          <strong>Registered Tx:</strong>{" "}
          <code>{cert.blockchainTx || hash}</code>
        </div>

        {/* Certificate Image */}
        <img
          src={`${API}/api/certificate/image/${hash}`}
          alt="certificate"
          style={{
            width: "90%",
            maxWidth: 700,
            borderRadius: 10,
            marginTop: 20,
            background: "#0b152b",
            padding: 5,
          }}
        />

        
      </div>
    </div>
  );
}
