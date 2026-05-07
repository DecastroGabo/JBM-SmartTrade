<?php
// 1. Include Master Connection (Handles Headers, Session, and DB)
require_once 'db_conn.php'; 

// 2. Read JSON Input
$input = json_decode(file_get_contents("php://input"), true);

// 3. Get User ID from Session
$user_id = $_SESSION['user_id'] ?? null;

if (!$user_id) {
    echo json_encode(['success' => false, 'message' => 'Please login first']);
    exit;
}

// 4. Get Product ID from Input
// Note: In your CartContext, you are sending 'product_id', not 'cart_id'
$product_id = $input['product_id'] ?? null;

if (!$product_id) {
    echo json_encode(['success' => false, 'message' => 'Product ID is missing']);
    exit;
}

// 5. Delete the Item
// We use 'AND user_id = ?' to ensure users can only delete their own items
$stmt = $conn->prepare("DELETE FROM cart WHERE product_id = ? AND user_id = ?");
$stmt->bind_param("ii", $product_id, $user_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(['success' => true, 'message' => 'Item removed']);
    } else {
        // If no rows were deleted, it means the item wasn't in their cart
        echo json_encode(['success' => false, 'message' => 'Item not found in cart']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
}

$stmt->close();
?>