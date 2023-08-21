// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Token.sol";

/// @title TokenFactory
/// @notice Represents token factory and token exchange
contract TokenFactory is Ownable {
    using Strings for string;

    mapping(address => uint8) private tokenWeight;
    address[] private availableTokens;

    constructor() {}

    /// @notice Mints `numRequestedTokens` new tokens and splits `suply` between `owner` and `TokenFactory`.
    /// @param numRequestedTokens Number of new tokens to be minted
    /// @param supply Ammount minted for each token
    function mintTokens(
        uint8 numRequestedTokens,
        uint256 supply
    ) external onlyOwner {
        uint256 index = availableTokens.length + 1; // in case tokens are minted multiple times
        for (uint8 i = 0; i < numRequestedTokens; i++) {
            string memory num = Strings.toString(index + i);
            Token token = new Token(
                string.concat("Token ", num),
                string.concat("tkn", num),
                supply,
                owner() // msg.sender
            );
            availableTokens.push(address(token));
            tokenWeight[address(token)] = uint8(
                (uint256(keccak256(abi.encodePacked(block.timestamp, i))) %
                    10) + 1
            );
        }
    }

    function tokenSwap(
        address _scrToken,
        address _dstToken,
        address dst,
        uint256 amount
    ) external payable {
        ERC20 srcToken = ERC20(_scrToken);
        ERC20 dstToken = ERC20(_dstToken);

        srcToken.transferFrom(msg.sender, address(this), amount);
        uint256 returnAmount = (amount * tokenWeight[_scrToken]) /
            tokenWeight[_dstToken];
        dstToken.transfer(dst, returnAmount);
    }

    function getTokenWeight(address token) external view returns (uint8) {
        return tokenWeight[token];
    }

    function getAvailableTokens() external view returns (address[] memory) {
        return availableTokens;
    }
}
