//SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.14;

import {Campaign} from "./Campaign.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CampaignFactory {
    address immutable owner;
    ISuperToken immutable token;
    ERC20 internal immutable usdc;

    event NewCampaign(address indexed sender, address campaign);

    constructor(ISuperToken _tokenX, address _owner, ERC20 _usdc) {
        owner = _owner;
        token = ISuperToken(_tokenX);
        usdc = _usdc;
    }

    function deployCampaign(uint256 amount) public {
        require(
            usdc.allowance(msg.sender, address(this)) >= amount,
            "Insuficiente amount"
        );
        usdc.transferFrom(msg.sender, address(this), amount);

        bytes memory bytecode = getByteCode(token, owner);

        bytes32 _salt = generateSalt();

        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                _salt,
                keccak256(bytecode)
            )
        );

        address campaign = address(uint160(uint(hash)));

        usdc.transfer(campaign, amount);

        Campaign newCampaign = new Campaign{salt: _salt}(token, owner);

        emit NewCampaign(msg.sender, address(newCampaign));
    }

    function getByteCode(
        ISuperToken _tokenX,
        address _operator
    ) internal pure returns (bytes memory) {
        bytes memory bytecode = type(Campaign).creationCode;
        return abi.encodePacked(bytecode, abi.encode(_tokenX, _operator));
    }

    function generateSalt() internal view returns (bytes32) {
        uint256 nonce = 0;
        bytes32 hash = keccak256(
            abi.encodePacked(block.timestamp, address(this), nonce)
        );
        return hash;
    }
}
