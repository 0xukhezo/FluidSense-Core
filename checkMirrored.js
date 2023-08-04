#!/usr/bin/env node
const { ERC721 } = require("./const/const");
const ethers = require("ethers");
const fetch = require("cross-fetch");
const { Framework } = require("@superfluid-finance/sdk-core");
const fs = require("fs");

require("dotenv").config();

const {
  ApolloClient,
  InMemoryCache,
  gql,
  HttpLink,
} = require("@apollo/client/core");

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
  const providerSuperfluid = ethers.getDefaultProvider(
    `${RPC_ENDPOINT}${ALCHEMY_KEY}`
  );

  const providerLens = new ethers.providers.WebSocketProvider(
    `${WSS_ENDPOINT}${ALCHEMY_KEY}`
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
    try {
      const response = await fetch(`${API_ENDPOINT}/clients`, options);
      clientsArray = await response.json();
    } catch (err) {
      writeToLog(`Error getting clients in cleaner ${err}`);
    }
  }

  async function getFollowers(flowSenderAddress) {
    try {
      const response = await fetch(
        `${API_ENDPOINT}/followers?flowSenderAddress=${flowSenderAddress}`,
        options
      );
      return response.json();
    } catch (err) {
      writeToLog(`Error getting followers in cleaner ${err}`);
    }
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

  async function fetchMirrors(publicationId, ownerProfileId) {
    const queryBody = `
    query Profiles($cursor: Cursor) {
      profiles(
        request: { whoMirroredPublicationId: "${publicationId}", cursor: $cursor, limit: 50 }
      ) {
        items {
          id
          handle
          ownedBy
        }
        pageInfo {
          prev
          next
        }
      }
    }
  `;
    try {
      let hasNextPage = true;
      let cursor = null;
      let allItems = [];

      while (hasNextPage) {
        try {
          let response = await client.query({
            query: Profiles(queryBody),
            variables: { cursor },
          });

          const { items, pageInfo } = response.data.profiles;

          allItems = [...allItems, ...items];

          if (pageInfo.next) {
            cursor = pageInfo.next;
          } else {
            hasNextPage = false;
          }
        } catch (err) {
          writeToLog(err);
          break;
        }
      }
      return [...new Set(allItems)].filter(
        (item) => item.id !== ownerProfileId
      );
    } catch (err) {
      writeToLog(err);
    }
  }

  async function checkMirrored(clientFromApi) {
    const tokenX = await sf.loadSuperToken(clientFromApi.tokenX);

    try {
      const peopleWhoMirrored = await fetchMirrors(
        clientFromApi.publicationId,
        clientFromApi.clientProfile
      );
      const followersFromApi = await getFollowers(
        clientFromApi.flowSenderAddress
      );
      const contractLensNFT = new ethers.Contract(
        clientFromApi.followNftAddress,
        ERC721,
        providerLens
      );

      for (let i = 0; i < peopleWhoMirrored.length; i++) {
        const followerToCheck = peopleWhoMirrored[i];
        if (
          clientFromApi.minimumFollowers > followerToCheck.stats.totalFollowers
        ) {
          writeToLog(
            `${followerToCheck.ownedBy} do not have enough followers to have flow in  ${clientFromApi.flowSenderAddress}`
          );
        } else {
          try {
            const nftInBalance = await contractLensNFT.balanceOf(
              followerToCheck.ownedBy
            );
            const alreadyWithFlow = await followersFromApi.filter(
              (follower) => follower.followerAddress === followerToCheck.ownedBy
            );
            if (
              // He is following
              Number(nftInBalance.toString()) !== 0
            ) {
              if (alreadyWithFlow.length !== 0) {
                writeToLog(
                  `${followerToCheck.ownedBy} already with flow in ${clientFromApi.flowSenderAddress}`
                );
              } else {
                writeToLog(
                  `Creating steam to ${followerToCheck.ownedBy} in ${clientFromApi.flowSenderAddress}`
                );
                const monthlyAmount = ethers.utils.parseEther(
                  clientFromApi.amountFlowRate.toString()
                );
                const calculatedFlowRate = Math.round(monthlyAmount / 2592000);

                const feeData = await providerSuperfluid.getFeeData();

                const createFlowOperation = tokenX.createFlowByOperator({
                  sender: clientFromApi.flowSenderAddress,
                  receiver: followerToCheck.ownedBy,
                  flowRate: calculatedFlowRate,
                  overrides: {
                    gasPrice: feeData.gasPrice,
                  },
                });

                try {
                  await createFlowOperation.exec(signer);
                  await postFollower(
                    followerToCheck.ownedBy,
                    clientFromApi.flowSenderAddress
                  );
                  writeToLog(
                    `Create flow done!, adding ${followerToCheck.ownedBy} to followers in ${clientFromApi.flowSenderAddress}`
                  );
                } catch {
                  writeToLog(
                    `Error creating flow! It is not possible to add ${followerToCheck.ownedBy} to ${clientFromApi.flowSenderAddress}`
                  );
                }
              }
            }
          } catch (error) {
            writeToLog(
              `An error happened executing the checker mirrors: ${error}`
            );
          }
        }
      }
    } catch (error) {
      writeToLog(
        `An error happened creating the set up necesary for the checker mirrors: ${error}`
      );
    }
  }

  await getClients();
  for (let i = 0; i < clientsArray.length; i++) {
    await checkMirrored(clientsArray[i]);
  }
}

main()
  .then(() => {
    console.log("Process ended");
    process.exit();
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
