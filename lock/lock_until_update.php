<?php
// update_locked_until_secure.php
session_start();

// Disable HTML error display - this is crucial
ini_set('display_errors', 0);
error_reporting(E_ALL); // Log errors but don't display

// Set JSON header first
header('Content-Type: application/json');

// Include database config
require_once 'config2.php';

// Function to send JSON response and exit
function sendResponse($success, $message, $data = null) {
    $response = ['success' => $success, 'message' => $message];
    if ($data) {
        $response['data'] = $data;
    }
    echo json_encode($response);
    exit;
}

// Check if user is logged in
if (!isset($_SESSION['lia'])) {
    sendResponse(false, 'User not authenticated');
}

// Get POST data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['locked_until'])) {
    sendResponse(false, 'Missing locked_until field');
}

$email = $_SESSION['lia'];
$locked_until = $input['locked_until'];

// Validate date format
$date = DateTime::createFromFormat('Y-m-d H:i:s', $locked_until);
if (!$date) {
    sendResponse(false, 'Invalid date format');
}

try {
    // Using your existing MySQLi connection from config2.php
    $stmt = $mysqli->prepare("UPDATE crypto_users SET locked_until = ? WHERE email = ?");
    
    if (!$stmt) {
        throw new Exception("Prepare failed: " . $mysqli->error);
    }
    
    $stmt->bind_param("ss", $locked_until, $email);
    $result = $stmt->execute();
    
    if ($result && $stmt->affected_rows > 0) {
        sendResponse(true, 'Database updated successfully');
    } else {
        // Check if user exists
        $checkStmt = $mysqli->prepare("SELECT email FROM crypto_users WHERE email = ?");
        $checkStmt->bind_param("s", $email);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows === 0) {
            sendResponse(false, 'User not found in database');
        } else {
            sendResponse(false, 'No changes made to database');
        }
    }
    
} catch (Exception $e) {
    // Log the error but don't display it
    error_log("Database error in update_locked_until: " . $e->getMessage());
    sendResponse(false, 'Database error occurred');
}
?>