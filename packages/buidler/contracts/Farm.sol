// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.6/ChainlinkClient.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@nomiclabs/buidler/console.sol";

contract Farm is ChainlinkClient, Ownable {
    string public _name = "The Farm";
    address public _owner;
    IERC20 public _deployToken;

    address[] public _stakers;
    mapping(address => mapping(address => uint256)) public _stakingBalance; // token > address
    mapping(address => uint256) public _uniqueTokensStaked;
    mapping(address => address) public _tokenPriceFeedMapping;
    mapping(address => bool) public _isStaking;
    address[] _allowedTokens;

    event OraclePrice(int256 price);

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
            // uint256 balance = getUserStakingBalanceEthValue(recipient); //10
            // uint256 balance = getTokenEthPrice() / (10**18);

            uint256 balance = getTokenEthPrice();
            // uint256 balance = 10000000000000000000;
            _deployToken.transfer(recipient, balance);
        }
    }

    // Chainlink
    function setPriceFeedContract(address token, address priceFeed) public onlyOwner {
        _tokenPriceFeedMapping[token] = priceFeed;
    }

    // function getUserStakingBalanceEthValue(address user, address token) public view returns (uint256) {
    //     if (_uniqueTokensStaked[user] <= 0) {
    //         return 0;
    //     }
    //     return (_stakingBalance[token][user] * getTokenEthPrice(token)) / (10**18);
    // }

    function getTokenEthPrice() public returns (uint256) {
        // address priceFeedAddress = _tokenPriceFeedMapping[token];
        // AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeedAddress);

        /**
         * Network: Kovan
         * Aggregator: ETH/USD
         * Address: 0x9326BFA02ADD2366b30bacB125260Af641031331
         */
        AggregatorV3Interface priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        (uint80 roundID, int256 price, uint256 startedAt, uint256 timeStamp, uint80 answeredInRound) = priceFeed
            .latestRoundData();

        emit OraclePrice(price);

        return uint256(price);
    }
}
