<?php
// 1. Include Master Connection (Handles Headers, Session, and DB)
require_once 'db_conn.php'; 

// 2. Check Admin Permissions
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

// 3. Read JSON Input
$input = json_decode(file_get_contents("php://input"), true);
$product_id = $input['product_id'] ?? null;
// We check if 'available' is set, allowing 0 (false) as a valid value
$available = isset($input['available']) ? (int)$input['available'] : null;

if (!$product_id || $available === null) {
    echo json_encode(['success' => false, 'message' => 'Missing product ID or status']);
    exit;
}

// 4. Update the Product
// We use a Prepared Statement for security
$stmt = $conn->prepare("UPDATE products SET available = ? WHERE id = ?");
$stmt->bind_param("ii", $available, $product_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Availability updated']);
} else {
    echo json_encode(['success' => false, 'message' => 'Update failed: ' . $stmt->error]);
}

$stmt->close();
?>