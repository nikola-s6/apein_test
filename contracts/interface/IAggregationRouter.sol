// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IAggregationRouter {
    function execute(address sender) external payable;
}

interface IPool {
    function deposit(address from, uint256 amount) external;

    function withdraw(address to, uint256 amount) external;
}

enum TokenSwap {
    TokenA,
    TokenB
}

struct AggregatorData {
    TokenSwap inputToken;
    uint256 inputAmount;
}
