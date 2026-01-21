<?php
// db.php - Database Connection
$servername = "localhost";
$username = "root";  // Default XAMPP/WAMP username
$password = "";      // Default is usually empty
$dbname = "pulse_db";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}
?>