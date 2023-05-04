#!/usr/bin/env node
const { contractCampaingABI } = require("./const/const");
const ethers = require("ethers");
const fetch = require("cross-fetch");
const { Framework } = require("@superfluid-finance/sdk-core");
const fs = require("fs");

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

function writeToLog(message) {
  const date = new Date().toISOString();
  const logMessage = `[${date}] ${message}\n`;
  fs.appendFileSync("logs.txt", logMessage);
}

async function main() {
  const provider = ethers.getDefaultProvider(`${RPC_ENDPOINT}${ALCHEMY_KEY}`);

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

  async function collectFees() {
    try {
      for (let i = 0; i < clientsArray.length; i++) {
        const contractCampaing = new ethers.Contract(
          clientsArray[i].flowSenderAddress,
          contractCampaingABI,
          provider
        );
        const contractToken = new ethers.Contract(
          "0xCAa7349CEA390F89641fe306D93591f87595dc1F",
          ERC20,
          provider
        );
        try {
          const campaingBalance = await contractToken.balanceOf(
            clientsArray[i].flowSenderAddress
          );

          if (Number(campaingBalance.toString()) > clientsArray[i].amount) {
            await contractCampaing.withdraw(campaingBalance);
            await deleteFollower(
              clientFromApi.flowSenderAddress,
              follower.followerAddress
            ).then(() =>
              writeToLog(
                `Deleted ${follower.followerAddress} from followers of ${clientFromApi.flowSenderAddress}`
              )
            );
          }
        } catch (error) {
          writeToLog(`An error happened: ${error}`);
        }
      }
    } catch (error) {
      writeToLog(`An error happened: ${error}`);
    }
  }

  await getClients();

  await collectFees();
}

main().catch((error) => {
  console.error(error);
});
