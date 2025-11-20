import { useState } from "react";
import {QRCodeSVG} from "qrcode.react";

const API = import.meta.env.VITE_API_BASE;
const Front_API=import.meta.env.VITE_FRONTEND_API_BASE;
export default function StudentLookup() {
  const [tx, setTx] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const lookup = async () => {
    if (!tx) return;

    setLoading(true);
    setData(null);

    try {
      const res = await fetch(`${API}/api/certificate/lookup/${tx}`);
      const json = await res.json();
      if (!json.success) return alert("Certificate not found");

      setData(json.certificate);
    } catch (e) {
      alert("Error fetching certificate");
    }

    setLoading(false);
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = `${API}/${data.fileUrl}`; // serve via /uploads
    link.download = "certificate.png";
    link.click();
  };

  const publicURL = `${Front_API}/verify/${tx}`;

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "20px" }}>
      <h2 style={{ marginBottom: 20 }}>Student Certificate Lookup</h2>

      <input
        placeholder="Enter  Unique Txhash"
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
        onChange={(e) => setTx(e.target.value)}
      />

      <button onClick={lookup} style={{ width: "100%", padding: 10,cursor:"pointer" }}>
        {loading ? "Searching..." : "Search"}
      </button>

      {data && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            background: "#0f172a",
            borderRadius: 12,
            color: "white",
          }}
        >
          <h3>Certificate Details</h3>

          {/* IMAGE PREVIEW */}
          {data.fileUrl && (
            <div style={{ marginTop: 15 }}>
              <img
                src={`${API}/${data.fileUrl}`}
                alt="Certificate"
                style={{
                  width: "100%",
                  maxHeight: 400,
                  objectFit: "contain",
                  borderRadius: 12,
                  background: "#1e293b",
                  padding: 10,
                }}
              />
            </div>
          )}

          {/* QR CODE */}
          <div
            style={{
              marginTop: 20,
              padding: 15,
              background: "#1e293b",
              borderRadius: 12,
              textAlign: "center",
            }}
          >
            <h4>Verification QR</h4>
            <QRCodeSVG value={publicURL} size={160} bgColor="#fff" fgColor="#000" />
            <p style={{ marginTop: 10, fontSize: 13,wordBreak: "break-all" }}>
              Scan to verify: <br /> {publicURL}
            </p>
          </div>

          {/* DOWNLOAD BUTTON */}
          <button
            onClick={downloadImage}
            style={{
              marginTop: 20,
              width: "100%",
              padding: 12,
              background: "#2563eb",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontWeight: "bold",
            }}
          >
            Download Certificate
          </button>

   
          
        </div>
      )}
    </div>
  );
}
