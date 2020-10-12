// "SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Farm {
    string public _name = "The Farm";
    address public _owner;
    IERC20 public _deployToken;
    IERC20 public _daiToken;

    address[] public _stakers;
    mapping(address => uint256) public _stakingBalance;
    mapping(address => bool) public _hasStaked;
    mapping(address => bool) public _isStaking;

    constructor(address deployTokenAddress, address daiTokenAddress) public {
        _deployToken = IERC20(deployTokenAddress);
        _daiToken = IERC20(daiTokenAddress);
        _owner = msg.sender;
    }

    function stakeTokens(uint256 amount, address token) public {
        require(amount > 0, "Amount need to be greater than 0");

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        _stakingBalance[msg.sender] = _stakingBalance[msg.sender] + amount;

        if (!_hasStaked[msg.sender]) {
            _stakers.push(msg.sender);
        }

        _isStaking[msg.sender] = true;
        _hasStaked[msg.sender] = true;
    }

    function unstakeTokens() public {
        uint256 balance = _stakingBalance[msg.sender];
        require(balance > 0, "Staking balance cannot be 0");

        _daiToken.transfer(msg.sender, balance);
        _stakingBalance[msg.sender] = 0;
        _isStaking[msg.sender] = false;
    }

    function issueTokens() public {
        require(msg.sender == _owner, "Caller must be the owner");
        for (uint256 i = 0; i < _stakers.length; i++) {
            address recipient = _stakers[i];
            uint256 balance = _stakingBalance[recipient];
            if (balance > 0) {
                _deployToken.transfer(recipient, balance);
            }
        }
    }
}
