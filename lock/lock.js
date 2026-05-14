 
 
let contractAddress = "0x6378360194c4c53c317828C940137E8402A472aD"; //contract address of lock on test / prod


// Token contract details (RCP token)
const tokenAddress = "0x3D81464A248D1DB279E0fF67815c49BDD89Fd20d"; // contract RCP token 0x856f084D89DEA7478ad9b6Ce684311a4B778b767 test
const tokenAbi = [
    {
        "constant": false,
        "inputs": [
            {"name": "spender","type": "address"},
            {"name": "amount","type": "uint256"}
        ],
        "name": "approve",
        "outputs": [{"name": "","type": "bool"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [{"name": "account","type": "address"}],
        "name": "balanceOf",
        "outputs": [{"name": "","type": "uint256"}],
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {"name": "owner","type": "address"},
            {"name": "spender","type": "address"}
        ],
        "name": "allowance",
        "outputs": [{"name": "","type": "uint256"}],
        "type": "function"
    }
];


let contractAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        }
      ],
      "name": "EmergencyWithdrawn",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "requested",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "received",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "unlockTime",
          "type": "uint256"
        }
      ],
      "name": "TokensLocked",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "user",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "TokensWithdrawn",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "EMERGENCY_WITHDRAWAL_DELAY",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "LOCK_DURATION",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "MIN_LOCK_AMOUNT",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "canRelock",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "emergencyWithdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "inputAmount",
          "type": "uint256"
        }
      ],
      "name": "estimateReceived",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "minExpected",
          "type": "uint256"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "user",
          "type": "address"
        }
      ],
      "name": "getUserLock",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "unlockTime",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "canWithdraw",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "lockTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "locks",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "unlockTime",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "token",
      "outputs": [
        {
          "internalType": "contract IERC20",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "withdrawTokens",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

 

// Fetch user's lock information
async function fetchLockStatus() {
    if (!window.WALLET_CONNECTED) return;
    
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractAbi, provider);
        
        // Get user's lock info
        const lockInfo = await contract.getUserLock(window.WALLET_CONNECTED);
        const [amount, unlockTime, canWithdraw] = lockInfo;
        
        // Format and display information
        if (amount > 0) {
            const formattedAmount = ethers.utils.formatUnits(amount, 18);
            const unlockDate = new Date(unlockTime * 1000).toLocaleString();
            const status = canWithdraw ? "READY TO WITHDRAW" : "LOCKED";
            
            const info = `
                <div style="background-color: #A9A9A9; padding: 15px; border-radius: 5px; margin-top: 10px;">
                    <strong>Your Lock Status:</strong><br>
                    Amount Locked: ${formattedAmount} RCP<br>
                    Unlock Date: ${unlockDate}<br>
                    Status: ${status}
                </div>
            `;
            safeSetInnerHTML("result", info);
        } else {
            safeSetInnerHTML("result", "No tokens currently locked.");
        }
        
        // Update button states
        updateButtonStates(amount, unlockTime, canWithdraw);
        
    } catch (error) {
        console.error("Error fetching user data:", error);
    }
}

// Update button states based on lock status
function updateButtonStates(amount, unlockTime, canWithdraw) {
    const lockButton = document.querySelector('button[onclick="Lock()"]');
    const withdrawButton = document.querySelector('button[onclick="Withdraw()"]');
    
    if (amount > 0) {
        // User has locked tokens
        lockButton.disabled = true;
        lockButton.textContent = "Already Locked";
        lockButton.style.backgroundColor = "#cccccc";
        
        if (canWithdraw) {
            withdrawButton.disabled = false;
            withdrawButton.style.backgroundColor = "#4CAF50";
        } else {
            withdrawButton.disabled = true;
            withdrawButton.style.backgroundColor = "#cccccc";
        }
    } else {
        // User can lock tokens
        lockButton.disabled = false;
        lockButton.textContent = "Approve and Lock";
        lockButton.style.backgroundColor = "#4CAF50";
        
        withdrawButton.disabled = true;
        withdrawButton.style.backgroundColor = "#cccccc";
    }
}




// Update locked until in database with better error handling
async function updateLockedUntilInDatabase() {
    try {
        // Calculate 30 days from now
        const now = new Date();
        const lockedUntil = new Date(now.setDate(now.getDate() + 30));
        
        // Format as YYYY-MM-DD HH:MM:SS for MySQL
        const formattedDate = lockedUntil.toISOString().slice(0, 19).replace('T', ' ');
        
        console.log("Sending to database:", formattedDate); // Debug log
        
        // Make AJAX call to your PHP endpoint
        const response = await fetch('res/lock_until_update.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                locked_until: formattedDate
            }),
            credentials: 'same-origin' // Use 'same-origin' instead of 'include' for same domain
        });
        
        // Check if response is OK
        if (!response.ok) {
            const text = await response.text();
            console.error("Server returned non-OK response:", text.substring(0, 200));
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get response text first for debugging
        const responseText = await response.text();
        console.log("Raw server response:", responseText.substring(0, 200));
        
        // Try to parse as JSON
        let result;
        try {
            result = JSON.parse(responseText);
        } catch (e) {
            console.error("Failed to parse JSON. Raw response:", responseText);
            throw new Error("Server returned invalid JSON. Check PHP errors.");
        }
        
        if (result.success) {
            console.log("Database updated successfully:", result.message);
            return true;
        } else {
            console.error("Database update failed:", result.message);
            return false;
        }
    } catch (error) {
        console.error("Error updating database:", error);
        return false;
    }
}



// LOCK FUNCTION
async function Lock() {
    if (!window.WALLET_CONNECTED) {
        safeSetInnerHTML("result", "Please connect MetaMask first.");
        return;
    }
    
    const amountInput = document.getElementById("amount");
    if (!amountInput) {
        safeSetInnerHTML("result", "Amount input not found.");
        return;
    }
    
    const amount = amountInput.value;
    if (!amount || isNaN(amount) || amount <= 0) {
        safeSetInnerHTML("result", "Please enter a valid amount.");
        return;
    }
    
    if (parseFloat(amount) < 1000) {
        safeSetInnerHTML("result", "Minimum lock amount is 1000 RCP.");
        return;
    }
    
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Get contract instances
        const tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
        const lockContract = new ethers.Contract(contractAddress, contractAbi, signer);
        
        // Convert amount to wei (18 decimals)
        const amountInWei = ethers.utils.parseUnits(amount, 18);
        
        // Step 1: Check and approve token spending
        safeSetInnerHTML("result", "Step 1: Checking allowance...");
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
		
        
        const currentAllowance = await tokenContract.allowance(window.WALLET_CONNECTED, contractAddress);
        
        if (currentAllowance.lt(amountInWei)) {
            safeSetInnerHTML("result", "Step 2: Approving token spending...");
            await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
            
            // Estimate gas for approval
            const gasEstimate = await tokenContract.estimateGas.approve(contractAddress, amountInWei);
            const gasLimit = gasEstimate.mul(120).div(100); // Add 20% buffer
            
            const approveTx = await tokenContract.approve(contractAddress, amountInWei, {
                gasLimit: gasLimit
            });
            
            safeSetInnerHTML("result", "Waiting for approval confirmation...");
            await approveTx.wait();
            
            safeSetInnerHTML("result", "Approval confirmed!");
            await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
			
        } else {
            safeSetInnerHTML("result", "Already approved. Proceeding to lock...");
            await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
			
        }
        
        // Step 3: Lock tokens
        safeSetInnerHTML("result", "Step 3: Locking tokens...");
        await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5 second delay
		
        
        // Estimate gas for lockTokens
        const lockGasEstimate = await lockContract.estimateGas.lockTokens(amountInWei);
        const lockGasLimit = lockGasEstimate.mul(120).div(100); // Add 20% buffer
        
        const lockTx = await lockContract.lockTokens(amountInWei, {
            gasLimit: lockGasLimit
        });
        
        safeSetInnerHTML("result", "Transaction sent! Waiting for confirmation...");
        const receipt = await lockTx.wait();

        // Update database after successful blockchain transaction
        const dbUpdated = await updateLockedUntilInDatabase();
        
        // Find the TokensLocked event in the receipt
        const event = receipt.events?.find(e => e.event === 'TokensLocked');
        if (event) {
            const requested = ethers.utils.formatUnits(event.args.requested, 18);
            const received = ethers.utils.formatUnits(event.args.received, 18);
            const unlockTime = new Date(event.args.unlockTime * 1000).toLocaleString();
            let dbMessage = dbUpdated ? 
                "Database updated successfully." : 
                "Warning: Database update failed. Please contact support.";
            
            safeSetInnerHTML("result", `
                <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin-top: 10px;">
                    <strong>Tokens Locked Successfully! ✓</strong><br><br>
                    Requested: ${requested} RCP<br>
                    Actually Locked: ${received} RCP (after 1% fee)<br>
                    Unlock Date: ${unlockTime}<br>
                 </div>
            `);
        } else {
            safeSetInnerHTML("result", "Tokens locked successfully! Please refresh to see your lock status.");
        }
        
        // Wait 3 seconds before updating the display
        setTimeout(async () => {
            await fetchLockStatus();
        }, 3000);
        
    } catch (error) {
        console.error("Error in Lock function:", error);
        
        let errorMessage = "Transaction failed. ";
        if (error.code === 4001) {
            errorMessage += "User denied transaction signature.";
        } else if (error.message.includes("insufficient allowance")) {
            errorMessage += "Insufficient token allowance. Please try again.";
        } else if (error.message.includes("Already has locked tokens")) {
            errorMessage += "You already have tokens locked. Withdraw first to lock more.";
        } else if (error.message.includes("Amount below minimum")) {
            errorMessage += "Minimum lock amount is 1000 RCP.";
        } else {
            errorMessage += error.message || "Unknown error occurred.";
        }
        
        safeSetInnerHTML("result", `
            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 10px;">
                <strong>Error occured!</strong> 
            </div>
        `);
    }
}

// WITHDRAW FUNCTION
async function Withdraw() {
    if (!window.WALLET_CONNECTED) {
        safeSetInnerHTML("result", "Please connect MetaMask first.");
        return;
    }
    
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
        
        // Check if user can withdraw
        const lockInfo = await contract.getUserLock(window.WALLET_CONNECTED);
        const [amount, unlockTime, canWithdraw] = lockInfo;
        
        if (amount == 0) {
            safeSetInnerHTML("result", "No tokens to withdraw.");
            return;
        }
        
        if (!canWithdraw) {
            const currentTime = Math.floor(Date.now() / 1000);
            const unlockDate = new Date(unlockTime * 1000).toLocaleString();
            
            if (currentTime < unlockTime) {
                const timeLeft = unlockTime - currentTime;
                const daysLeft = Math.ceil(timeLeft / (24 * 3600));
                
                safeSetInnerHTML("result", `
                    <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin-top: 10px;">
                        <strong>Tokens still locked!</strong><br><br>
                        Unlock Date: ${unlockDate}<br>
                        Time Remaining: ${daysLeft} day${daysLeft !== 1 ? 's' : ''}<br>
                        You can withdraw on or after ${unlockDate}
                    </div>
                `);
                return;
            }
        }
        
        // Confirm withdrawal
        const formattedAmount = ethers.utils.formatUnits(amount, 18);
        if (!confirm(`Are you sure you want to withdraw ${formattedAmount} RCP?\nNote: There is a 1% withdrawal fee.`)) {
            return;
        }
        
        // Estimate gas for withdrawal
        const gasEstimate = await contract.estimateGas.withdrawTokens();
        const gasLimit = gasEstimate.mul(120).div(100); // Add 20% buffer
        
        safeSetInnerHTML("result", "Processing withdrawal...");
        await new Promise(resolve => setTimeout(resolve, 1500));

        
        const withdrawTx = await contract.withdrawTokens({
            gasLimit: gasLimit
        });
        
        safeSetInnerHTML("result", "Transaction sent! Waiting for confirmation...");
        const receipt = await withdrawTx.wait();
        
        // Find the TokensWithdrawn event in the receipt
        const event = receipt.events?.find(e => e.event === 'TokensWithdrawn');
        if (event) {
            const withdrawnAmount = ethers.utils.formatUnits(event.args.amount, 18);
            
            safeSetInnerHTML("result", `
                <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin-top: 10px;">
                    <strong>Tokens Withdrawn Successfully! ✓</strong><br><br>
                    Amount Withdrawn: ${withdrawnAmount} RCP (after 1% fee)<br>
                 </div>
            `);
        } else {
            safeSetInnerHTML("result", "Tokens withdrawn successfully!");
        }
        
        // Wait 3 seconds before updating the display
        setTimeout(async () => {
            await fetchLockStatus();
        }, 3000);
        
    } catch (error) {
        console.error("Error in Withdraw function:", error);
        
        let errorMessage = "Withdrawal failed. ";
        if (error.code === 4001) {
            errorMessage += "User denied transaction signature.";
        } else if (error.message.includes("Lock period not ended")) {
            errorMessage += "Lock period has not ended yet.";
        } else if (error.message.includes("No tokens locked")) {
            errorMessage += "No tokens are currently locked.";
        } else {
            errorMessage += error.message || "Unknown error occurred.";
        }
        
        safeSetInnerHTML("result", `
            <div style="background-color: #f8d7da; padding: 15px; border-radius: 5px; margin-top: 10px;">
                <strong>Error occured!</strong>
            </div>
        `);
    }
}


// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if already connected
    if (window.WALLET_CONNECTED) {
         fetchLockStatus();
    }
    
    // Also check localStorage
    if (localStorage.getItem('metamaskConnected') === 'true') {
        const savedAddress = localStorage.getItem('walletAddress');
        if (savedAddress) {
            window.WALLET_CONNECTED = savedAddress;
            fetchLockStatus();
        }
    }
});

// Add this at the end of lock.js, before the window.Lock assignments

// Listen for wallet connection events from metamask-integration.js
window.addEventListener('walletConnected', function(e) {
    console.log("Wallet connected event received:", e.detail);
    if (e.detail && e.detail.address) {
        window.WALLET_CONNECTED = e.detail.address;
        console.log("WALLET_CONNECTED updated to:", window.WALLET_CONNECTED);
        fetchLockStatus();
    }
});

// Also check periodically for the first 5 seconds (backup method)
let checkCount = 0;
const checkInterval = setInterval(function() {
    if (window.WALLET_CONNECTED) {
        console.log("WALLET_CONNECTED detected via polling:", window.WALLET_CONNECTED);
        fetchLockStatus();
        clearInterval(checkInterval);
    }
    checkCount++;
    if (checkCount > 10) { // Stop after 5 seconds (10 * 500ms)
        clearInterval(checkInterval);
    }
}, 500);


// Explicitly attach functions to window object
window.Lock = Lock;
window.Withdraw = Withdraw;
window.fetchLockStatus = fetchLockStatus;
window.updateLockedUntilInDatabase = updateLockedUntilInDatabase;

console.log("lock.js loaded. Lock function available:", typeof window.Lock);
console.log("lock.js loaded. Withdraw function available:", typeof window.Withdraw);

