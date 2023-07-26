#!/usr/bin/env node
const { ERC721, superTokenABI } = require("./const/const");
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
  const providerLens = new ethers.providers.WebSocketProvider(
    `${WSS_ENDPOINT}${ALCHEMY_KEY}`
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

  async function postClientExpired(clientFromApi) {
    try {
      await fetch(`${API_ENDPOINT}/expired_clients`, {
        method: "POST",
        headers: {
          accept: "application/json",
        },
        body: JSON.stringify({
          clientProfile: clientFromApi.clientProfile,
          clientAddress: clientFromApi.clientAddress,
          totalFollowers: clientFromApi.totalFollowers,
          flowSenderAddress: clientFromApi.flowSenderAddress,
          followNftAddress: clientFromApi.followNftAddress,
          amountFlowRate: clientFromApi.amountFlowRate,
          amount: clientFromApi.amount,
          owner: clientFromApi.owner,
          isHuman: false,
          publicationId: clientFromApi.publicationId,
          tokenX: clientFromApi.tokenX,
        }),
        mode: "no-cors",
      });
    } catch (err) {
      writeToLog(`Error deleting followers in cleaner ${err}`);
    }
  }

  async function deleteFollower(flowSenderAddress, followerAddress) {
    try {
      await fetch(
        `${API_ENDPOINT}/followers?flowSenderAddress=${flowSenderAddress}&followerAddress=${followerAddress}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      writeToLog(`Error deleting followers in cleaner ${err}`);
    }
  }

  async function deleteClient(flowSenderAddress) {
    try {
      await fetch(
        `${API_ENDPOINT}/clients?flowSenderAddress=${flowSenderAddress}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      writeToLog(`Error deleting followers in cleaner ${err}`);
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

  async function cleanSteams(clientFromApi) {
    let peopleWhoMirrored = [];
    let isMirror = true;
    try {
      const followersFromApi = await getFollowers(
        clientFromApi.flowSenderAddress
      );
      if (clientFromApi.publicationId !== "0x00000") {
        peopleWhoMirrored = await fetchMirrors(
          clientFromApi.publicationId,
          clientFromApi.clientProfile
        );
      }
      const tokenX = await sf.loadSuperToken(clientFromApi.tokenX);

      const contractSuperToken = new ethers.Contract(
        tokenX.address,
        superTokenABI,
        providerLens
      );

      const superTokenBalance = await contractSuperToken.balanceOf(
        clientFromApi.flowSenderAddress
      );

      if (Number(superTokenBalance) === 0) {
        await postClientExpired(clientFromApi);
        await deleteClient(clientFromApi.flowSenderAddress);
      }

      // const contractLensNFT = new ethers.Contract(
      //   clientFromApi.followNftAddress,
      //   ERC721,
      //   providerLens
      // );
      // const feeData = await providerSuperfluid.getFeeData();

      // for (let i = 0; i < followersFromApi.length; ) {
      //   const follower = followersFromApi[i];
      //   try {
      //     if (clientFromApi.publicationId !== "0x00000") {
      //       isMirror = peopleWhoMirrored.find(
      //         (person) => person.ownedBy === follower.followerAddress
      //       );
      //     }
      //     const nftInBalance = await contractLensNFT.balanceOf(
      //       follower.followerAddress
      //     );

      //     if (Number(nftInBalance.toString()) === 0 || isMirror === undefined) {
      //       writeToLog(
      //         `Cleaning... ${follower.followerAddress} from ${clientFromApi.flowSenderAddress}`
      //       );

      //       const deleteFlowOperation = sf.cfaV1.deleteFlowByOperator({
      //         sender: clientFromApi.flowSenderAddress,
      //         receiver: follower.followerAddress,
      //         superToken: tokenX.address,
      //         overrides: {
      //           gasPrice: feeData.gasPrice,
      //           gasLimit: 9000000,
      //         },
      //       });

      //       await deleteFlowOperation
      //         .exec(signer)
      //         .then(async () => {
      //           await deleteFollower(
      //             clientFromApi.flowSenderAddress,
      //             follower.followerAddress
      //           )
      //             .then(() =>
      //               writeToLog(
      //                 `Deleted ${follower.followerAddress} from followers of ${clientFromApi.flowSenderAddress}`
      //               )
      //             )
      //             .catch(
      //               (err) =>
      //                 `Error executing delete flowower operation in cleaner ${err}`
      //             );
      //         })
      //         .catch(
      //           (err) =>
      //             `Error executing delete flow operation  in cleaner ${err}`
      //         );
      //     }
      //   } catch (error) {
      //     writeToLog(`An error happened executing the cleaner: ${error}`);
      //   }
      //   i++;
      // }
    } catch (error) {
      writeToLog(
        `An error happened creating the set up necesary for the cleaner: ${error}`
      );
    }
  }

  await getClients();

  for (let i = 0; i < clientsArray.length; i++) {
    await cleanSteams(clientsArray[i]);
  }
}

main()
  .then(() => {
    console.log("Process ended");
    process.exit();
  })
  .catch((error) => {
    console.error(`Error getting connect to providerLens: ${error}`);
    process.exit(1);
  });
