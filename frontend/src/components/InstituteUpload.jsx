import { useState } from "react";

export default function InstitutionUpload() {
  const [template, setTemplate] = useState(null);
  const [seal, setSeal] = useState(null);
  const [signature, setSignature] = useState(null);

  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [previewSeal, setPreviewSeal] = useState(null);
  const [previewSignature, setPreviewSignature] = useState(null);

  const [result, setResult] = useState(null);
const API_BASE = import.meta.env.VITE_API_BASE;

  const onFileChange = (e, setter, previewSetter) => {
    const file = e.target.files[0];
    if (!file) return;

    setter(file);
    previewSetter(URL.createObjectURL(file)); // show preview
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    fd.append("institution", "default");
    if (template) fd.append("template", template);
    if (seal) fd.append("seal", seal);
    if (signature) fd.append("signature", signature);

    const res = await fetch("http://localhost:5001/api/institution/upload-assets", {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", color: "white" }}>
      <h2 style={{ marginBottom: 20 }}>Upload Official Certificate Assets</h2>

      <form
        onSubmit={handleUpload}
        style={{ display: "flex", flexDirection: "column", gap: 20 }}
      >
        {/* TEMPLATE */}
        <div>
          <p>Certificate Template:</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              onFileChange(e, setTemplate, setPreviewTemplate)
            }
          />

          {previewTemplate && (
            <img
              src={previewTemplate}
              alt="template preview"
              style={{
                marginTop: 10,
                width: "100%",
                maxHeight: 200,
                objectFit: "contain",
                background: "#0f172a",
                padding: 10,
                borderRadius: 8,
              }}
            />
          )}
        </div>

        {/* SEAL */}
        <div>
          <p>Official Seal:</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onFileChange(e, setSeal, setPreviewSeal)}
          />

          {previewSeal && (
            <img
              src={previewSeal}
              alt="seal preview"
              style={{
                marginTop: 10,
                width: 150,
                height: 150,
                objectFit: "contain",
                background: "#0f172a",
                padding: 10,
                borderRadius: "50%",
              }}
            />
          )}
        </div>

        {/* SIGNATURE */}
        <div>
          <p>Signature (optional):</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              onFileChange(e, setSignature, setPreviewSignature)
            }
          />

          {previewSignature && (
            <img
              src={previewSignature}
              alt="signature preview"
              style={{
                marginTop: 10,
                width: 200,
                height: 100,
                objectFit: "contain",
                background: "#0f172a",
                padding: 10,
                borderRadius: 8,
              }}
            />
          )}
        </div>

        <button
          type="submit"
          style={{
            cursor: "pointer",
            padding: 12,
            background: "#2563eb",
            border: "none",
            borderRadius: 8,
            color: "white",
            fontSize: 16,
          }}
        >
          Upload & Save
        </button>
      </form>

    {result?.success && (
  <div
    style={{
      marginTop: 20,
      padding: "12px 18px",
      background: "#063e22",
      color: "#4ade80",
      border: "1px solid #22c55e",
      borderRadius: 8,
      fontWeight: 600,
    }}
  >
    ✔ Successfully Updated!
  </div>
)}

{result && !result.success && (
  <div
    style={{
      marginTop: 20,
      padding: "12px 18px",
      background: "#401010",
      color: "#ff6b6b",
      border: "1px solid #ff4c4c",
      borderRadius: 8,
      fontWeight: 600,
    }}
  >
    ✖ Update Failed — {result.message || "Unknown Error"}
  </div>
)}

    </div>
  );
}
