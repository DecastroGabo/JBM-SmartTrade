<?php
// 1. Updated CORS Headers for Production
// We change localhost:5173 to * so your Vercel frontend can talk to your Vercel backend
// 1. Explicitly allow ONLY your Vercel URL (NO asterisk *)
header("Access-Control-Allow-Origin: https://jbm-smart-trade.vercel.app");

// 2. Explicitly allow cookies/sessions
header("Access-Control-Allow-Credentials: true");

// 3. Define allowed methods and headers
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// 4. Set Content Type
header('Content-Type: application/json');

// 5. Handle "OPTIONS" pre-flight request (Crucial for Vercel)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. CONFIGURE COOKIES (Updated for Vercel/Cloud)
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 86400,
        'path' => '/',
        'domain' => '', // Leaving this empty lets Vercel handle the domain automatically
        'secure' => true, // SET TO TRUE: Vercel uses HTTPS
        'httponly' => true,
        'samesite' => 'None' // Necessary for cross-site requests in the cloud
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
    // Aiven REQUIRES SSL to be active for cloud connections
    //$conn->options(MYSQLI_OPT_SSL_VERIFY_SERVER_CERT, true);
    $conn->real_connect($servername, $username, $password, $dbname, $port, NULL, MYSQLI_CLIENT_SSL);
} else {
    // Local Fallback
    $conn = new mysqli("localhost", "root", "", "jbm_trading");
}

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connect Error: " . $conn->connect_error]));
}
?>