//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Campaign {
    using SuperTokenV1Library for ISuperToken;

    ISuperToken public immutable streamToken;
    IERC20 public immutable token;
    address owner;

    // create custom errors for all the errors in the contract
    error InvalidCampaignOperator();
    error InvalidTokenTransfer();
    error InvalidTokenUpgrade();
    error OnlyOwner();

    constructor(ISuperToken _streamToken, IERC20 _token, address _campaignOperator) {
        streamToken = _streamToken;
        token = _token;

        if(_campaignOperator == address(0)) revert InvalidCampaignOperator();

        // give max ACL permission to campaignOperator
        streamToken.setMaxFlowPermissions(_campaignOperator);

        // campaign contract set max allowance to superToken to perform token upgrades
        token.approve(address(streamToken), type(uint256).max);
        
        // campaignOperator will is the new contract owner
        owner = _campaignOperator;

        _upgradeAndCollectFee();
    }
    
    function upgradeAndCollectFee() public onlyOwner {
        _upgradeAndCollectFee();
    }

    function _upgradeAndCollectFee() internal {
        uint256 balance = token.balanceOf(address(this));
        if(balance == 0) return;
        // charge 3% fee
        uint256 fee = (balance * 300) / 10000;
        if(!token.transfer(owner, fee)) revert InvalidTokenTransfer();
        // upgrade amount to superToken
        streamToken.upgrade(balance - fee);
    }

    // any token can be withdrawn by the owner
    function withdrawToken(address tokenAddress, uint256 amount) external onlyOwner {
        if(!IERC20(tokenAddress).transfer(owner, amount)) revert InvalidTokenTransfer();
    }

    // create an onlyOwner modifier
    modifier onlyOwner() {
        if(msg.sender != owner) revert OnlyOwner();
        _;
    }
}
