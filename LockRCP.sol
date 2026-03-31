// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract RCPLock {
    IERC20 public immutable token;
    uint256 public constant MIN_LOCK_AMOUNT = 1000 * 10**18;
    uint256 public constant LOCK_DURATION = 30 days;
    uint256 public constant EMERGENCY_WITHDRAWAL_DELAY = 60 days;
   
    struct LockInfo {
        uint256 amount;
        uint256 unlockTime;
    }
    
    mapping(address => LockInfo) public locks;
    
    event TokensLocked(address indexed user, uint256 requested, uint256 received, uint256 unlockTime);
    event TokensWithdrawn(address indexed user, uint256 amount);
    event EmergencyWithdrawn(address indexed user, uint256 amount, address recipient);
   
    constructor() {
        token = IERC20(0x3D81464A248D1DB279E0fF67815c49BDD89Fd20d); //token contract address
    }
    
    function lockTokens(uint256 amount) external {
        require(amount >= MIN_LOCK_AMOUNT, "Amount below minimum");
        require(locks[msg.sender].amount == 0, "Already has locked tokens");
        require(token.allowance(msg.sender, address(this)) >= amount, "Insufficient allowance");
        
        uint256 balanceBefore = token.balanceOf(address(this));
        bool success = token.transferFrom(msg.sender, address(this), amount);
        require(success, "Token transfer failed");
        
        uint256 balanceAfter = token.balanceOf(address(this));
        uint256 received = balanceAfter - balanceBefore;
        
        require(received > 0, "No tokens received");
         
        locks[msg.sender] = LockInfo({
            amount: received,
            unlockTime: block.timestamp + LOCK_DURATION
        });
        
        emit TokensLocked(msg.sender, amount, received, block.timestamp + LOCK_DURATION);
    }

    function withdrawTokens() external {
        LockInfo storage userLock = locks[msg.sender];
        require(userLock.amount > 0, "No tokens locked");
        require(block.timestamp >= userLock.unlockTime, "Lock period not ended");
        
        uint256 amount = userLock.amount;
        userLock.amount = 0;
        
        // Check actual balance and transfer minimum of owed vs available
        uint256 contractBalance = token.balanceOf(address(this));
        uint256 transferAmount = amount > contractBalance ? contractBalance : amount;
        
        bool success = token.transfer(msg.sender, transferAmount);
        require(success, "Token transfer failed");
        
        emit TokensWithdrawn(msg.sender, transferAmount);
    }
    
    // Simple check - can only lock if no tokens are currently locked
    function canRelock(address user) external view returns (bool) {
        return locks[user].amount == 0;
    }
    
    // Helper to estimate actual received amount (for frontend display)
    function estimateReceived(uint256 inputAmount) external pure returns (uint256 minExpected) {
 
        return (inputAmount * 90) / 100; // At least 90% of input
    }
    
    // View function to get user's locked info
    function getUserLock(address user) external view returns (uint256 amount, uint256 unlockTime, bool canWithdraw) {
        LockInfo memory lock = locks[user];
        return (lock.amount, lock.unlockTime, lock.amount > 0 && block.timestamp >= lock.unlockTime);
    }

   function emergencyWithdraw() external {
        LockInfo storage userLock = locks[msg.sender];
        require(userLock.amount > 0, "No tokens locked");
        require(block.timestamp >= userLock.unlockTime + EMERGENCY_WITHDRAWAL_DELAY, 
                "Emergency withdrawal not yet available");
        
        uint256 amount = userLock.amount;
        userLock.amount = 0;
        
        // Simple transfer - if it fails, the transaction will revert
        bool success = token.transfer(msg.sender, amount);
        require(success, "Token transfer failed");
        
        emit EmergencyWithdrawn(msg.sender, amount, msg.sender);
    }
}