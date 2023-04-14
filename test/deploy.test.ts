import { ethers } from 'hardhat'
import { IERC20, CampaignFactory__factory, CampaignFactory } from "../typechain-types"


const initialBalanceUsdc = ethers.utils.parseUnits("10000", "6");
const usdcAddr = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174";

const _tokenX = "0xCAa7349CEA390F89641fe306D93591f87595dc1F"

describe('Superfrens', function () {
    async function initialSetUp() {

        const [deployer] = await ethers.getSigners()

        const usdc: IERC20 = await ethers.getContractAt("IERC20", usdcAddr)
        const userWithUsdc = await ethers.getImpersonatedSigner("0x9810762578accf1f314320cca5b72506ae7d7630");
        await usdc.connect(userWithUsdc).transfer(deployer.address, initialBalanceUsdc)

        const CampaignsFactory:CampaignFactory__factory  = await ethers.getContractFactory(
            "CampaignFactory"
        );
        
        const campaignsFactory:CampaignFactory = await CampaignsFactory.deploy(_tokenX, deployer.address, usdcAddr);

        await campaignsFactory.deployed();

        console.log(`campaignsFactory deployed to ${campaignsFactory.address}`);
 
        await campaignsFactory.deployTransaction.wait(1);
      
 

        return {
            usdc,
            deployer,
            campaignsFactory
        }
    }

    describe('1.) Proposal to mint position in uniswap v3', function () {

        it('Should minted position', async function () {
            const { usdc, deployer, campaignsFactory } = await initialSetUp()

            const initialUsdc = ethers.utils.parseUnits("10","6")
            await usdc.connect(deployer).transfer(campaignsFactory.address,initialUsdc)

            const tx = await campaignsFactory.deployCampaign(initialUsdc)
            const receipt = await tx.wait(1)

            const newCampaign = receipt.events![receipt.events!.length-1].args!.campaign

            const xUsdc: IERC20 = await ethers.getContractAt("IERC20", _tokenX)
            const balanceCampaign = await xUsdc.connect(deployer).balanceOf(newCampaign)

        })

    })
})






