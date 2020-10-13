// SPDX-License-Identifier: MIT
pragma solidity ^0.6.8;

import "@nomiclabs/buidler/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract ERC20Log is ERC20 {
    using SafeMath for uint256;

    constructor(
        uint256 initialSupply,
        string memory name,
        string memory symbol
    ) public ERC20(name, symbol) {
        console.log("New ERC20 Token created: ", name, " Address: ", address(this));
        _mint(msg.sender, initialSupply);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        console.log("----Token Event", name(), address(this));
        uint256 tokenAmount = amount.div(uint256(10)**decimals());
        if (from == address(0)) {
            console.log("Minted", tokenAmount, "new tokens to:", to);
        } else if (to == address(0)) {
            console.log("Burnt", tokenAmount, "tokens from:", from);
        } else {
            console.log("Sent", tokenAmount, "tokens from:", from);
            console.log(to, "Received", tokenAmount);
        }
    }
}
