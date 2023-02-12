<?php
define('DB_HOST', 'localhost');
define('DB_USER', 'root'); //id19814637_chessgame	
define('DB_PASS', ''); 
define('DB_NAME', 'chessplay'); //id19814637_chessplay


mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
$conn->set_charset('utf8mb4');

if($conn->connect_error){
    die("Connection Failed: " . $conn->connect_error);
}

?>