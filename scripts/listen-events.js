// scripts/listen-events.js
const { ethers } = require("hardhat");

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS;
  const registry = await ethers.getContractAt("RecordRegistry", contractAddress);

  registry.on("RecordCreated", (id, owner, data) => {
    console.log(`\nNew Record Created:
    ID: ${id}
    Owner: ${owner}
    Data: ${data}`);
  });

  registry.on("RecordUpdated", (id, newData) => {
    console.log(`\nRecord Updated:
    ID: ${id}
    New Data: ${newData}`);
  });

  console.log("Listening for events...");
}

main().catch(console.error);