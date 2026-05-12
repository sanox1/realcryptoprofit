// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract RCPLock is ReentrancyGuard {
    IERC20 public immutable token;
    uint256 public constant MIN_LOCK_AMOUNT = 1000 * 10**18;
    uint256 public constant LOCK_DURATION = 30 days;
   
    struct LockInfo {
        uint256 amount;
        uint256 unlockTime;
    }
    
    mapping(address => LockInfo) public locks;
    
    event TokensLocked(address indexed user, uint256 requested, uint256 received, uint256 unlockTime);
    event TokensWithdrawn(address indexed user, uint256 amount);
   
    constructor(address _tokenAddress) {
        require(_tokenAddress != address(0), "Zero address");
        token = IERC20(_tokenAddress);
    }
    
	function lockTokens(uint256 amount) external nonReentrant {
		require(amount >= MIN_LOCK_AMOUNT, "Amount below minimum");
		require(locks[msg.sender].amount == 0, "Already has locked tokens");
		
		uint256 balanceBefore = token.balanceOf(address(this));
		require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
		
		uint256 received = token.balanceOf(address(this)) - balanceBefore;
		require(received >= MIN_LOCK_AMOUNT, "Received below minimum"); // Changed from >0
		
		locks[msg.sender] = LockInfo({
			amount: received,
			unlockTime: block.timestamp + LOCK_DURATION
		});
		
		emit TokensLocked(msg.sender, amount, received, block.timestamp + LOCK_DURATION);
	}
	
	

    function withdrawTokens() external nonReentrant {
        LockInfo storage userLock = locks[msg.sender];
        require(userLock.amount > 0, "No tokens locked");
        require(block.timestamp >= userLock.unlockTime, "Lock period not ended");
        
        uint256 amount = userLock.amount;
        
        // Check contract actually has enough tokens
        uint256 contractBalance = token.balanceOf(address(this));
        require(contractBalance >= amount, "Insufficient contract balance for full withdrawal");
        
        // Clear storage BEFORE transfer (Checks-Effects-Interactions)
        userLock.amount = 0;
        
        // External call last
        bool success = token.transfer(msg.sender, amount);
        require(success, "Token transfer failed");
        
        emit TokensWithdrawn(msg.sender, amount);
    }
    
    function canRelock(address user) external view returns (bool) {
        return locks[user].amount == 0;
    }
    
    function getUserLock(address user) external view returns (uint256 amount, uint256 unlockTime, bool canWithdraw) {
        LockInfo memory lock = locks[user];
        return (lock.amount, lock.unlockTime, lock.amount > 0 && block.timestamp >= lock.unlockTime);
    }
}
