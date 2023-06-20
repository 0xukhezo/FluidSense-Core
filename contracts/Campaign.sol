//SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.14;


import {SuperTokenV1Library} from "@superfluid-finance/ethereum-contracts/contracts/apps/SuperTokenV1Library.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Campaign is Ownable {
    using SuperTokenV1Library for ISuperToken;

    ISuperToken internal immutable tokenX;
    ERC20 internal immutable baseToken;
    address payable operator;

    constructor(ISuperToken _tokenX, address _operator) {
        tokenX = _tokenX;
        operator = payable(_operator);
        tokenX.setMaxFlowPermissions(_operator);
        baseToken = ERC20(tokenX.getUnderlyingToken());
        baseToken.approve(address(tokenX), 2 ** 256 - 1);
        _upgrade(_operator);
    }

    function _upgrade(address _operator) internal {
        baseToken.transfer(
            _operator,
            (baseToken.balanceOf(address(this)) * 300) / 10000
        );
        tokenX.upgrade(baseToken.balanceOf(address(this))); 
        _transferOwnership(_operator);
    }

    function chargeFee(uint256 value) external onlyOwner {
        uint256 fee = (value * 300) / 10000;
        tokenX.transfer(operator, fee);
    }

    function withdrawToken(address tokenAddress, uint256 amount) external onlyOwner{
        ERC20 token = ERC20(tokenAddress);
        require(token.balanceOf(address(this)) >= amount, "Insufficient balance");
        require(token.transfer(operator, amount), "Token transfer failed");
    }
    
    function withdrawTokenX(address tokenXAddress, uint256 amount) external onlyOwner{
        ISuperToken token = ISuperToken(tokenXAddress);
        require(token.balanceOf(address(this)) >= amount, "Insufficient balance");
        require(token.transfer(operator, amount), "TokenX transfer failed");
    }
}
