<?php
// 1. Include Master Connection
// Ensure db_conn.php contains: session_start();
require_once 'db_conn.php'; 

// 2. Check Admin Permissions
// If this fails, it means your session is not persisting across domains
/*if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}*/

// 3. Read Input (Changed from JSON to $_POST to match your script.js)
$product_id = $_POST['product_id'] ?? null;
$available = isset($_POST['available']) ? (int)$_POST['available'] : null;

if (!$product_id || $available === null) {
    echo json_encode(['success' => false, 'message' => 'Missing product ID or status']);
    exit;
}

// 4. Update the Product
// FIXED: Column names changed to Prod_available and Prod_ID to match DBeaver
$stmt = $conn->prepare("UPDATE products SET Prod_available = ? WHERE Prod_ID = ?");
$stmt->bind_param("ii", $available, $product_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Availability updated']);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
}

$stmt->close();
?>