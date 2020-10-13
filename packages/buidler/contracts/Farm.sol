// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@nomiclabs/buidler/console.sol";

contract Farm is Ownable {
    string public _name = "The Farm";
    address public _owner;
    IERC20 public _deployToken;

    address[] public _stakers;
    mapping(address => mapping(address => uint256)) public _stakingBalance; // token > address
    mapping(address => uint256) public _uniqueTokensStaked;
    mapping(address => address) public _tokenPriceFeedMapping;
    mapping(address => bool) public _isStaking;
    address[] _allowedTokens;

    constructor(address deployTokenAddress) public {
        _deployToken = IERC20(deployTokenAddress);
    }

    function addAllowedTokens(address token) public onlyOwner {
        _allowedTokens.push(token);
    }

    function stakeTokens(uint256 amount, address token) public {
        require(amount > 0, "Amount need to be greater than 0");

        if (tokenIsAllowed(token)) {
            updateUniqueTokensStaked(msg.sender, token);
            IERC20(token).transferFrom(msg.sender, address(this), amount);
            _stakingBalance[token][msg.sender] = _stakingBalance[token][msg.sender] + amount;

            if (_uniqueTokensStaked[msg.sender] >= 1) {
                _stakers.push(msg.sender);
            }
        }
    }

    function unstakeTokens(address token) public {
        uint256 balance = _stakingBalance[token][msg.sender];
        require(balance > 0, "Staking balance cannot be 0");
        _stakingBalance[token][msg.sender] = 0;
        _uniqueTokensStaked[msg.sender] = _uniqueTokensStaked[msg.sender] - 1;
        IERC20(token).transfer(msg.sender, balance);
    }

    function tokenIsAllowed(address token) public view returns (bool) {
        for (uint256 allowedTokensIndex = 0; allowedTokensIndex < _allowedTokens.length; allowedTokensIndex++) {
            if (_allowedTokens[allowedTokensIndex] == token) {
                return true;
            }
        }
        return false;
    }

    function updateUniqueTokensStaked(address user, address token) internal {
        if (_stakingBalance[token][user] <= 0) {
            _uniqueTokensStaked[user] = _uniqueTokensStaked[user] + 1;
        }
    }

    function issueTokens() public onlyOwner {
        for (uint256 stakersIndex = 0; stakersIndex < _stakers.length; stakersIndex++) {
            address recipient = _stakers[stakersIndex];
            uint256 balance = 10000000000000000000; //10
            _deployToken.transfer(recipient, balance);
        }
    }
}
