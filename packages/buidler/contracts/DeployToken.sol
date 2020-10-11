// "SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DeployToken is ERC20 {
    constructor() public ERC20("Deploy Token", "DPT") {
        _mint(msg.sender, 1000000000000000000000); // 1000
    }
}
