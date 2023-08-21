// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 totalSupply,
        address startingWallet
    ) ERC20(name, symbol) {
        _mint(msg.sender, totalSupply / 2);
        _mint(startingWallet, totalSupply / 2);
    }
}
