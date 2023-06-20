const { superTokenABI, campaignABI } = require("./const/const");

const ethers = require("ethers");
const fetch = require("cross-fetch");
const fs = require("fs");
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

function writeToLog(message) {
  const date = new Date().toISOString();
  const logMessage = `[${date}] ${message}\n`;
  fs.appendFileSync("logs.txt", logMessage);
}

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

async function main() {
  const providerPolygon = new ethers.providers.WebSocketProvider(
    `${process.env.WSS_RPC_ENDPOINT_POLYGON}${process.env.ALCHEMY_KEY_POLYGON}`
  );

  // const providerSuperfluid = ethers.getDefaultProvider(
  //   `${RPC_ENDPOINT}${ALCHEMY_KEY}`
  // );

  const contractToken = new ethers.Contract(
    "0xe04ad5d86c40d53a12357E1Ba2A9484F60DB0da5",
    superTokenABI,
    providerPolygon
  );

  async function fee(from, to, amount) {
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, providerPolygon);
    const gasPrice = await providerPolygon.getGasPrice();
    const contractCampaign = new ethers.Contract(to, campaignABI, signer);

    const tx = await contractCampaign.chargeFee(amount.toString(), {
      gasPrice,
    });
    tx.wait(1);
    writeToLog(
      `Fee charged in contract ${to} sending from ${from} for an amount of ${ethers.utils.formatUnits(
        amount.toString(),
        "18"
      )} WMATICx`
    );
  }

  await getClients();

  writeToLog("Testing");

  contractToken.on("Transfer", async (from, to, timestamp, tx) => {
    // if (clientsArray.some((cli) => cli.flowSenderAddress === to)) {
    //   await fee(from, to, tx.args[2]);
    // }
    if ("0x45414619ac13b61d0bf3c58A9B92c935D96cAcF2" === to) {
      await fee(from, to, tx.args[2]);
    }
  });
}

main().catch((error) => {
  writeToLog(`${error}`);
});
