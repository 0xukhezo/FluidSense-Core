pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/CampaignFactory.sol";
import {
    SuperfluidFrameworkDeployer,
    ISuperToken
} from "@superfluid-finance/ethereum-contracts/contracts/utils/SuperfluidFrameworkDeployer.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {
    SuperTokenDeployer,
    TestToken,
    SuperToken
} from "@superfluid-finance/ethereum-contracts/contracts/utils/SuperTokenDeployer.sol";

import {ERC1820RegistryCompiled} from
    "@superfluid-finance/ethereum-contracts/contracts/libs/ERC1820RegistryCompiled.sol";

contract CampaignTest is Test {
    using SuperTokenV1Library for ISuperToken;

    CampaignFactory public campaignFactory;

    event NewCampaign(address indexed token, address indexed campaign, address indexed campaignOperator);

    address deployer = address(0x01);
    address campaignOperator = address(0x02);

    SuperfluidFrameworkDeployer public sfDeployer;
    SuperfluidFrameworkDeployer.Framework public sf;
    SuperTokenDeployer tokenDeployer;
    ISuperToken streamToken;
    TestToken token;
    ISuperToken streamToken2;
    TestToken token2;

    function setUp() public virtual {
        vm.etch(ERC1820RegistryCompiled.at, ERC1820RegistryCompiled.bin);
        vm.startPrank(deployer);
        sfDeployer = new SuperfluidFrameworkDeployer();
        sf = sfDeployer.getFramework();
        tokenDeployer = new SuperTokenDeployer(address(sf.superTokenFactory), address(sf.resolver));
        sf.resolver.addAdmin(address(tokenDeployer));
        (token, streamToken) = tokenDeployer.deployWrapperSuperToken("StreamToken", "ST", 18, type(uint256).max);
        (token2, streamToken2) = tokenDeployer.deployWrapperSuperToken("StreamToken", "ST", 18, type(uint256).max);
        campaignFactory = new CampaignFactory();
    }

    function testDeployNewCampaign() public {
        vm.startPrank(deployer);
        for (uint256 i = 0; i < 4; i++) {
            address campaignAddress =
                campaignFactory.getCampaignAddress(deployer, address(streamToken), campaignOperator);
            vm.expectEmit(true, true, true, true);
            emit NewCampaign(address(token), campaignAddress, campaignOperator);
            campaignFactory.deployNewCampaign(streamToken, campaignOperator);
        }
    }

    function testDeployerNonce() public {
        vm.startPrank(deployer);
        // deployer nonce start at 0
        assertEq(campaignFactory.campaignNonces(deployer), 0);
        for (uint256 i = 0; i < 4; i++) {
            campaignFactory.deployNewCampaign(streamToken, campaignOperator);
            // deployer nonce is incremented by 1 for each campaign
            assertEq(campaignFactory.campaignNonces(deployer), i + 1);
        }
    }

    function testPrefundAddress() public {
        vm.startPrank(deployer);
        token.mint(deployer, 100 ether);
        address campaignAddress = campaignFactory.getCampaignAddress(deployer, address(streamToken), campaignOperator);
        token.transfer(campaignAddress, 100 ether);
        assertEq(token.balanceOf(campaignAddress), 100 ether);
        campaignFactory.deployNewCampaign(streamToken, campaignOperator);
        assertEq(token.balanceOf(campaignAddress), 0 ether);
        assertEq(token.balanceOf(campaignOperator), 3 ether);
        // campaign gets 97%
        assertEq(streamToken.balanceOf(campaignAddress), 97 ether);
    }

    function testTransferTokens() public {
        vm.startPrank(deployer);
        address notOwner = address(0x03);
        token.mint(deployer, 100 ether);
        address campaignAddress = campaignFactory.getCampaignAddress(deployer, address(streamToken), campaignOperator);
        token.transfer(campaignAddress, 100 ether);
        campaignFactory.deployNewCampaign(streamToken, campaignOperator);
        Campaign campaign = Campaign(campaignAddress);
        assertEq(streamToken.balanceOf(campaignAddress), 97 ether);
        vm.startPrank(notOwner);
        vm.expectRevert(Campaign.OnlyOwner.selector);
        campaign.withdrawToken(address(streamToken), 10 ether);
        vm.startPrank(campaignOperator);
        campaign.withdrawToken(address(streamToken), 10 ether);
        assertEq(streamToken.balanceOf(campaignAddress), 87 ether);
        assertEq(streamToken.balanceOf(campaignOperator), 10 ether);
    }

    function testFundAfterDeployment() public {
        vm.startPrank(deployer);
        token.mint(deployer, 100 ether);
        address campaignAddress = campaignFactory.getCampaignAddress(deployer, address(streamToken), campaignOperator);
        campaignFactory.deployNewCampaign(streamToken, campaignOperator);
        Campaign campaign = Campaign(campaignAddress);
        assertEq(token.balanceOf(campaignAddress), 0 ether);
        assertEq(streamToken.balanceOf(campaignAddress), 0 ether);
        token.transfer(campaignAddress, 100 ether);
        assertEq(token.balanceOf(campaignAddress), 100 ether);
        vm.startPrank(campaignOperator);
        campaign.upgradeAndCollectFee();
        assertEq(token.balanceOf(campaignAddress), 0 ether);
        assertEq(token.balanceOf(campaignOperator), 3 ether);
        assertEq(streamToken.balanceOf(campaignAddress), 97 ether);
    }

    function testOperatorCanOPStreams() public {
        vm.startPrank(deployer);
        token.mint(deployer, 100 ether);
        address campaignAddress = campaignFactory.getCampaignAddress(deployer, address(streamToken), campaignOperator);
        token.transfer(campaignAddress, 100 ether);
        campaignFactory.deployNewCampaign(streamToken, campaignOperator);
        vm.startPrank(campaignOperator);
        streamToken.createFlowFrom(campaignAddress, address(0x03), 100000);
        assertEq(streamToken.getFlowRate(campaignAddress, address(0x03)), 100000);
        streamToken.updateFlowFrom(campaignAddress, address(0x03), 10000000);
        assertEq(streamToken.getFlowRate(campaignAddress, address(0x03)), 10000000);
        streamToken.deleteFlowFrom(campaignAddress, address(0x03));
        assertEq(streamToken.getFlowRate(campaignAddress, address(0x03)), 0);
    }

    function testWithdraw() public{
        vm.startPrank(deployer);
        token.mint(deployer, 100 ether);
        address campaignAddress = campaignFactory.getCampaignAddress(deployer, address(streamToken), campaignOperator);
        campaignFactory.deployNewCampaign(streamToken, campaignOperator);
        Campaign campaign = Campaign(campaignAddress);
        assertEq(token.balanceOf(campaignAddress), 0 ether);
        assertEq(streamToken.balanceOf(campaignAddress), 0 ether);
        token.transfer(campaignAddress, 100 ether);
        assertEq(token.balanceOf(campaignAddress), 100 ether);
        vm.startPrank(campaignOperator);
        campaign.withdrawToken(address(token), 10 ether);
        assertEq(token.balanceOf(campaignAddress), 90 ether);
        assertEq(token.balanceOf(campaignOperator), 10 ether);
    }

    function testWithdrawRandomToken() public{
        // deploy a new supertoken
        vm.startPrank(deployer);
        token.mint(deployer, 100 ether);
        token2.mint(deployer, 100 ether);
        address campaignAddress = campaignFactory.getCampaignAddress(deployer, address(streamToken), campaignOperator);
        campaignFactory.deployNewCampaign(streamToken, campaignOperator);
        Campaign campaign = Campaign(campaignAddress);
        assertEq(token.balanceOf(campaignAddress), 0 ether);
        assertEq(streamToken.balanceOf(campaignAddress), 0 ether);
        assertEq(token2.balanceOf(campaignAddress), 0 ether);
        assertEq(streamToken2.balanceOf(campaignAddress), 0 ether);
        token.transfer(campaignAddress, 100 ether);
        token2.transfer(campaignAddress, 100 ether);
        assertEq(token.balanceOf(campaignAddress), 100 ether);
        assertEq(token2.balanceOf(campaignAddress), 100 ether);
        vm.stopPrank();
        vm.startPrank(campaignOperator);
        campaign.withdrawToken(address(token), 10 ether);
        campaign.withdrawToken(address(token2), 10 ether);
        assertEq(token.balanceOf(campaignAddress), 90 ether);
        assertEq(token.balanceOf(campaignOperator), 10 ether);
        assertEq(token2.balanceOf(campaignAddress), 90 ether);
        assertEq(token2.balanceOf(campaignOperator), 10 ether);
    }

    // write a test where the user sends the wrong token to the campaign make sure the upgrade and stream operations don't work
    function testWrongToken() public{
        vm.startPrank(deployer);
        token2.mint(deployer, 100 ether);
        address campaignAddress = campaignFactory.getCampaignAddress(deployer, address(streamToken), campaignOperator);
        token2.transfer(campaignAddress, 100 ether);
        campaignFactory.deployNewCampaign(streamToken, campaignOperator);
        assertEq(streamToken2.balanceOf(campaignAddress), 0 ether);
        assertEq(token2.balanceOf(campaignAddress), 100 ether);
    }
}
