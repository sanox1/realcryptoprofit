<?php
// Include the config file instead of hardcoding credentials
include 'config.php';

// Define the directory for the images
$workDir = $root_path. "banners";

// Query to find records where expiry_date is in the past using prepared statement
$selectSql = "SELECT id, image FROM crypto_banner WHERE expiry_date < CURRENT_DATE()";
$selectStmt = $mysqli->prepare($selectSql);

if (!$selectStmt) {
    die("Error preparing select statement: " . $mysqli->error);
}

$selectStmt->execute();
$result = $selectStmt->get_result();

if ($result->num_rows > 0) {
    // Prepare the delete statement once for better performance
    $deleteSql = "DELETE FROM crypto_banner WHERE id = ?";
    $deleteStmt = $mysqli->prepare($deleteSql);
    
    if (!$deleteStmt) {
        die("Error preparing delete statement: " . $mysqli->error);
    }

    while ($row = $result->fetch_assoc()) {
        $id = $row['id'];
        $image = $row['image'];

        // Unlink the image file
        if (!empty($image) && file_exists($workDir . "/" . $image)) {
            if (unlink($workDir . "/" . $image)) {
                echo "Image $image deleted successfully.<br>";
            } else {
                echo "Failed to delete image $image.<br>";
            }
        }

        // Delete the record from the database using prepared statement
        $deleteStmt->bind_param("i", $id);
        if ($deleteStmt->execute()) {
            echo "Record with ID $id deleted successfully.<br>";
        } else {
            echo "Error deleting record with ID $id: " . $deleteStmt->error . "<br>";
        }
    }
    
    $deleteStmt->close();
} else {
    echo "No expired records found.<br>";
}

// Close statements and connection
$selectStmt->close();
$mysqli->close();
?>