import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

const router = express.Router();

const upload = multer({ dest: "uploads/templates/" });



router.post(
  "/upload-assets",
  upload.fields([
    { name: "template", maxCount: 1 },
    { name: "seal", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const institutionId = req.body.institution || "default";
      const dataFile = path.join("data/institutions.json");
      const makeRelative = (p) => p.replace(process.cwd() + "/", "");

         if (!fs.existsSync(dataFile)) {
        fs.mkdirSync(path.dirname(dataFile), { recursive: true });
        fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
      }
      const templates = JSON.parse(fs.readFileSync(dataFile));

     templates[institutionId] = {
        template: req.files.template
  ? makeRelative(req.files.template[0].path)
  : templates[institutionId]?.template,
        seal: req.files.seal
          ? makeRelative(req.files.seal[0].path)
          : templates[institutionId]?.seal,
        signature: req.files.signature
          ? makeRelative(req.files.signature[0].path)
          : templates[institutionId]?.signature,
      };
      fs.writeFileSync(dataFile, JSON.stringify(templates, null, 2));

      res.json({
        success: true,
        message: "Institution templates updated",
        data: templates[institutionId],
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Upload failed" });
    }
  }
);

router.get("/get-assets/:institution", (req, res) => {
  const institutionId = req.params.institution;
  const dataFile = path.join("data/institutions.json");

  if (!fs.existsSync(dataFile)) {
    return res.json({ success: true, assets: {} });
  }

  const templates = JSON.parse(fs.readFileSync(dataFile));

  res.json({
    success: true,
    assets: templates[institutionId] || {}
  });
});

export default router;