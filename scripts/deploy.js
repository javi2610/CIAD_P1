// scripts/deploy.js
async function main() {
    const [deployer] = await ethers.getSigners();
    const RecordRegistry = await ethers.getContractFactory("RecordRegistry");
    const registry = await RecordRegistry.deploy();
    console.log("Contract deployed to:", registry.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });