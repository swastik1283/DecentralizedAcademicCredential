VeriCert – Decentralized Academic Certificate Verification

VeriCert is a full-stack platform that helps institutions,students and recruiters verify academic certificates instantly using:
        -AI(OCR+template similarity+seal matching)
        -Ethereum Blockchain(tamper-proof certificate hashing)
        -React Frontend
        -Node.js Backend
        -Python microservice for AI Verification
        
The Goal is Simple:
Make all the fake certificate useless by providing fast,automated,trustless verification


Features:

1->Institution Panel
     -Upload Official certificate Template
     -Uplaod Seal and Signature Reference
     -These uploads become the reference standard which will be used by AI for verification

2->Student Panel :
     -View Certificate
     -Share Certificate 
     -Download the Certificate
     (No upload done by Student , Only viewing+sharing)

3->Verifier/Recruiter:
    -Upload the candidate's certificate they received 
    -AI Performs:
          -OCR text extraction
          -Template similarity scoring
          -Seal logo region matching
          -Layout Comparison
    -Backend Computes an authenticity score
    -Ethereum check integrity if the certficate hash is stored\
    -Returns Final Verdict:
       Very Likely Genuine/Needs Manual Review/Likely Forged


AI Engine (Python Microservice)

The python service performs:
      -Template Matching: Compares layout similarity using computer vision (CV)
      -Seal Verification: Matches Certificate seals against the offical seal
      -Signature Region Checking:Veify the Signature template

      Output:
         Gives the final AIscore based on template ,seal and signature matching


BlockChain Layer (Ethereum)

Only the SHA-256 is stored in Blockchain- not the full certficate image 
Benefits:
      -Immutable Proof
      -Integrity Validation
      -Trustless Verification
Smart contract stores certificate hashes permanently 


Tech Stack :

   -FrontEnd:React(Vite)
   -BackEnd:Node.js(Express)
   -AI Engine:Python
   -Blockchain:Ethereum+Ethers.js
   -Storage:LocalDB(Json) for Prototype
   

Project Structure

    /frontend          → React UI
    /backend           → Node.js server (API, blockchain, AI bridge) 
    /ai-service        → Python microservice (OCR + template matching)
    /contract          → Solidity smart contract

Setup and Installation

 Frontend

      cd frontend
      npm install
      npm run dev

 Backend 

     cd backend
     npm install
     npm run server
 
 AI Service

     cd ai-service
     python3 -m venv .venv
     source .venv/bin/activate

 Smart contract 

       cd contract
       npm install 
       npx hardhat run scripts/deploy.js


Working Flow

     -Verifier uploads certificate
     -Node sends file → Python AI service
     -AI returns:
          -Seal match score
          -Template match score
          -OCR text extraction
          -Final authenticity score
     -Final verdict returned

    -After Verdict is returned if the certificate is uploaded then :
               -Backend computes SHA-256 hash 
               -Check if hash already exists on Ethereum
               -If exists -> skip storing (Certificate already registered)
               -If not exists->stores the hash on Ethereum
               -Save Data to local JSON DB

     -Student can view share and download the certificate by using the unique txHash generated after it is uploaded on blockchain

Why VeriCert?
      
      -Eliminates manual verification
      -AI catches layout & seal forgeries
      -Blockchain ensures tamper-proof authenticity
      -Works for universities, HR teams, and students
  

📜 License

MIT

     
