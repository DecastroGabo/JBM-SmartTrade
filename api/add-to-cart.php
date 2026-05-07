<?php
// 1. SET HEADERS FIRST (Before any output)
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// 2. HANDLE PRE-FLIGHT REQUESTS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// 3. SAFE SESSION START (Prevents "Session already started" errors)
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// 4. INCLUDE DATABASE
require_once 'db_conn.php'; 

// 5. DEBUGGING (Optional: Remove after fixing)
// Uncomment the line below to see exactly what session data PHP has
// file_put_contents('debug_log.txt', print_r($_SESSION, true));

// 6. READ INPUT
$input = json_decode(file_get_contents("php://input"), true);
$product_id = isset($input['product_id']) ? (int)$input['product_id'] : null;
$quantity = isset($input['quantity']) ? (int)$input['quantity'] : 1;

// 7. CHECK LOGIN
// Ensure this key matches exactly what you set in login.php
$user_id = $_SESSION['user_id'] ?? null; 

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'User not logged in. Session ID: ' . session_id()]);
    exit;
}

if (!$product_id) {
    echo json_encode(['success' => false, 'message' => 'Product ID is missing']);
    exit;
}

// 8. DATABASE LOGIC (With Error Handling)
// Check if product is already in cart
$check_sql = "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?";
$stmt = $conn->prepare($check_sql);

if (!$stmt) {
    // If prepare fails, send the SQL error back to React
    echo json_encode(['success' => false, 'message' => 'SQL Prepare Error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ii", $user_id, $product_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows > 0) {
    // UPDATE EXISTING
    $row = $res->fetch_assoc();
    $new_qty = $row['quantity'] + $quantity;
    
    $update_stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE id = ?");
    if (!$update_stmt) {
        echo json_encode(['success' => false, 'message' => 'Update Prepare Error: ' . $conn->error]);
        exit;
    }
    $update_stmt->bind_param("ii", $new_qty, $row['id']);
    
    if ($update_stmt->execute()) {
        echo json_encode(['success' => true, 'action' => 'updated']);
    } else {
        echo json_encode(['success' => false, 'message' => $update_stmt->error]);
    }
} else {
    // INSERT NEW
    $insert_stmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
    if (!$insert_stmt) {
        echo json_encode(['success' => false, 'message' => 'Insert Prepare Error: ' . $conn->error]);
        exit;
    }
    $insert_stmt->bind_param("iii", $user_id, $product_id, $quantity);
    
    if ($insert_stmt->execute()) {
        echo json_encode(['success' => true, 'action' => 'inserted']);
    } else {
        echo json_encode(['success' => false, 'message' => $insert_stmt->error]);
    }
}
?>