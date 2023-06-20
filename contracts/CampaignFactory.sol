//SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.14;

import {Campaign} from "./Campaign.sol";
import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CampaignFactory {
    address immutable owner;
    ISuperToken immutable tokenX;
    ERC20 internal immutable token;

    event NewCampaign(address indexed sender, address campaign);

    constructor(ISuperToken _tokenX, address _owner, ERC20 _token) {
        owner = _owner;
        tokenX = ISuperToken(_tokenX);
        token = _token;
    }

    function deployCampaign(uint256 amount) public {
        require(
            token.allowance(msg.sender, address(this)) >= amount,
            "Insuficiente amount"
        );
        token.transferFrom(msg.sender, address(this), amount);

        bytes memory bytecode = getByteCode(tokenX, owner);

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

        token.transfer(campaign, amount);

        Campaign newCampaign = new Campaign{salt: _salt}(tokenX, owner);

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
