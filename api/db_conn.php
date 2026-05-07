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

// 4. Database Connection (Cloud Config)
$db_url = getenv("DATABASE_URL");

if ($db_url) {
    // Parse the Aiven URI
    $url = parse_url($db_url);
    
    $servername = $url["host"];
    $username   = $url["user"];
    $password   = $url["pass"];
    $dbname     = ltrim($url["path"], '/');
    $port       = $url["port"];

    // Connect using SSL (Required by Aiven)
    $conn = mysqli_init();
    $conn->ssl_set(NULL, NULL, NULL, NULL, NULL); 
    $conn->real_connect($servername, $username, $password, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);
} else {
    // Fallback for local testing
    $conn = new mysqli("localhost", "root", "", "jbm_trading");
}

if ($conn->connect_error) {
    echo json_encode([
        "success" => false, 
        "message" => "Database connection failed: " . $conn->connect_error
    ]);
    exit;
}
?>