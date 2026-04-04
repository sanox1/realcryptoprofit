<?php
// Include the config file instead of hardcoding credentials
include 'config.php';

// Define the directory for the images
$workDir = $root_path. "nft";

try {
    // Query to find expired records using prepared statement
    $selectSql = "SELECT id, file_name FROM crypto_gallery WHERE expiry_date < CURRENT_DATE()";
    $selectStmt = $mysqli->prepare($selectSql);

    if (!$selectStmt) {
        throw new Exception("Error preparing select statement: " . $mysqli->error);
    }

    $selectStmt->execute();
    $result = $selectStmt->get_result();

    if ($result->num_rows > 0) {
        // Prepare the delete statement once for better performance
        $deleteSql = "DELETE FROM crypto_gallery WHERE id = ?";
        $deleteStmt = $mysqli->prepare($deleteSql);
        
        if (!$deleteStmt) {
            throw new Exception("Error preparing delete statement: " . $mysqli->error);
        }

        while ($row = $result->fetch_assoc()) {
            $id = $row['id'];
            $image = $row['file_name'];

            // Unlink the image file with error handling
            if (!empty($image)) {
                $filePath = $workDir . "/" . $image;
                if (file_exists($filePath)) {
                    if (unlink($filePath)) {
                        echo "Image $image deleted successfully.<br>";
                    } else {
                        echo "Warning: Failed to delete image $image.<br>";
                        // Continue with DB deletion even if file deletion fails
                    }
                } else {
                    echo "Warning: Image file $image not found.<br>";
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

    $selectStmt->close();
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
} finally {
    // Close connection
    if (isset($mysqli) && $mysqli) {
        $mysqli->close();
    }
}
?>
