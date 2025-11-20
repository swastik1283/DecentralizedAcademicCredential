import { execFile } from "child_process";
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const PYTHON_BIN =
  "/Users/swastikkotwal/Desktop/HackStack/ai-service/.venv-ai/bin/python";

// Path to Python script
const AI_SCRIPT = path.join(__dirname, "../../ai-service/ai_service.py");


export const runAIModel = (uploadedPath, templatePath, sealPath, sealBBox) => {
  return new Promise((resolve, reject) => {
    execFile(
   PYTHON_BIN,
      [
        AI_SCRIPT,
        "--verify",
        "--uploaded", uploadedPath,
        "--template", templatePath,
        "--seal", sealPath,
        "--seal-bbox", sealBBox
      ],
      { cwd: process.cwd() },
      (err, stdout, stderr) => {
        if (err) {
          return reject("AI model failed: " + stderr);
        }
        try {
          resolve(JSON.parse(stdout));
        } catch (jsonErr) {
          console.error("Invalid JSON from Python:", stdout);
          reject("Invalid JSON from AI model");
        }
       
    }

    );
  });
};
