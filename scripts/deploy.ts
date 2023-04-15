import { ethers, network } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

async function main() {

  const CampaignsFactory = await ethers.getContractFactory(
    "CampaignFactory"
  );

  const _tokenX = "0xCAa7349CEA390F89641fe306D93591f87595dc1F"
  const _owner = "0xDf3fd962ce5D03dA86aDA3095b44Cb757e4Ef033"
  const _usdcAddr = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";

  const campaignsFactory = await CampaignsFactory.deploy(_tokenX, _owner, _usdcAddr);

  await campaignsFactory.deployed();

  console.log(`campaignsFactory deployed to ${campaignsFactory.address}`);
  console.log("Waiting confirmations");
  await campaignsFactory.deployTransaction.wait(10);
  console.log("Confirmations done!");
  if (
    !developmentChains.includes(network.name) &&
    process.env.POLYGONSCAN_API
  ) {
    console.log("Verifying...");
    await verify(campaignsFactory.address, [_tokenX, _owner, _usdcAddr]);
  }
}

main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
