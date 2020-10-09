// "SPDX-License-Identifier: UNLICENSED
pragma solidity 0.6.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract DaiToken is ERC20 {
    constructor() public ERC20("Dai Token", "DAI") {
        _mint(msg.sender, 1000000000000000000000);
    }
}
