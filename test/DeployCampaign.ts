import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Campaign", function () {
  async function deployCampaignFactory() {
    const [deployer] = await ethers.getSigners();

    const campaignFactoryContract = await ethers.getContractFactory(
      "CampaignFactory"
    );
    const CampaignFactory = await campaignFactoryContract.deploy(
      "0xCAa7349CEA390F89641fe306D93591f87595dc1F",
      deployer.address,
      "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"
    );
    await CampaignFactory.deployed();
    return { CampaignFactory, deployer };
  }

  async function deployCampaign() {
    const { CampaignFactory, deployer } = await loadFixture(
      deployCampaignFactory
    );
    const tokenAddress = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
    const token = await ethers.getContractAt("IERC20", tokenAddress);

    const txApprove = await token.approve(CampaignFactory.address, "2000000");

    const userWithUsdc = await ethers.getImpersonatedSigner(
      "0xf977814e90da44bfa03b6295a0616a897441acec"
    );

    await token.connect(userWithUsdc).transfer(deployer.address, "2000000");

    txApprove.wait(1);

    const tx = await CampaignFactory.deployCampaign("2000000");
    tx.wait(1);

    const filter = CampaignFactory.filters.NewCampaign(deployer.address);
    const logs = await CampaignFactory.queryFilter(filter);
    const event = logs[0].args;

    const Campaign = await ethers.getContractAt("Campaign", event[1]);
    await Campaign.deployed();
    return { Campaign };
  }

  describe("Create Campaign", function () {
    it("Should emit an event on create campaing", async function () {
      const { CampaignFactory, deployer } = await loadFixture(
        deployCampaignFactory
      );
      const tokenAddress = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
      const token = await ethers.getContractAt("IERC20", tokenAddress);

      const txApprove = await token.approve(CampaignFactory.address, "2000000");

      const userWithUsdc = await ethers.getImpersonatedSigner(
        "0xf977814e90da44bfa03b6295a0616a897441acec"
      );

      await token.connect(userWithUsdc).transfer(deployer.address, "2000000");

      txApprove.wait(1);

      const tx = await CampaignFactory.deployCampaign("2000000");
      tx.wait(1);

      await expect(tx).to.emit(CampaignFactory, "NewCampaign");
    });
    it("The owner need to be the operator", async function () {
      const { deployer } = await loadFixture(deployCampaignFactory);
      const { Campaign } = await loadFixture(deployCampaign);
      const owner = await Campaign.owner();

      expect(owner).to.equal(deployer.address);
    });
    it("The owner can charge a fee to the campaign", async function () {
      const { Campaign } = await loadFixture(deployCampaign);
      const tokenXAddress = "0xCAa7349CEA390F89641fe306D93591f87595dc1F";
      const tokenX = await ethers.getContractAt("ISuperToken", tokenXAddress);
      const userWithUsdcX = await ethers.getImpersonatedSigner(
        "0x0c3483e3b355986d6bb76e3cebbc8dd8ec20779c"
      );

      await tokenX
        .connect(userWithUsdcX)
        .transfer(Campaign.address, "2000000000000000000");

      const txFee = await Campaign.chargeFee("2000000000000000000");
      const txBalance2 = await tokenX.balanceOf(Campaign.address);
      txFee.wait(1);

      expect(txBalance2).to.equal("3880000000000000000");
    });
    it("The owner can withdraw the campaign of token ERC20", async function () {
      const { deployer } = await loadFixture(deployCampaignFactory);
      const { Campaign } = await loadFixture(deployCampaign);
      const userWithUsdc = await ethers.getImpersonatedSigner(
        "0xf977814e90da44bfa03b6295a0616a897441acec"
      );
      const tokenAddress = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";
      const token = await ethers.getContractAt("IERC20", tokenAddress);
      await token.connect(userWithUsdc).transfer(Campaign.address, "2000000");
      const txWithdraw = await Campaign.withdrawToken(tokenAddress, "2000000");

      txWithdraw.wait(1);
      const txBalance = await token.balanceOf(Campaign.address);
      const txBalanceOperator = await token.balanceOf(deployer.address);
      expect(txBalance).to.equal("0");
      expect(txBalanceOperator).to.equal("2060000");
    });
    it("The owner can withdraw the campaign of super token", async function () {
      const { deployer } = await loadFixture(deployCampaignFactory);
      const { Campaign } = await loadFixture(deployCampaign);
      const tokenXAddress = "0xCAa7349CEA390F89641fe306D93591f87595dc1F";
      const tokenX = await ethers.getContractAt("ISuperToken", tokenXAddress);
      const txBalance0 = await tokenX.balanceOf(Campaign.address);

      const txWithdraw = await Campaign.withdrawTokenX(
        tokenXAddress,
        txBalance0
      );

      txWithdraw.wait(1);
      const txBalance = await tokenX.balanceOf(Campaign.address);
      const txBalanceOperator = await tokenX.balanceOf(deployer.address);
      expect(txBalance).to.equal("0");
      expect(txBalanceOperator).to.equal("1940000000000000000");
    });
  });
});
