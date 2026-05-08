<?php
// Prevent PHP from hanging on connection failures
mysqli_report(MYSQLI_REPORT_OFF);

// 1. CORS HEADERS
header("Access-Control-Allow-Origin: https://jbm-smart-trade.vercel.app");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// 2. CONFIGURE COOKIES (Crucial fix for cross-subdomain sessions on Vercel)
if (session_status() === PHP_SESSION_NONE) {
    // Force PHP to allow cross-site/third-party cookie transmission
    ini_set('session.cookie_samesite', 'None');
    ini_set('session.cookie_secure', '1');
    ini_set('session.cookie_httponly', '1');
    
    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        // We set 'domain' to null (or omit it) so SameSite=None can be handled properly by modern browsers across different Vercel domains
        'domain' => null, 
        'secure' => true, 
        'httponly' => true,
        'samesite' => 'None' 
    ]);
    
    session_start();
}

// 3. Database Connection (Cloud Config)
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