// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./interface/IAggregationRouter.sol";

contract FirstToken is ERC20, IPool {
    constructor(address destination) ERC20("TokenA", "tokenA") {
        _mint(address(this), 1000 * 10 ** 18);
        _transfer(address(this), destination, 500 * 10 ** 18);
    }

    function deposit(address from, uint256 amount) external {
        _transfer(from, address(this), amount);
    }

    function withdraw(address to, uint256 amount) external {
        _transfer(address(this), to, amount);
    }

    function getPoolBalance() public view returns (uint256) {
        return balanceOf(address(this));
    }
}

contract SecondToken is ERC20, IPool {
    constructor(address destination) ERC20("TokenB", "tokenB") {
        _mint(address(this), 1000 * 10 ** 18);
        _transfer(address(this), destination, 500 * 10 ** 18);
    }

    function deposit(address from, uint256 amount) external {
        _transfer(from, address(this), amount);
    }

    function withdraw(address to, uint256 amount) external {
        _transfer(address(this), to, amount);
    }

    function getPoolBalance() public view returns (uint256) {
        return balanceOf(address(this));
    }
}
