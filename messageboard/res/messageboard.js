// MessageBoard Contract Configuration
const MESSAGE_BOARD_ADDRESS = "0x4B4B9e39F2459E86bAfce92b7121ebC48Ab39acA"; // Replace with your actual deployed address
const MESSAGE_BOARD_ABI = [
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_content",
                "type": "string"
            }
        ],
        "name": "postMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMessageCount",
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
        "name": "getStoredMessageCount",
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
                "internalType": "uint256",
                "name": "_count",
                "type": "uint256"
            }
        ],
        "name": "getRecentMessages",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "content",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "author",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "timestamp",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct MessageBoard.Message[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_sequence",
                "type": "uint256"
            }
        ],
        "name": "getMessageBySequence",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
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
        "name": "getOldestMessage",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
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
        "name": "getNewestMessage",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
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
        "name": "MAX_MESSAGES",
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
        "name": "MAX_MESSAGE_LENGTH",
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
        "name": "isFull",
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
        "name": "getFirstStoredSequence",
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
        "name": "getLastStoredSequence",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Global variables
let messageBoardContract;
let currentWalletAddress = "";
let isLoading = false;

// Format timestamp to readable date
function formatTimestamp(timestamp) {
    if (!timestamp) return "Unknown date";
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
}

// Shorten address for display
function shortenAddress(address) {
    if (!address) return "Unknown";
    return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

// Sanitize message for display (prevent XSS)
function sanitizeMessage(content) {
    if (!content) return "";
    // Create a temporary div element to escape HTML
    const div = document.createElement('div');
    div.textContent = content;
    return div.innerHTML;
}

// Show notification message
function showNotification(message, type = "info") {
    const notificationDiv = document.getElementById("result_board");
    if (notificationDiv) {
        const alertClass = type === "success" ? "alert-success" : (type === "error" ? "alert-error" : "alert-info");
        notificationDiv.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
        
        // Auto-hide after 5 seconds for success/info
        if (type !== "error") {
            setTimeout(() => {
                if (notificationDiv.innerHTML.includes(message)) {
                    notificationDiv.innerHTML = "";
                }
            }, 5000);
        }
    }
}

// Show loading state
function setLoading(loading, elementId = null) {
    isLoading = loading;
    const postBtn = document.getElementById("postBtn");
    const displayBtn = document.getElementById("displayBtn");
    
    if (postBtn) {
        postBtn.disabled = loading;
        postBtn.textContent = loading ? "Posting..." : "Post";
    }
    
    if (displayBtn) {
        displayBtn.disabled = loading;
        displayBtn.textContent = loading ? "Loading..." : "View";
    }
    
    if (loading) {
        showNotification("Processing transaction...", "info");
    }
}

// Get contract instance with signer
async function getContractWithSigner() {
    if (!window.ethereum) {
        throw new Error("MetaMask not installed");
    }
    
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(MESSAGE_BOARD_ADDRESS, MESSAGE_BOARD_ABI, signer);
}

// Get contract instance for read-only operations
function getContractReadOnly() {
    const provider = new ethers.providers.JsonRpcProvider("https://flare-api.flare.network/ext/C/rpc");
    return new ethers.Contract(MESSAGE_BOARD_ADDRESS, MESSAGE_BOARD_ABI, provider);
}

// Post a new message
async function post() {
    // Check if wallet is connected
    if (!window.WALLET_CONNECTED) {
        showNotification("Please connect MetaMask first!", "error");
        return;
    }
    
    // Get message input
    const messageInput = document.querySelector('input[name="text"]');
    const message = messageInput ? messageInput.value.trim() : "";
    
    // Validate message
    if (!message) {
        showNotification("Please enter a message!", "error");
        return;
    }
    
    if (message.length > 160) {
        showNotification("Message too long! Maximum 160 characters.", "error");
        return;
    }
    
    // Check for null bytes and control characters
    if (message.includes('\0')) {
        showNotification("Message contains invalid characters (null bytes).", "error");
        return;
    }
    
    // Check for control characters (except tab, newline, carriage return)
    const controlChars = message.match(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g);
    if (controlChars && controlChars.length > 0) {
        showNotification("Message contains invalid control characters.", "error");
        return;
    }
    
    setLoading(true);
    
    try {
        const contract = await getContractWithSigner();
        
        // Get current gas price
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const gasPrice = await provider.getGasPrice();
        
        // Estimate gas
        const gasEstimate = await contract.estimateGas.postMessage(message);
        
        // Send transaction with 10% buffer
        const tx = await contract.postMessage(message, {
            gasLimit: Math.floor(gasEstimate * 1.1),
            gasPrice: gasPrice
        });
        
        showNotification("Transaction sent! Waiting for confirmation...", "info");
        
        // Wait for confirmation
        await tx.wait();
        
        showNotification("Message posted successfully!", "success");
        
        // Clear input
        if (messageInput) messageInput.value = "";
        
        // Refresh the display
        await display();
        
    } catch (error) {
        console.error("Error posting message:", error);
        
        // Handle specific errors
        if (error.message.includes("Null byte detected")) {
            showNotification("Message contains null bytes. Please remove them.", "error");
        } else if (error.message.includes("Control char not allowed")) {
            showNotification("Message contains invalid control characters.", "error");
        } else if (error.message.includes("Invalid length")) {
            showNotification("Message length is invalid (must be 1-160 characters).", "error");
        } else if (error.message.includes("user rejected transaction")) {
            showNotification("Transaction rejected by user.", "error");
        } else {
            showNotification("Error posting message: " + error.message.substring(0, 200), "error");
        }
    } finally {
        setLoading(false);
    }
}

// Display all messages
async function display() {
    const postsBoard = document.getElementById("posts_board");
    if (!postsBoard) return;
    
    // Show loading indicator
    postsBoard.innerHTML = '<div class="loading"></div><p>Loading messages...</p>';
    
    try {
        const contract = getContractReadOnly();
        
        // Get message count
        const messageCount = await contract.getMessageCount();
        
        if (messageCount == 0) {
            postsBoard.innerHTML = '<p style="text-align: center; color: #666;">No messages yet. Be the first to post!</p>';
            return;
        }
        
        // Get stored message count (max 10)
        const storedCount = await contract.getStoredMessageCount();
        
        // Get recent messages
        const messages = await contract.getRecentMessages(10);
        
        // Build HTML
        let html = '<div style="max-height: 400px; overflow-y: auto;">';
        
        for (let i = 0; i < messages.length; i++) {
            const msg = messages[i];
            const isCurrentUser = window.WALLET_CONNECTED && 
                                 msg.author.toLowerCase() === window.WALLET_CONNECTED.toLowerCase();
            
            html += `
                <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 12px; margin-bottom: 12px; background: ${isCurrentUser ? '#e8f5e9' : 'white'}">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; color: #666;">
                        <span style="font-weight: bold;">👤 ${sanitizeMessage(shortenAddress(msg.author))} ${isCurrentUser ? '(You)' : ''}</span>
                        <span>🕒 ${formatTimestamp(msg.timestamp)}</span>
                    </div>
                    <div style="font-size: 14px; line-height: 1.5; word-wrap: break-word; margin-bottom: 8px;">
                        ${sanitizeMessage(msg.content)}
                    </div>
                    <div style="font-size: 11px; color: #999;">
                        Sequence: ${messageCount - storedCount + i}
                    </div>
                </div>
            `;
        }
        
        html += '</div>';
        
        // Add info footer
        html += `
            <div style="margin-top: 15px; padding: 10px; background: #f0f0f0; border-radius: 5px; font-size: 12px;">
                <div>📊 Total messages ever posted: ${messageCount}</div>
                <div>💾 Currently stored: ${storedCount} / 10 messages</div>
                <div>🔗 Contract: ${shortenAddress(MESSAGE_BOARD_ADDRESS)}</div>
            </div>
        `;
        
        postsBoard.innerHTML = html;
        
    } catch (error) {
        console.error("Error displaying messages:", error);
        postsBoard.innerHTML = `<div class="alert alert-error">Error loading messages: ${error.message.substring(0, 200)}</div>`;
    }
}

// Auto-refresh messages every 30 seconds
let autoRefreshInterval;

function startAutoRefresh() {
    if (autoRefreshInterval) clearInterval(autoRefreshInterval);
    autoRefreshInterval = setInterval(() => {
        if (!isLoading) {
            display();
        }
    }, 30000); // Refresh every 30 seconds
}

// Update wallet display when connected
function updateWalletInfo() {
    const userAddressDiv = document.getElementById("userAddress");
    const networkInfoDiv = document.getElementById("networkInfo");
    
    if (window.WALLET_CONNECTED) {
        if (userAddressDiv) {
            userAddressDiv.textContent = window.WALLET_CONNECTED;
            userAddressDiv.style.display = "block";
        }
        
        // Show wallet status in notification area
        const shortAddress = shortenAddress(window.WALLET_CONNECTED);
        showNotification(`Wallet connected: ${shortAddress}`, "success");
        
        // Refresh messages to highlight user's posts
        display();
    } else {
        if (userAddressDiv) {
            userAddressDiv.textContent = "";
            userAddressDiv.style.display = "none";
        }
    }
}

// Listen for wallet connection events
window.addEventListener('walletConnected', function(event) {
    currentWalletAddress = event.detail.address;
    updateWalletInfo();
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', async function() {
    console.log("MessageBoard frontend initializing...");
    
    // Check if contract address is configured
    if (MESSAGE_BOARD_ADDRESS === "YOUR_DEPLOYED_CONTRACT_ADDRESS") {
        const postsBoard = document.getElementById("posts_board");
        if (postsBoard) {
            postsBoard.innerHTML = '<div class="alert alert-error">⚠️ Contract address not configured! Please update MESSAGE_BOARD_ADDRESS in messageboard.js</div>';
        }
        return;
    }
    
    // Wait a bit for MetaMask integration to initialize
    setTimeout(async () => {
        // Check if wallet is already connected
        if (window.WALLET_CONNECTED) {
            currentWalletAddress = window.WALLET_CONNECTED;
            updateWalletInfo();
        }
        
        // Load initial messages
        await display();
        
        // Start auto-refresh
        startAutoRefresh();
        
        // Add input character counter
        const messageInput = document.querySelector('input[name="text"]');
        if (messageInput) {
            const counterDiv = document.createElement('div');
            counterDiv.style.cssText = "font-size: 12px; color: #666; text-align: right; margin-top: 5px;";
            counterDiv.id = "charCounter";
            messageInput.parentNode.insertBefore(counterDiv, messageInput.nextSibling);
            
            messageInput.addEventListener('input', function() {
                const remaining = 160 - this.value.length;
                const counterDiv = document.getElementById("charCounter");
                if (counterDiv) {
                    counterDiv.innerHTML = `${remaining} characters remaining`;
                    counterDiv.style.color = remaining < 0 ? "red" : (remaining < 20 ? "orange" : "#666");
                }
            });
            
            // Trigger initial counter
            messageInput.dispatchEvent(new Event('input'));
        }
        
        // Add Enter key support for posting
        if (messageInput) {
            messageInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter' && !isLoading && window.WALLET_CONNECTED) {
                    e.preventDefault();
                    post();
                }
            });
        }
        
    }, 1000);
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
});

// Export functions for global access
window.post = post;
window.display = display;
