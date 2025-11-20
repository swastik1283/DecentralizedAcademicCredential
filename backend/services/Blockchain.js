import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

import contractABI from "../contractABI.json"  with {type:"json"};

const contractAddress = process.env.CONTRACT_ADDRESS;
const contract = new ethers.Contract(contractAddress, contractABI.abi, wallet);


export const sendHashToContract = async (hash) => {
  try {
    const tx = await contract.storeCertificate(hash);
    await tx.wait();
    return tx.hash; // return transaction hash
  } catch (err) {
    console.error("Blockchain error:", err);
    throw err;
  }
};
