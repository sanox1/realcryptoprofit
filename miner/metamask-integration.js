// Make WALLET_CONNECTED a global variable by attaching to window
window.WALLET_CONNECTED = "";

// Also keep a local reference if needed
let WALLET_CONNECTED = window.WALLET_CONNECTED;

 
// RCP Token Contract (for balance display)
const RCP_TOKEN_ADDRESS = "0x3D81464A248D1DB279E0fF67815c49BDD89Fd20d"; // RCP token address
const RCP_TOKEN_ABI = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint8",
          "name": "version",
          "type": "uint8"
        }
      ],
      "name": "Initialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "_decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "owner",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        }
      ],
      "name": "allowance",
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
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "balanceOf",
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
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "burn",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "internalType": "uint8",
          "name": "",
          "type": "uint8"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "subtractedValue",
          "type": "uint256"
        }
      ],
      "name": "decreaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "disableTrading",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "enableTrading",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "excludeFromTax",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "includeInTax",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "spender",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "addedValue",
          "type": "uint256"
        }
      ],
      "name": "increaseAllowance",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "marketingWallet_",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "marketingTaxPercentage_",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "initialSupply",
          "type": "uint256"
        }
      ],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "account",
          "type": "address"
        }
      ],
      "name": "isExcludedFromTax",
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
      "name": "name",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceContract",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "renounceOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "percentage",
          "type": "uint256"
        }
      ],
      "name": "setMarketingTaxPercentage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "wallet",
          "type": "address"
        }
      ],
      "name": "setMarketingWallet",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "totalSupply",
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
      "name": "tradingEnabled",
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
      "inputs": [
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "sender",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "recipient",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

// Helper function to safely update element content
function safeSetInnerHTML(elementId, content) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = content;
    }
}

// Check if user is logged in by looking for session indicators
function isUserLoggedIn() {
    // Check if we have the global variable set by PHP
    if (typeof window.isUserLoggedIn !== 'undefined') {
        return window.isUserLoggedIn;
    }
    
    // Additional check: look for elements that only appear when logged in
    const loggedInElements = document.querySelectorAll('#pointsrcp');
    return loggedInElements.length > 0;
}

// Function to update the wallet display (minimal version since element is hidden)
function updateWalletDisplay() {
    const walletDisplay = document.getElementById("wallet-display");
    if (walletDisplay && window.WALLET_CONNECTED) {
        walletDisplay.textContent = window.WALLET_CONNECTED;
    } else if (walletDisplay) {
        walletDisplay.textContent = "";
    }
}

// Initialize MetaMask connection when page loads
async function initMetaMask(notificationElementId = "metamasknotification") {
    // Check global flag first
    if (window.preventMetaMaskInit === true) {
        return false;
    }
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        // Clear any existing MetaMask session if user is not logged in
        localStorage.removeItem("metamaskConnected");
        localStorage.removeItem("walletAddress");
        window.WALLET_CONNECTED = "";
        
        // Clear notification if element exists
        if (document.getElementById(notificationElementId)) {
            safeSetInnerHTML(notificationElementId, "");
        }
        return false;
    }
    
    if (typeof window.ethereum !== 'undefined') {
        // Check if we have a persisted connection
        if (localStorage.getItem('metamaskConnected') === 'true') {
            const savedAddress = localStorage.getItem('walletAddress');
            if (savedAddress) {
                window.WALLET_CONNECTED = savedAddress;
                const shortAddress = window.WALLET_CONNECTED.substring(0, 6) + "..." + 
                    window.WALLET_CONNECTED.substring(window.WALLET_CONNECTED.length - 4);
                safeSetInnerHTML(notificationElementId, "MetaMask connected: " + shortAddress);
                
                // Update wallet display
                updateWalletDisplay();
                
                // Dispatch event to notify other scripts
                window.dispatchEvent(new CustomEvent('walletConnected', { detail: { address: window.WALLET_CONNECTED } }));
                return true;
            }
        }
        
        // Check if already connected in MetaMask
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const accounts = await provider.listAccounts();
            if (accounts.length > 0) {
                window.WALLET_CONNECTED = accounts[0];
                const shortAddress = window.WALLET_CONNECTED.substring(0, 6) + "..." + 
                    window.WALLET_CONNECTED.substring(window.WALLET_CONNECTED.length - 4);
                safeSetInnerHTML(notificationElementId, "MetaMask connected: " + shortAddress);
                
                // Persist the connection using localStorage
                localStorage.setItem('metamaskConnected', 'true');
                localStorage.setItem('walletAddress', window.WALLET_CONNECTED);
                
                // Update wallet display
                updateWalletDisplay();
                
                // Dispatch event to notify other scripts
                window.dispatchEvent(new CustomEvent('walletConnected', { detail: { address: window.WALLET_CONNECTED } }));
                return true;
            }
        } catch (error) {
            console.error("Error checking MetaMask accounts:", error);
        }
    }
    return false;
}

// Function to connect MetaMask wallet
async function connectMetamask(notificationElementId = "metamasknotification") {
    // Check if user is logged in first
    if (!isUserLoggedIn()) {
        safeSetInnerHTML(notificationElementId, "Please log in first to connect MetaMask");
        return;
    }
    
    if (typeof window.ethereum === 'undefined') {
        safeSetInnerHTML(notificationElementId, "Please install MetaMask!");
        return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Define the network you want to switch to
    const targetNetwork = {
        chainId: '0xe', // Flare chain ID in hexadecimal
    };

    try {
        // Request the user to switch to the target network
        await provider.send("wallet_switchEthereumChain", [{ chainId: targetNetwork.chainId }]);
        
        // Once the network switch is successful, proceed with connecting the wallet
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        window.WALLET_CONNECTED = await signer.getAddress();

        // Shorten the wallet address for display
        const shortAddress = window.WALLET_CONNECTED.substring(0, 6) + "..." + 
            window.WALLET_CONNECTED.substring(window.WALLET_CONNECTED.length - 4);
        safeSetInnerHTML(notificationElementId, "MetaMask connected: " + shortAddress);
        
        // Update the wallet display
        updateWalletDisplay();

        // Persist the connection using localStorage
        localStorage.setItem('metamaskConnected', 'true');
        localStorage.setItem('walletAddress', window.WALLET_CONNECTED);
        
        // Dispatch event to notify other scripts
        window.dispatchEvent(new CustomEvent('walletConnected', { detail: { address: window.WALLET_CONNECTED } }));
        
        // If we're on the profile page, fetch user data
        if (typeof fetchUserData === 'function') {
            fetchUserData();
        }
    } catch (error) {
        if (error.code === 4902) {
            // If the network is not added to MetaMask, prompt the user to add the network
            try {
                await provider.send("wallet_addEthereumChain", [{
                    chainId: targetNetwork.chainId,
                    chainName: 'flare-mainnet',
                    rpcUrls: ['https://flare-api.flare.network/ext/C/rpc'],
                    nativeCurrency: {
                        name: 'Flare',
                        symbol: 'FLR',
                        decimals: 18
                    },
                    blockExplorerUrls: ['https://14.routescan.io']
                }]);
                
                // After adding network, try connecting again
                await connectMetamask(notificationElementId);
            } catch (addError) {
                console.error("Failed to add the network:", addError);
                safeSetInnerHTML(notificationElementId, "Failed to add network");
            }
        } else {
            console.error("Failed to switch network:", error);
            safeSetInnerHTML(notificationElementId, "Failed to connect MetaMask");
        }
    }
}

// Fetch user's token balance (for profile page)
async function fetchUserData() {
    if (!window.WALLET_CONNECTED || !document.getElementById("pointsrcp")) return;

    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        
        // Use RCP Token contract for balance display
        const tokenContract = new ethers.Contract(RCP_TOKEN_ADDRESS, RCP_TOKEN_ABI, signer);

        const balance = await tokenContract.balanceOf(window.WALLET_CONNECTED);
        const tokenBalance = parseFloat(ethers.utils.formatUnits(balance, 18));
        
        const pointsElement = document.getElementById("pointsrcp");
        if (pointsElement) {
            pointsElement.textContent = tokenBalance.toFixed(2);
        }
    } catch (error) {
        console.error("Error fetching token balance:", error);
        safeSetInnerHTML("metamasknotification2", "Error fetching balance");
    }
}

// Get RCP token contract instance
function getRcpTokenContract(signer) {
    return new ethers.Contract(RCP_TOKEN_ADDRESS, RCP_TOKEN_ABI, signer);
}

// Listen for force reload events from other tabs
window.addEventListener('storage', function(event) {
    if (event.key === 'forceReload') {
        window.location.reload();
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a page that needs MetaMask
    const hasMetaMaskElement = document.getElementById("metamasknotification") || 
                               document.getElementById("metamasknotification2");
    
    if (hasMetaMaskElement) {
        const notificationId = document.getElementById("metamasknotification2") ? 
                              "metamasknotification2" : "metamasknotification";
                              
        // Only initialize if user is logged in
        if (isUserLoggedIn()) {
            if (localStorage.getItem('metamaskConnected') === 'true') {
                const savedAddress = localStorage.getItem('walletAddress');
                if (savedAddress) {
                    window.WALLET_CONNECTED = savedAddress;
                    const shortAddress = window.WALLET_CONNECTED.substring(0, 6) + "..." + 
                        window.WALLET_CONNECTED.substring(window.WALLET_CONNECTED.length - 4);
                    safeSetInnerHTML(notificationId, "MetaMask connected: " + shortAddress);
                    
                    // Update wallet display
                    updateWalletDisplay();
                    
                    // Dispatch event to notify other scripts
                    window.dispatchEvent(new CustomEvent('walletConnected', { detail: { address: window.WALLET_CONNECTED } }));
                    
                    // If we're on the profile page, fetch user data
                    if (notificationId === "metamasknotification2" && typeof window.ethereum !== 'undefined') {
                        fetchUserData();
                    }
                }
            }
            initMetaMask(notificationId);
        } else {
            // User is not logged in, clear any notifications
            safeSetInnerHTML(notificationId, "");
            updateWalletDisplay(); // Reset wallet display
        }
    }
});