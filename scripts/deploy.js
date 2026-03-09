import { ethers } from "ethers";
import hre from "hardhat";
import fs from "fs";

async function main() {
  const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer = await provider.getSigner(0);
  console.log("Deploying with account:", await signer.getAddress());

  const artifact = await hre.artifacts.readArtifact("Voting");
  const factory = new ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);

  const voting = await factory.deploy();
  await voting.waitForDeployment();

  const address = voting.target;
  console.log("Voting deployed to:", address);

  // ✅ Save address so the frontend can fetch it
  fs.writeFileSync(
    "./contract-address.json",
    JSON.stringify({ address }, null, 2)
  );
  console.log("Address saved to contract-address.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});