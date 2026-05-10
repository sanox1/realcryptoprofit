// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RCPT is ERC20Permit, Ownable {
    constructor(uint256 initialSupply) 
        ERC20Permit("RealCryptoProfit") 
        ERC20("RealCryptoProfit", "RCP") 
    {
        if (initialSupply > 0) {
            _mint(msg.sender, initialSupply * 10 ** decimals());
        }
    }
    
    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
    
    function renounceOwnershipOfContract() external onlyOwner {
        renounceOwnership();
    }
}
