const ethers = require("ethers");
require("dotenv").config();

const fetch = require("cross-fetch");
const { Framework } = require("@superfluid-finance/sdk-core");
const { ERC721 } = require("./const/const");

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

  const USDCx = await sf.loadSuperToken("USDCx");

  // Check NFT Balance

  // const contractLensNFT = new ethers.Contract(
  //   "0xa7f21ff23D55f9f34B4F8c45E930333AA80f5E38",
  //   ERC721,
  //   providerSuperfluid
  // );

  // const nftInBalance = await contractLensNFT.balanceOf(
  //   "0x57B7bf6f792a6181Ec5aFB88cE7bcE330a9d1b67"
  // );
  // console.log(Number(nftInBalance.toString()));

  // Create flow

  await createFlow(
    "0x0D4547fd13ADeDcD8b9DA5097f349Ee26f7DD5a1",
    "0.5",
    "0x43ddf2bf7b0d2bb2d3904298763bca2d3f2b40e0",
    USDCx
  );

  // Delete flow

  // const feeData = await providerSuperfluid.getFeeData();

  // const deleteFlowOperation = sf.cfaV1.deleteFlowByOperator({
  //   sender: "0x8b3D194628353a43D0d3829470ccEbECD304c2dC", // addressCampaing
  //   receiver: "0x5386Bf44B00c20db94431b563CEA30864ca04Ff1", // addressFollower
  //   superToken: USDCx.address,
  //   overrides: {
  //     gasPrice: feeData.gasPrice,
  //     gasLimit: 9000000,
  //   },
  // });

  // await deleteFlowOperation.exec(signer);

  // await deleteFollower(
  //   "0xc0c95420b00b46cad44eed898471d9b32ce818b4",
  //   "0x5386Bf44B00c20db94431b563CEA30864ca04Ff1"
  // );
}

main();
