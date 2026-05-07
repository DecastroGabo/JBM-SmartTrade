<?php
// 1. Include Master Connection (Handles Headers, Session, and DB)
require_once 'db_conn.php'; 

// 2. Read JSON Input
$input = json_decode(file_get_contents("php://input"), true);

// 3. Get User ID
$user_id = $_SESSION['user_id'] ?? null;
if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

// 4. Validate Input
$product_id = $input['product_id'] ?? null;
$quantity = $input['quantity'] ?? null;

// Validate that quantity is a number and at least 1
if (!$product_id || $quantity === null || $quantity < 1) {
    echo json_encode(['success' => false, 'message' => 'Invalid product or quantity']);
    exit;
}

// 5. Update the Quantity
// We find the correct row using BOTH user_id and product_id
$stmt = $conn->prepare("UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?");
$stmt->bind_param("iii", $quantity, $user_id, $product_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows >= 0) { 
        // affected_rows can be 0 if the new quantity is the same as the old one, 
        // but that still counts as "success"
        echo json_encode(['success' => true, 'message' => 'Quantity updated']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Item not found in cart']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
?>