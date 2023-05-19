import { ethers, network } from "hardhat";
import { developmentChains } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

async function main() {
  const CampaignsFactory = await ethers.getContractFactory("CampaignFactory");

  const _tokenX = "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2";
  const _owner = "0xB59A5a10E7543AbfBd10D593834AE959f54BCB8C";
  const _token = "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063";

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
