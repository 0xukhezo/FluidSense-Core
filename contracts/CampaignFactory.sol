pragma solidity ^0.8.14;

import {ISuperToken} from "@superfluid-finance/ethereum-contracts/contracts/interfaces/superfluid/ISuperfluid.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./Campaign.sol";

contract CampaignFactory is Ownable {

    event NewCampaign(address indexed token, address indexed campaign, address indexed campaignOperator);

    // each campaign deployer has a nonce
    mapping(address => uint256) public campaignNonces;

    // get campaign address using create2 but locked to this factory and msg.sender
    function getCampaignAddress(address caller, address superToken, address campaignOperator) public view returns (address) {
        uint256 campaignNonce = campaignNonces[caller];
        bytes32 salt = keccak256(abi.encodePacked(caller, ++campaignNonce));
        bytes32 hash = keccak256(abi.encodePacked(bytes1(0xff), address(this), salt, _getBytecodeHash(superToken, campaignOperator)));
        return address(uint160(uint256(hash)));
    }

    function _getBytecodeHash(address superToken, address campaignOperator) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(type(Campaign).creationCode, abi.encode(superToken, campaignOperator)));
    }


    // deploy new campaign using create2
    function deployNewCampaign(
        ISuperToken streamableToken,
        address campaignOperator
    ) public {
        address caller = msg.sender;
        campaignNonces[caller]++;
        bytes32 _salt = keccak256(abi.encodePacked(caller, campaignNonces[caller]));
        Campaign newCampaign = new Campaign{salt: _salt}(streamableToken, campaignOperator);
        IERC20 token = IERC20(streamableToken.getUnderlyingToken());
        emit NewCampaign(token, address(newCampaign), campaignOperator);
    }
}
