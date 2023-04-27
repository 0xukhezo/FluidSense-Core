const { ERC721 } = require("./const/const");
const ethers = require("ethers");
const fetch = require("cross-fetch");
const { Framework } = require("@superfluid-finance/sdk-core");

require("dotenv").config();

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

async function main() {
  const providerLens = new ethers.providers.WebSocketProvider(
    `${process.env.WSS_RPC_ENDPOINT_POLYGON}${process.env.ALCHEMY_KEY_POLYGON}`
  );
  const providerSuperfluid = ethers.getDefaultProvider(
    `${RPC_ENDPOINT}${ALCHEMY_KEY}`
  );

  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, providerSuperfluid);

  const sf = await Framework.create({
    chainId: (await providerSuperfluid.getNetwork()).chainId,
    provider: providerSuperfluid,
  });

  let clientsArray = [];

  const USDCx = await sf.loadSuperToken("USDCx");

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
    },
  };

  async function getClients() {
    const response = await fetch(`${API_ENDPOINT}/clients`, options);
    clientsArray = await response.json();
  }

  async function getFollowers(flowSenderAddress) {
    const response = await fetch(
      `${API_ENDPOINT}/followers?flowSenderAddress=${flowSenderAddress}`,
      options
    );
    return response.json();
  }

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

  async function cleanSteams(clientFromApi) {
    try {
      console.log("Start cleaning of", clientFromApi.flowSenderAddress);
      const followersFromApi = await getFollowers(
        clientFromApi.flowSenderAddress
      );
      const contractLensNFT = new ethers.Contract(
        clientFromApi.followNftAddress,
        ERC721,
        providerLens
      );
      followersFromApi.map(async (follower) => {
        const nftInBalance = await contractLensNFT.balanceOf(
          follower.followerAddress
        );
        if (Number(nftInBalance.toString()) === 0) {
          console.log("Cleaning...", follower.followerAddress);

          const feeData = await providerSuperfluid.getFeeData();

          const deleteFlowOperation = sf.cfaV1.deleteFlowByOperator({
            sender: clientFromApi.flowSenderAddress,
            receiver: follower.followerAddress,
            superToken: USDCx.address,
            overrides: {
              gasPrice: feeData.gasPrice,
            },
          });

          await deleteFlowOperation
            .exec(signer)
            .then(() => console.log("Cleaned", follower.followerAddress));
          await deleteFollower(
            clientFromApi.flowSenderAddress,
            follower.followerAddress
          ).then(() =>
            console.log(
              "Delete flow done!, deleting",
              follower.followerAddress,
              "from followers"
            )
          );
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  await getClients();
  clientsArray.map(async (client) => {
    await cleanSteams(client);
  });
}

main().catch((error) => {
  console.error(error);
});
