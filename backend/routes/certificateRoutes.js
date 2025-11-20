import express from "express";
import multer from "multer";
import { processCertificate } from "../controllers/certificateController.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { extractText } from "../services/ocrService.js";
import { runAIModel } from "../services/aiServiceCaller.js";
import { sendHashToContract } from "../services/Blockchain.js";

const router = express.Router();

// Multer for file uploads
const upload = multer({
  dest: "uploads/",
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are supported for OCR right now"));
    }
  }
});


// Route: POST /api/certificate/verify
router.post(
  "/verify-only",
  upload.single("certificate"),
  async (req, res) => {
    try {
      console.log("🔥 Verify-only route hit");

      const filePath = req.file.path;

      const fileBuffer = fs.readFileSync(filePath);
      const fileHash = crypto.createHash("sha256").update(fileBuffer).digest("hex");

      const extractedText = await extractText(filePath);

      const instituteData = JSON.parse(fs.readFileSync("data/institutions.json"));
      const active = instituteData["default"];

      const aiResult = await runAIModel(
        filePath,
        active.template,
        active.seal,
        "1470,160,420,420"
      );

      const finalScore = aiResult.finalScore || 0;
      const verdict = finalScore > 60 ? "Very Likely Genuine" :
                      finalScore >= 50 ? "Needs Manual Review" :
                      "Likely Forged";

      return res.json({
        success: true,
        mode: "verify-only",
        fileUrl: filePath,
        hash: fileHash,
        aiScore: aiResult,
        finalScore,
        verdict,
        ocr: extractedText
      });

    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server Error" });
    }
  }
);


router.post("/register", async (req, res) => {
  try {
    const { hash, fileUrl, ocr, aiScore, finalScore } = req.body;

    const tx = await sendHashToContract(hash);

    const dbPath = "data/certificates.json";

    // ensure DB exists
    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync("data", { recursive: true });
      fs.writeFileSync(dbPath, "{}");
    }

    const certDB = JSON.parse(fs.readFileSync(dbPath, "utf-8"));

    certDB[tx] = {
      hash,
      fileUrl,
      ocr,
      aiScore,
      finalScore,
      timestamp: Date.now(),
    };

    fs.writeFileSync(dbPath, JSON.stringify(certDB, null, 2));

    res.json({
      success: true,
      message: "Certificate registered",
      blockchainTx: tx,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Registration failed" });
  }
});




router.get("/lookup/:tx", (req, res) => {
  const tx = req.params.tx;
  const dbPath = "data/certificates.json";

  if (!fs.existsSync(dbPath)) {
    return res.status(404).json({ success: false, message: "DB Missing" });
  }

  let certDB = {};
  try {
    certDB = JSON.parse(fs.readFileSync(dbPath));
  } catch (e) {
    return res.status(500).json({ success: false, message: "Invalid DB JSON" });
  }

  if (!certDB[tx]) {
    return res
      .status(404)
      .json({ success: false, message: "Certificate not found" });
  }

  return res.json({
    success: true,
    certificate: certDB[tx],
  });
});
export default router;



