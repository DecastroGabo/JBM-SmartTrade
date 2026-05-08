<?php
// 1. Include Master Connection
require_once 'db_conn.php'; 

// (Bypass auth check for testing)
/*
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}
*/

// 2. Read JSON Input
$input = json_decode(file_get_contents("php://input"), true);
$product_id = $input['product_id'] ?? null;
$available = isset($input['available']) ? (int)$input['available'] : null;

if (!$product_id || $available === null) {
    echo json_encode(['success' => false, 'message' => 'Missing product ID or status']);
    exit;
}

// 3. Update the Product
// FIXED QUERY: Uses the exact column names 'Prod_available' and 'Prod_ID' from your jbm_trading.sql schema
$query = "UPDATE products SET Prod_available = ? WHERE Prod_ID = ?";
$stmt = $conn->prepare($query);

// If prepare fails, output the database error so we know exactly why
if (!$stmt) {
    echo json_encode([
        'success' => false, 
        'message' => 'Prepare failed: ' . $conn->error,
        'query_attempted' => $query
    ]);
    exit;
}

$stmt->bind_param("ii", $available, $product_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Availability updated']);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
}

$stmt->close();
?>