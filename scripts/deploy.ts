import { ethers, network } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

//npx hardhat run --network polygon scripts/deploy.ts

async function main() {
  const CampaignsFactory = await ethers.getContractFactory("CampaignFactory");

  const _tokenX = "0x27e1e4E6BC79D93032abef01025811B7E4727e85";
  const _owner = "0xB59A5a10E7543AbfBd10D593834AE959f54BCB8C";
  const _token = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619";

  const campaignsFactory = await CampaignsFactory.deploy(
    _tokenX,
    _owner,
    _token
  );

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
    await verify(campaignsFactory.address, [_tokenX, _owner, _token]);
  }
}

main()
  .then(() => (process.exitCode = 0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
