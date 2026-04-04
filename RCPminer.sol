// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RCPFaucet is Ownable {
    IERC20 public token;
    
    mapping(address => uint256) public lastMined;
    mapping(address => uint256) public minedToday;
    mapping(address => uint256) public lastResetDay;
    
    uint256 public constant DAILY_LIMIT = 14 * 10**18; // 14 tokens
    uint256 public constant REWARD_AMOUNT = 2 * 10**18; // 2 token per mine
    uint256 public constant COOLDOWN = 1 hours; // Can mine once per hour
    
    event Mined(address indexed miner, uint256 amount, uint256 timestamp);
    event ContractFunded(address indexed funder, uint256 amount);
    event EmergencyWithdraw(address indexed owner, uint256 amount);
    
    constructor(address _tokenAddress) Ownable() {
        token = IERC20(_tokenAddress);
    }
    
    function mine() external {
        uint256 currentDay = block.timestamp / 1 days;
        
        // Reset daily counter if new day
        if (lastResetDay[msg.sender] != currentDay) {
            minedToday[msg.sender] = 0;
            lastResetDay[msg.sender] = currentDay;
        }
        
        require(block.timestamp >= lastMined[msg.sender] + COOLDOWN, "Must wait 1 hour between mines");
        require(minedToday[msg.sender] + REWARD_AMOUNT <= DAILY_LIMIT, "Daily limit of 12 tokens reached");
        
        uint256 contractBalance = token.balanceOf(address(this));
        require(contractBalance >= REWARD_AMOUNT, "Mining pool depleted");
        
        // Update state before transfer (prevents reentrancy)
        lastMined[msg.sender] = block.timestamp;
        minedToday[msg.sender] += REWARD_AMOUNT;
        
        // Transfer reward from contract to miner
        bool success = token.transfer(msg.sender, REWARD_AMOUNT);
        require(success, "Token transfer failed");
        
        emit Mined(msg.sender, REWARD_AMOUNT, block.timestamp);
    }
    
    // View function to check remaining daily mining capacity
    function getRemainingDailyMine(address miner) external view returns (uint256) {
        uint256 currentDay = block.timestamp / 1 days;
        uint256 mined = (lastResetDay[miner] == currentDay) ? minedToday[miner] : 0;
        
        if (mined >= DAILY_LIMIT) {
            return 0;
        }
        
        return DAILY_LIMIT - mined;
    }
    
    // View function to check time until next mine
    function getTimeUntilNextMine(address miner) external view returns (uint256) {
        if (block.timestamp >= lastMined[miner] + COOLDOWN) {
            return 0;
        }
        return (lastMined[miner] + COOLDOWN) - block.timestamp;
    }
    
 
    // Emergency function for owner to withdraw remaining tokens
    function emergencyWithdraw(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        uint256 contractBalance = token.balanceOf(address(this));
        require(contractBalance >= amount, "Insufficient balance");
        
        bool success = token.transfer(msg.sender, amount);
        require(success, "Token transfer failed");
        
        emit EmergencyWithdraw(msg.sender, amount);
    }
    
    // View contract's token balance
    function getContractBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }
}
