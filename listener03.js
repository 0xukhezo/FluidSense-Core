const { contractLensABI, contractLensAddress } = require("./const/const");
const {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
} = require("@apollo/client/core");
const ethers = require("ethers");
const fetch = require("cross-fetch");
const fs = require("fs");
const { Framework } = require("@superfluid-finance/sdk-core");
require("dotenv").config();

const API_URL = "https://api.lens.dev";

const client = new ApolloClient({
  link: new HttpLink({ uri: API_URL, fetch }),
  cache: new InMemoryCache(),
});

const Profiles = (queryBody) => gql(queryBody);

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

function writeToLog(message) {
  const date = new Date().toISOString();
  const logMessage = `[${date}] ${message}\n`;
  fs.appendFileSync("logs.txt", logMessage);
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
      writeToLog(err);
    }
  }

  async function fetchFollowers(profileId, minFollowers) {
    if (minFollowers === 0) {
      return;
    }
    const queryBody = `query Profile {
        profile(request: { profileId: "${profileId}" }) {
          id
          name
          bio
          attributes {
            displayType
            traitType
            key
            value
          }
          followNftAddress
          metadata
          isDefault
          picture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          handle
          coverPicture {
            ... on NftImage {
              contractAddress
              tokenId
              uri
              verified
            }
            ... on MediaSet {
              original {
                url
                mimeType
              }
            }
            __typename
          }
          ownedBy
          dispatcher {
            address
            canUseRelay
          }
          stats {
            totalFollowers
            totalFollowing
            totalPosts
            totalComments
            totalMirrors
            totalPublications
            totalCollects
          }
          followModule {
            ... on FeeFollowModuleSettings {
              type
              amount {
                asset {
                  symbol
                  name
                  decimals
                  address
                }
                value
              }
              recipient
            }
            ... on ProfileFollowModuleSettings {
              type
            }
            ... on RevertFollowModuleSettings {
              type
            }
          }
        }
      }`;

    try {
      let response = await client.query({ query: Profiles(queryBody) });
      return response.data.profile.stats.totalFollowers;
    } catch (err) {
      writeToLog(err);
    }
  }

  async function fetchProfileId(followerForSteam) {
    const queryBody = `query Profiles {
      profiles(request: { ownedBy: ["${followerForSteam}"], limit: 1 }) {
        items {
          id
        }
      }
    }`;
    try {
      let response = await client.query({ query: Profiles(queryBody) });
      return response.data.profiles.items.id;
    } catch (err) {
      writeToLog(err);
    }
  }

  const contractLens = new ethers.Contract(
    contractLensAddress,
    contractLensABI,
    providerLens
  );

  async function createFlow(
    newFollower,
    clientFromApi,
    txHash,
    followersFromApi,
    token,
    minFollowers
  ) {
    let followerForSteam = newFollower;
    const tokenX = await sf.loadSuperToken(token);
    try {
      const tx = await providerLens.getTransaction(txHash);
      const iface = new ethers.utils.Interface([
        "function followFor(uint256[] profileIds,address[] mintFor,bytes[] datas)",
      ]);
      const result = iface.decodeFunctionData("followFor", tx.data);
      followerForSteam = result.mintFor[0];
    } catch {
      followerForSteam = newFollower;
    }
    const profileIdMirror = await fetchProfileId(followerForSteam);
    const followersOfNewFollower = await fetchFollowers(
      profileIdMirror,
      minFollowers
    );

    if (Number(minFollowers) > Number(followersOfNewFollower)) {
      writeToLog(
        `${followerForSteam} do not have enough followers, needs ${Number(
          minFollowers
        )} and has ${Number(followersOfNewFollower)}`
      );
      return;
    }

    const alreadyWithFlow = await followersFromApi.filter(
      (follower) => follower.followerAddress === followerForSteam
    );

    if (alreadyWithFlow.length !== 0) {
      writeToLog(
        `${followerForSteam} already with flow in ${clientFromApi.flowSenderAddress}`
      );
      return;
    }
    writeToLog(
      `Creating steam to  ${followerForSteam} in ${clientFromApi.flowSenderAddress}`
    );
    const monthlyAmount = ethers.utils.parseEther(
      clientFromApi.amountFlowRate.toString()
    );
    const calculatedFlowRate = Math.round(monthlyAmount / 2592000);

    const feeData = await providerSuperfluid.getFeeData();

    const createFlowOperation = tokenX.createFlowByOperator({
      sender: clientFromApi.flowSenderAddress,
      receiver: followerForSteam,
      flowRate: calculatedFlowRate,
      overrides: {
        gasPrice: feeData.gasPrice,
        gasLimit: 9000000,
      },
    });

    try {
      await createFlowOperation.exec(signer);
      await postFollower(followerForSteam, clientFromApi.flowSenderAddress);
      writeToLog(
        `Create flow done!, adding ${followerForSteam} to followers in ${clientFromApi.flowSenderAddress}`
      );
    } catch {
      writeToLog(
        `Error creating flow!, Can not be prossible to add ${followerForSteam} to ${clientFromApi.flowSenderAddress}`
      );
    }
  }

  async function steam(profileIds, newFollower, tx) {
    const client = clientsArray.filter((_client) => {
      return _client.clientProfile === profileIds;
    });
    if (client.length > 1) {
      for (let i = 0; i < client.length; i++) {
        const followers = await getFollowers(client[i].flowSenderAddress);
        await createFlow(
          newFollower,
          client[i],
          tx.transactionHash,
          followers,
          client[i].token,
          client[i].minFollowers
        );
      }
    } else {
      const followers = await getFollowers(client[0].flowSenderAddress);
      await createFlow(
        newFollower,
        client[0],
        tx.transactionHash,
        followers,
        client[0].token,
        client[0].minFollowers
      );
    }
  }

  await getClients();

  writeToLog("Listener ON");

  contractLens.on(
    "Followed",
    async (newFollower, profileIds, followModuleDatas, timestamp, tx) => {
      if (
        clientsArray.some((cli) => cli.clientProfile === profileIds[0]._hex)
      ) {
        await steam(profileIds[0]._hex, newFollower, tx);
      }
    }
  );
}

main().catch((error) => {
  writeToLog(`${error}`);
});
