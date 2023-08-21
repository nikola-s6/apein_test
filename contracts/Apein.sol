// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./Pools.sol";
import "./interface/IAggregationRouter.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Apein is Ownable {
    error WrongArrayLenghts();
    error InsufficientFunds();

    address _oneInchContract;

    constructor(address oneInchAddress) {
        _oneInchContract = oneInchAddress;
    }

    function getOneInchContract() public view returns (address) {
        return _oneInchContract;
    }

    function deposit(address token, uint256 amount) external {
        ERC20 srcToken = ERC20(token);

        srcToken.transferFrom(msg.sender, address(this), amount);
    }

    function withdraw(
        address tokenReceiver,
        address[] memory tokens,
        uint256[] memory amounts
    ) external onlyOwner {
        if (tokens.length != amounts.length) {
            revert WrongArrayLenghts();
        }

        for (uint256 i = 0; i < tokens.length; i++) {
            ERC20 token = ERC20(tokens[i]);
            if (token.balanceOf(address(this)) < amounts[i]) {
                revert InsufficientFunds();
            }
            token.transfer(tokenReceiver, amounts[i]);
        }
    }

    function swapApein(
        address executor,
        address srcToken,
        address dstToken,
        uint256 amount,
        bytes calldata permit,
        bytes calldata data
    )
        public
        payable
        onlyOwner
        returns (uint256 returnAmount, uint256 spentAmount)
    {
        ERC20 _token = ERC20(srcToken);
        _token.approve(_oneInchContract, amount);
        (bool successful, bytes memory resp) = _oneInchContract.call(
            abi.encodeWithSelector(
                bytes4(
                    keccak256(
                        bytes(
                            "swap(address,(address,address,address,address,uint256,uint256,uint256),bytes,bytes)"
                        )
                    )
                ),
                executor,
                srcToken,
                dstToken,
                executor,
                address(this),
                amount,
                1,
                4,
                permit,
                data
            )
        );
        if (!successful) {
            revert("Call to oneinch not successfull");
        }

        (returnAmount, spentAmount) = abi.decode(resp, (uint256, uint256));
    }
}
