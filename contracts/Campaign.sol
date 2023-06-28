//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.14;

import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import { SuperTokenV1Library } from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Campaign is Ownable {

    using SuperTokenV1Library for ISuperToken;

    ISuperToken immutable public streamToken;
    IERC20 immutable public token;

    constructor(ISuperToken _streamToken, address _campaignOperator) {

        streamToken = _streamToken;
        token = IERC20(_streamToken);
        token = IERC20(streamToken.getUnderlyingToken());

        require(address(token) != address(0), "Campaign: Invalid token");
        require(_campaignOperator != address(0), "Campaign: Invalid campaignOperator");

        // give max ACL permission to campaignOperator
        streamToken.setMaxFlowPermissions(_campaignOperator);

        // campaign contract set max allowance to superToken to perform token upgrades
        token.approve(address(streamToken), type(uint256).max);

        // campaignOperator will is the new contract owner
        _transferOwnership(_campaignOperator);

        // attention: this must happen after transferOwnership
        upgradeAndCollectFee();
    }


    function upgradeAndCollectFee() public onlyOwner {
        uint256 balance = token.balanceOf(address(this));
        // charge 3% fee
        uint256 fee = (balance * 300) / 10000;
        require(token.transfer(owner(), fee), "Campaign: Token transfer failed");
        // upgrade amount to superToken
        streamToken.upgrade(balance - fee);
    }

    // any token can be withdrawn by the owner
    function withdrawToken(address tokenAddress, uint256 amount) external onlyOwner {
        require(IERC20(tokenAddress).transfer(owner(), amount), "Campaign: Token transfer");
    }
}