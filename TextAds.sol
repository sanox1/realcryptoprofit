// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MessageBoard {
    // Use mapping for circular buffer - more flexible than fixed array
    mapping(uint256 => Message) private messages;
    uint256 private currentIndex; // Points to where NEXT message will be stored
    uint256 private messageCount; // Total number of messages ever posted
    
    struct Message {
        string content;
        address author;
        uint256 timestamp;
    }

    uint256 public constant MAX_MESSAGES = 10;
    uint256 public constant MAX_MESSAGE_LENGTH = 160;

    event MessagePosted(uint256 indexed slot, uint256 indexed sequence, address indexed author, string content);
    event MessageDeleted(uint256 indexed slot, uint256 indexed sequence, address indexed author);

    modifier sanitizedInput(string calldata str) {
        bytes memory strBytes = bytes(str);
        uint256 len = strBytes.length;
        require(len > 0 && len <= MAX_MESSAGE_LENGTH, "Invalid length");
        
        for (uint256 i = 0; i < len; i++) {
            uint256 byteVal = uint256(uint8(strBytes[i]));
            require(byteVal != 0, "Null byte detected");
            
            if (byteVal < 0x20 && byteVal != 0x09 && byteVal != 0x0A && byteVal != 0x0D) {
                revert("Control char not allowed");
            }
        }
        _;
    }

    function postMessage(string calldata _content) external sanitizedInput(_content) {
         
        uint256 slot;
        uint256 newSequence = messageCount;
        
        if (messageCount < MAX_MESSAGES) {
            // Buffer not full yet - just use messageCount as slot
            slot = messageCount;
            messages[slot] = Message({
                content: _content,
                author: msg.sender,
                timestamp: block.timestamp
            });
            messageCount++;
            
            emit MessagePosted(slot, newSequence, msg.sender, _content);
        } else {
            // Buffer is full - overwrite oldest message at currentIndex
            slot = currentIndex;
            uint256 deletedSequence = messageCount - MAX_MESSAGES;
            
            emit MessageDeleted(slot, deletedSequence, messages[slot].author);
            
            messages[slot] = Message({
                content: _content,
                author: msg.sender,
                timestamp: block.timestamp
            });
            
            currentIndex = (currentIndex + 1) % MAX_MESSAGES;
            messageCount++;
            
            emit MessagePosted(slot, newSequence, msg.sender, _content);
        }
    }

    // Get message by sequence number
    function getMessageBySequence(uint256 _sequence) public view returns (string memory, address, uint256) {
        require(_sequence < messageCount, "Sequence out of range");
        
        uint256 slot;
        if (messageCount < MAX_MESSAGES) {
            slot = _sequence;
        } else {
            require(_sequence >= messageCount - MAX_MESSAGES, "Sequence no longer stored");
            uint256 offset = _sequence - (messageCount - MAX_MESSAGES);
            slot = (currentIndex + offset) % MAX_MESSAGES;
        }
        
        Message storage msgData = messages[slot];
        require(msgData.author != address(0), "Message not found");
        return (msgData.content, msgData.author, msgData.timestamp);
    }
    
    // Get oldest currently stored message
    function getOldestMessage() external view returns (string memory, address, uint256) {
        require(messageCount > 0, "No messages");
        
        if (messageCount < MAX_MESSAGES) {
            return getMessageBySequence(0);
        } else {
            return getMessageBySequence(messageCount - MAX_MESSAGES);
        }
    }

    // Get newest message
    function getNewestMessage() external view returns (string memory, address, uint256) {
        require(messageCount > 0, "No messages");
        return getMessageBySequence(messageCount - 1);
    }
    
   
    // Get recent messages (newest first)
    function getRecentMessages(uint256 _count) external view returns (Message[] memory) {
        uint256 count = _count;
        if (count > messageCount) count = messageCount;
        
        Message[] memory recent = new Message[](count);
        if (messageCount == 0) return recent;
        
        uint256 cachedMessageCount = messageCount;
        uint256 cachedCurrentIndex = currentIndex;
        
        if (cachedMessageCount < MAX_MESSAGES) {
            // Linear mapping
            for (uint256 i = 0; i < count; i++) {
                uint256 sequence = cachedMessageCount - 1 - i;
                recent[i] = messages[sequence];
            }
        } else {
            // Circular mapping
            uint256 newestSequence = cachedMessageCount - 1;
            uint256 oldestSequence = cachedMessageCount - MAX_MESSAGES;
            uint256 newestSlot = (cachedCurrentIndex + (newestSequence - oldestSequence)) % MAX_MESSAGES;
            
            for (uint256 i = 0; i < count; i++) {
                uint256 slot;
                if (newestSlot >= i) {
                    slot = newestSlot - i;
                } else {
                    slot = newestSlot + MAX_MESSAGES - i;
                }
                recent[i] = messages[slot];
            }
        }
        
        return recent;
    }
    
    // Simple view functions
    function getMessageCount() external view returns (uint256) {
        return messageCount;
    }
    
    function getStoredMessageCount() external view returns (uint256) {
        if (messageCount < MAX_MESSAGES) {
            return messageCount;
        } else {
            return MAX_MESSAGES;
        }
    }
    
    function getCurrentWriteSlot() external view returns (uint256) {
        return currentIndex;
    }
    
    function isFull() external view returns (bool) {
        return messageCount >= MAX_MESSAGES;
    }
    
    function getOldestSlot() external view returns (uint256) {
        require(messageCount > 0, "No messages");
        if (messageCount < MAX_MESSAGES) {
            return 0;
        } else {
            return currentIndex;
        }
    }
    
    function getNewestSlot() external view returns (uint256) {
        require(messageCount > 0, "No messages");
        if (messageCount < MAX_MESSAGES) {
            return messageCount - 1;
        } else {
            uint256 oldestSequence = messageCount - MAX_MESSAGES;
            uint256 newestSequence = messageCount - 1;
            uint256 offset = newestSequence - oldestSequence;
            return (currentIndex + offset) % MAX_MESSAGES;
        }
    }
    
    function getFirstStoredSequence() external view returns (uint256) {
        if (messageCount == 0) return 0;
        if (messageCount < MAX_MESSAGES) return 0;
        return messageCount - MAX_MESSAGES;
    }
    
    function getLastStoredSequence() external view returns (uint256) {
        if (messageCount == 0) return 0;
        return messageCount - 1;
    }
}
