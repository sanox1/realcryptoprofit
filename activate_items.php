#!/usr/bin/php
<?php
error_reporting(E_ALL ^ E_DEPRECATED ^ E_WARNING ^ E_NOTICE);

// Include the configuration file
require_once('config.php');

try {
    // Using the MySQLi connection from config.php
    // Update crypto_banner table
    $sql1 = "UPDATE crypto_banner SET active = 0 WHERE active = 1";
    if ($mysqli->query($sql1)) {
        $affected_banners = $mysqli->affected_rows;
        echo date('Y-m-d H:i:s') . " - Successfully activated $affected_banners banner(s).\n";
    } else {
        throw new Exception("Banner update failed: " . $mysqli->error);
    }
    
    // Update crypto_gallery table
    $sql2 = "UPDATE crypto_gallery SET valid = 0 WHERE valid = 1";
    if ($mysqli->query($sql2)) {
        $affected_gallery = $mysqli->affected_rows;
        echo date('Y-m-d H:i:s') . " - Successfully set $affected_gallery gallery item(s) to valid.\n";
    } else {
        throw new Exception("Gallery update failed: " . $mysqli->error);
    }
    
    // Close the connection
    $mysqli->close();
    
} catch (Exception $e) {
    echo date('Y-m-d H:i:s') . " - Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>