// SPDX-License-Identifier: MIT

pragma solidity 0.8.17;

import "./interface/IAggregationRouter.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TokenFactory.sol";

contract AggregationRouter is IAggregationRouter {
    TokenFactory exchange;

    constructor(TokenFactory _exchange) {
        exchange = _exchange;
    }

    function execute(address sender) external payable {
        bytes memory data = msg.data[36:msg.data.length - 32];
        (address srcToken, address dstToken) = abi.decode(
            data,
            (address, address)
        );
        uint256 amount = abi.decode(msg.data[msg.data.length - 32:], (uint256));

        bytes4 selector = bytes4(
            keccak256(bytes("tokenSwap(address,address,address,uint256)"))
        );
        ERC20 token = ERC20(srcToken);
        token.approve(address(exchange), amount);
        assembly {
            let ptr := mload(0x40)

            mstore(ptr, selector)
            mstore(add(ptr, 0x4), srcToken)
            mstore(add(ptr, 0x24), dstToken)
            mstore(add(ptr, 0x44), caller())
            mstore(add(ptr, 0x64), amount)

            if iszero(
                call(gas(), sload(exchange.slot), callvalue(), ptr, 0x84, 0, 0)
            ) {
                returndatacopy(ptr, 0, returndatasize())
                revert(ptr, returndatasize())
            }
        }
    }
}
