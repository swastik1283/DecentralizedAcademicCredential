import hardhat from "hardhat";
const { ethers } = hardhat;
import hre from "hardhat";

async function main() {
  const Certificate = await hre.ethers.deployContract("CertificateRegistration");
  await Certificate.waitForDeployment();

  console.log("Contract deployed at:", Certificate.target);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
