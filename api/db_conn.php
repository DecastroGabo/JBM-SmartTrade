<?php
// 1. Precise CORS Headers
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');

// 2. Handle Pre-flight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. CONFIGURE COOKIES (This fixes the "Logout on Refresh" issue)
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 86400,    // 1 Day
        'path' => '/',
        'domain' => 'localhost',
        'secure' => false,      // Set to true only if using HTTPS
        'httponly' => true,     // Prevents JavaScript from stealing the cookie
        'samesite' => 'Lax'     // Allows the cookie to be sent across localhost ports
    ]);
    session_start();
}

// 4. Database Connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "jbm_trading";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        'success' => false, 
        'message' => 'Database connection failed: ' . $conn->connect_error
    ]);
    exit;
}
?>