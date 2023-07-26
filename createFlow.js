const ethers = require("ethers");
require("dotenv").config();

const fetch = require("cross-fetch");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ERC721, campaignABI } = require("./const/const");

let ALCHEMY_KEY;
let RPC_ENDPOINT;
let API_ENDPOINT;
let WSS_ENDPOINT;

if (process.env.ENV === "prod") {
  ALCHEMY_KEY = process.env.ALCHEMY_KEY_POLYGON;
  RPC_ENDPOINT = process.env.RPC_ENDPOINT_POLYGON;
  API_ENDPOINT = process.env.API_ENDPOINT;
  WSS_ENDPOINT = process.env.WSS_RPC_ENDPOINT_POLYGON;
} else {
  ALCHEMY_KEY = process.env.ALCHEMY_KEY_MUMBAI;
  RPC_ENDPOINT = process.env.RPC_ENDPOINT_MUMBAI;
  API_ENDPOINT = process.env.API_ENDPOINT;
  WSS_ENDPOINT = process.env.WSS_RPC_ENDPOINT_MUMBAI;
}

//Const
const addrCryptoPlazaCampaign = "0x59664b7Ecfd803347c92dbA1a7020cAb9AB0a430";

const providerSuperfluid = ethers.getDefaultProvider(
  `${RPC_ENDPOINT}${ALCHEMY_KEY}`
);

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, providerSuperfluid);

async function postFollower(followerAddress, flowSenderAddress) {
  try {
    await fetch(`${API_ENDPOINT}/followers`, {
      method: "POST",
      headers: {
        accept: "application/json",
      },
      body: JSON.stringify({
        followerAddress: followerAddress,
        flowSenderAddress: flowSenderAddress,
      }),
      mode: "no-cors",
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * CREATE
 */
async function createFlow(
  followerForSteam,
  amountFlowRate,
  flowSenderAddress,
  USDCx
) {
  console.log("Creating steam to ", followerForSteam);

  const monthlyAmount = ethers.utils.parseEther(amountFlowRate.toString());

  const calculatedFlowRate = Math.round(monthlyAmount / 2592000);

  const feeData = await providerSuperfluid.getFeeData();

  const createFlowOperation = USDCx.createFlowByOperator({
    sender: flowSenderAddress,
    receiver: followerForSteam,
    flowRate: calculatedFlowRate,
    overrides: {
      gasPrice: feeData.gasPrice,
    },
  });

  const tx = await createFlowOperation.exec(signer);
  await postFollower(followerForSteam, flowSenderAddress);
  console.log("Create flow done!, adding", followerForSteam, "to followers");
}

async function cleanSteams(flowSenderAddress, followersFromApi, USDCx, sf) {
  try {
    const contractLensNFT = new ethers.Contract(
      "0xa7f21ff23D55f9f34B4F8c45E930333AA80f5E38",
      ERC721,
      providerSuperfluid
    );
    followersFromApi.map(async (follower) => {
      const nftInBalance = await contractLensNFT.balanceOf(follower);

      if (Number(nftInBalance.toString()) === 0) {
        console.log("Cleaning...", follower);

        const feeData = await providerSuperfluid.getFeeData();

        const deleteFlowOperation = sf.cfaV1.deleteFlowByOperator({
          sender: flowSenderAddress,
          receiver: follower,
          superToken: USDCx.address,
          overrides: {
            gasPrice: feeData.gasPrice,
          },
        });

        await deleteFlowOperation.exec(signer);
        console.log("Cleaned", follower);
        await deleteFollower(flowSenderAddress, follower);
        console.log("Delete flow done!, deleting", follower, "from followers");
      }
    });
  } catch (err) {
    console.log(err);
  }
}

/**
 * HTTP DELETE
 */
async function deleteFollower(flowSenderAddress, followerAddress) {
  const response = await fetch(
    `${API_ENDPOINT}/followers?flowSenderAddress=${flowSenderAddress}&followerAddress=${followerAddress}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

async function main() {
  const sf = await Framework.create({
    chainId: (await providerSuperfluid.getNetwork()).chainId,
    provider: providerSuperfluid,
  });

  const USDCx = await sf.loadSuperToken("WMATICx");

  // Check NFT Balance

  // const contractLensNFT = new ethers.Contract(
  //   "0xa7f21ff23D55f9f34B4F8c45E930333AA80f5E38",
  //   ERC721,
  //   providerSuperfluid
  // );

  // const nftInBalance = await contractLensNFT.balanceOf(
  //   "0x57B7bf6f792a6181Ec5aFB88cE7bcE330a9d1b67"
  // );

  // Create flow

  await createFlow(
    "0x43DdF2bF7B0d2bb2D3904298763bcA2D3F2b40E0",
    "0.5",
    "0xd0361Eab7279E8D605953a2A0e8aDb867B2d196a",
    USDCx
  );

  // Delete flow

  // const feeData = await providerSuperfluid.getFeeData();

  // const deleteFlowOperation = sf.cfaV1.deleteFlowByOperator({
  //   sender: "0xc0c95420b00b46CaD44eED898471d9B32ce818b4", // addressCampaing
  //   receiver: "0x59664b7Ecfd803347c92dbA1a7020cAb9AB0a430", // addressFollower
  //   superToken: USDCx.address,
  //   overrides: {
  //     gasPrice: feeData.gasPrice,
  //     gasLimit: 9000000,
  //   },
  // });

  // await deleteFlowOperation.exec(signer);

  // await deleteFollower(
  //   "0x065dFbB8B36b6502F097C65E8f7279926D5abcC1",
  //   "0x7440050b3fd5d3dcd7de6f956caf332f4161f36f"
  // );

  // Withdraw

  // const contractCampaign = new ethers.Contract(
  //   "0xe7d13f793715826866bc382334b254f723C8E020", //campaign
  //   campaignABI,
  //   signer
  // );

  // const gasPrice = await providerSuperfluid.getGasPrice();

  // const tx = await contractCampaign.withdrawTokenX(
  //   "0x1305F6B6Df9Dc47159D12Eb7aC2804d4A33173c2",
  //   "170000000000000000",
  //   { gasPrice }
  // );
  // tx.wait(1);

  // Charge Fee

  // const contractCampaign = new ethers.Contract(
  //   "0x45414619ac13b61d0bf3c58A9B92c935D96cAcF2", //campaign
  //   campaignABI,
  //   signer
  // );

  // const gasPrice = await providerSuperfluid.getGasPrice();

  // const tx = await contractCampaign.chargeFee("100000000000000000", {
  //   gasPrice,
  // });
  // tx.wait(1);
}

main();
