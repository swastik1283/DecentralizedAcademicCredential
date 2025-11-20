import React from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav";
import Homepage from "./pages/HomePage";
import UploadPage from "./pages/UploadPage";
import PublicVerifyPage from "./pages/PublicVerificationPage";
import InstitutionDashboard from "./components/InstituteDashboard";
import InstitutionUpload from "./components/InstituteUpload";
import StudentLookup from "./pages/StudentLookup";
export default function App() {
  return (
    <div>
      <Nav />
      <main style={{ padding: "28px 20px" }}>
        <Routes>
          <Route path="/" element={<Homepage />} />
        <Route path="/institution" element={<InstitutionDashboard />} />
      <Route path="/student/lookup" element={<StudentLookup />} />

      <Route path="/institution/upload" element={<InstitutionUpload />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/verify/:hash" element={<PublicVerifyPage />} />
        </Routes>
      </main>
    </div>
  );
}
