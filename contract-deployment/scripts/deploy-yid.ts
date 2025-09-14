import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying YID contracts...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const YIDFactory = await ethers.getContractFactory("YIDFactory");
  const factory = await YIDFactory.deploy();
  await factory.waitForDeployment();
  
  const factoryAddress = await factory.getAddress();
  console.log("YIDFactory deployed to:", factoryAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
