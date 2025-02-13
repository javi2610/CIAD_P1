// scripts/create-record.js
const { ethers } = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const registry = await ethers.getContractAt("RecordRegistry", contractAddress);
  
  const tx = await registry.createRecord("Hello World");
  await tx.wait();
  console.log(`Record created in tx: ${tx.hash}`);
}