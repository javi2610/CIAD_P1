// test/RecordRegistry.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RecordRegistry", function () {
  let registry;
  let owner, addr1;

  beforeEach(async () => {
    [owner, addr1] = await ethers.getSigners();
    const RecordRegistry = await ethers.getContractFactory("RecordRegistry");
    registry = await RecordRegistry.deploy();
  });

  it("Should create a new record", async () => {
    await expect(registry.createRecord("Initial Data"))
      .to.emit(registry, "RecordCreated")
      .withArgs(1, owner.address, "Initial Data");
  });

  it("Should update a record", async () => {
    await registry.createRecord("Initial Data");
    await expect(registry.updateRecord(1, "Updated Data"))
      .to.emit(registry, "RecordUpdated")
      .withArgs(1, "Updated Data");
  });

  it("Should prevent non-owners from updating", async () => {
    await registry.createRecord("Initial Data");
    await expect(
      registry.connect(addr1).updateRecord(1, "Malicious Data")
    ).to.be.revertedWith("Not the owner");
  });
});