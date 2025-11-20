import fs from "fs";
import path from "path";
import Tesseract from "tesseract.js";
import crypto from "crypto";
import {runAIModel} from "../services/aiServiceCaller.js";
import { sendHashToContract } from "../services/Blockchain.js";
import  {extractText }from "../services/ocrService.js"


const verdictFromScore = (score) => {
  if (score > 60) return "Very Likely Genuine";
  if (score >= 50) return "Needs Manual Review";
  return "Likely Forged";
};


export const processCertificate=async(req,res)=>{
    try{
        const filePath=req.file.path;
        const fileUrl=filePath;


        //sha256 hash 
        const fileBuffer = fs.readFileSync(filePath);
    const fileHash = crypto
      .createHash("sha256")
      .update(fileBuffer)
      .digest("hex");


        // ocr 
        const extractedText= await extractText(filePath);

        const instituteData = JSON.parse(
  fs.readFileSync(path.join("data/institutions.json"))
);

const active=instituteData["default"];

        const aiResult = await runAIModel(
      filePath,
     active.template,   //temnplate
     active.seal,       // Seal
      "1470,160,420,420"              // Seal bounding box
    );
     
    const finalScore=aiResult?.finalScore || 0;
    const verdict=verdictFromScore(finalScore);
        

        const payload=JSON.stringify({
            text:extractedText,
               ai: aiResult,
               verdict,
               fileUrl
        });

        //store hash on ethereum

        const txhashing=await sendHashToContract(fileHash);

        res.json({
            success:true,
            ocr:extractedText,
            aiScore: aiResult,
            finalScore,
            verdict,
            fileUrl,
            hash:fileHash,
            blockchainTx:txhashing
        });


        const certDB = JSON.parse(fs.readFileSync("data/certificates.json", "utf-8"));

certDB[txhashing] = {
    hash:fileHash,
    fileUrl,
    aiScore: aiResult,
    ocr: extractedText,
    timestamp: Date.now()
};

fs.writeFileSync("data/certificates.json", JSON.stringify(certDB, null, 2));

    }
    catch(error){

        console.log(error);
        res.status(500).json({success:false,message:"Server Error"});    }
}