# VeriCert – Decentralized Academic Certificate Verification

VeriCert is a full-stack platform that helps institutions, students, and recruiters verify academic certificates instantly using:

- **AI** (OCR + template similarity + seal matching)  
- **Ethereum Blockchain** (tamper-proof certificate hashing)  
- **React Frontend**  
- **Node.js Backend**  
- **Python Microservice** for AI verification  

### 🎯 Goal  
Make fake certificates useless by providing fast, automated, trustless verification.

---

## 🚀 Features

### **1. Institution Panel**
- Upload official certificate templates  
- Upload seal + signature reference images  
- These uploads become the **reference standards** used by AI for verification  

---

### **2. Student Panel**
- View issued certificates  
- Share certificates  
- Download certificates  
> Students **do NOT upload anything** — only viewing + sharing

---

### **3. Verifier / Recruiter**
- Upload the candidate’s certificate they received  
- AI performs:
  - OCR text extraction  
  - Template similarity scoring  
  - Seal/logo region matching  
  - Layout comparison  
- Backend computes the authenticity score  
- Ethereum is checked **only if that certificate was previously registered**  
- Final Verdict:
  - **Very Likely Genuine**  
  - **Needs Manual Review**  
  - **Likely Forged**

---

## 🧠 AI Engine (Python Microservice)

The Python service performs:

- **Template Matching** – compares layout structure  
- **Seal Verification** – matches seals/logos  
- **Signature Region Checking** – verifies signatures via ORB features  

**Output:**  
A final AI score combining template, seal, and signature similarity.

---

## ⛓ Blockchain Layer (Ethereum)

- Only the **SHA-256 hash** of the certificate is stored  
- Certificate images are **never stored on-chain**  
- Benefits:
  - Immutable proof  
  - Integrity validation  
  - Trustless verification  
- Smart contract stores certificate hashes permanently  

---

## 🛠 Tech Stack

- **Frontend:** React (Vite)  
- **Backend:** Node.js (Express)  
- **AI Engine:** Python  
- **Blockchain:** Ethereum + Ethers.js  
- **Storage:** Local JSON DB (prototype)

---

## 📁 Project Structure

```
/frontend       → React UI  
/backend        → Node.js API + AI bridge + blockchain  
/ai-service     → Python microservice (template + seal matching)
/contract       → Solidity smart contract  
```

---

## ⚙️ Setup & Installation

### **Frontend**
```bash
cd frontend
npm install
npm run dev
```

### **Backend**
```bash
cd backend
npm install
npm run server
```

### **AI Service**
```bash
cd ai-service
python3 -m venv .venv
source .venv/bin/activate
```

### **Smart Contract**
```bash
cd contract
npm install
npx hardhat run scripts/deploy.js
```

---

## 🔄 Working Flow

1. Verifier uploads a certificate  
2. Node.js sends the file to the Python AI service  
3. AI returns:
   - Seal match score  
   - Template match score  
   - OCR text extraction  
   - Final AI authenticity score  
4. Final verdict is returned  
5. If the certificate is being uploaded/issued:
   - Backend computes SHA-256 hash  
   - Checks if hash already exists on Ethereum  
     - **If exists → skip (already registered)**  
     - **If not → store on Ethereum**  
   - Save metadata to local JSON DB  
6. Student can view/share/download certificate via unique transaction hash  

---

## ❓ Why VeriCert?

- Eliminates slow, manual verification  
- AI catches layout + seal forgeries  
- Blockchain ensures tamper-proof authenticity  
- Works for universities, HR teams, students  

---

## 📜 License
**MIT**

