<?php
// 1. Include the Master Connection (Handles Headers & Session)
require_once 'db_conn.php'; 

// 2. Check Admin Permissions
// Ensure 'role' matches exactly what you save in login.php
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

// 3. Read JSON Input
$input = json_decode(file_get_contents("php://input"), true);
$product_id = $input['product_id'] ?? null;

if (!$product_id) {
    echo json_encode(['success' => false, 'message' => 'Product ID is required']);
    exit;
}

// 4. Perform "Cascading Delete" via Transaction
$conn->begin_transaction();

try {
    // Step A: Remove from Cart (so users don't have a deleted item in their basket)
    $stmt1 = $conn->prepare("DELETE FROM cart WHERE product_id = ?");
    $stmt1->bind_param("i", $product_id);
    $stmt1->execute();

    // Step B: Remove Prices (from ProductPrice table)
    $stmt2 = $conn->prepare("DELETE FROM ProductPrice WHERE Prod_ID = ?");
    $stmt2->bind_param("i", $product_id);
    $stmt2->execute();

    // Step C: Remove Categories Links (from ProductCategory table)
    $stmt3 = $conn->prepare("DELETE FROM ProductCategory WHERE Prod_ID = ?");
    $stmt3->bind_param("i", $product_id);
    $stmt3->execute();

    // Step D: Finally, Delete the Product
    $stmt4 = $conn->prepare("DELETE FROM products WHERE id = ?");
    $stmt4->bind_param("i", $product_id);
    
    if (!$stmt4->execute()) {
        throw new Exception("Product deletion failed: " . $stmt4->error);
    }

    // If we got here, everything worked. Commit the changes.
    $conn->commit();
    echo json_encode(['success' => true, 'message' => 'Product deleted permanently']);

} catch (Exception $e) {
    // If any step failed, undo everything
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>