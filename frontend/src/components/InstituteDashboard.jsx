import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function InstitutionDashboard() {
  const [assets, setAssets] = useState(null);
  const institution = "default";
const API_BASE = import.meta.env.VITE_API_BASE;

  useEffect(() => {
    fetch(`${API_BASE}/api/institution/get-assets/${institution}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAssets(data.assets);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "40px", color: "white" }}>
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        Institution Dashboard
      </h1>

      {!assets ? (
        <p>Loading assets...</p>
      ) : (
        <div style={{ display: "flex", gap: "30px" }}>
          
          {/* ----------- TEMPLATE CARD ----------- */}
          <div
            style={{
              width: "300px",
              backgroundColor: "#0f172a",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3>Certificate Template</h3>
            {assets.template ? (
              <img
                src={`${API_BASE}/${assets.template}`}
                alt="Template"
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "contain",
                  marginTop: "10px",
                  background: "#1e293b",
                  padding: "10px",
                  borderRadius: "8px",
                  
                }}
                
              />
            ) : (
              <p>No template uploaded</p>
            )}

            <Link to="/institution/upload">
              <button
                style={{
                  marginTop: "15px",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#2563eb",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                  cursor:"pointer"
                }}
              >
                Edit / Replace
              </button>
            </Link>
          </div>

          {/* ----------- SEAL CARD ----------- */}
          <div
            style={{
              width: "300px",
              backgroundColor: "#0f172a",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
             
            }}
          >
            <h3>Official Seal</h3>
            {assets.seal ? (
              <img
                src={`${API_BASE}/${assets.seal}`}
                alt="Seal"
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "contain",
                  marginTop: "10px",
                  background: "#1e293b",
                  padding: "10px",
                  borderRadius: "8px",
                  
                }}
              />
            ) : (
              <p>No seal uploaded</p>
            )}

            <Link to="/institution/upload">
              <button
                style={{
                  marginTop: "15px",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#2563eb",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                   cursor:"pointer"
                }}
              >
                Edit / Replace
              </button>
            </Link>
          </div>

          {/* ----------- SIGNATURE CARD ----------- */}
          <div
            style={{
              width: "300px",
              backgroundColor: "#0f172a",
              padding: "20px",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            }}
          >
            <h3>Official Signature</h3>
            {assets.signature ? (
              <img
                src={`${API_BASE}/${assets.signature}`}
                alt="Signature"
                style={{
                  width: "100%",
                  height: "160px",
                  objectFit: "contain",
                  marginTop: "10px",
                  background: "#1e293b",
                  padding: "10px",
                  borderRadius: "8px",
                }}
              />
            ) : (
              <p>No signature uploaded</p>
            )}

            <Link to="/institution/upload">
              <button
                style={{
                  marginTop: "15px",
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#2563eb",
                  border: "none",
                  color: "white",
                  borderRadius: "8px",
                   cursor:"pointer"
                }}
              >
                Edit / Replace
              </button>
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
