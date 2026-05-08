<?php
// Prevent PHP from hanging on connection failures
mysqli_report(MYSQLI_REPORT_OFF);

header("Access-Control-Allow-Origin: https://jbm-smart-trade.vercel.app");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// 3. CONFIGURE COOKIES (Single Point of Session Management)
// In db_conn.php
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        'domain' => '', // Empty lets Vercel handle it
        'secure' => true, // Must be true for HTTPS
        'httponly' => true,
        'samesite' => 'None' // MANDATORY for cross-site requests
    ]);
    session_start();
}

// 4. Database Connection (Cloud Config)
$db_url = getenv("DATABASE_URL");

if ($db_url) {
    $url = parse_url($db_url);
    
    $servername = $url["host"];
    $username   = $url["user"];
    $password   = $url["pass"];
    $dbname     = ltrim($url["path"], '/');
    $port       = $url["port"];

    $conn = mysqli_init();
    
    // Set connection timeout to 5 seconds to prevent 502 Bad Gateway timeouts
    $conn->options(MYSQLI_OPT_CONNECT_TIMEOUT, 5);
    
    $connected = @$conn->real_connect($servername, $username, $password, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);
    
    if (!$connected) {
        die(json_encode(["success" => false, "message" => "Aiven Connection failed: " . mysqli_connect_error()]));
    }
} else {
    // Local Fallback
    $conn = new mysqli("localhost", "root", "", "jbm_trading");
}

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connect Error: " . $conn->connect_error]));
}
?>