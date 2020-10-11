// "SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Farm {
    string public _name = "The Farm";
    IERC20 public _deployToken;
    IERC20 public _daiToken;

    address[] public stakers;
    mapping(address => uint256) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    constructor(address deployTokenAddress, address daiTokenAddress) public {
        _deployToken = IERC20(deployTokenAddress);
        _daiToken = IERC20(daiTokenAddress);
    }

    function stakeTokens(uint256 amount, address token) public {
        require(amount > 0, "Amount need to be greater than 0");

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        stakingBalance[msg.sender] = stakingBalance[msg.sender] + amount;

        if (!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }
}
