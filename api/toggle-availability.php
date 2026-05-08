<?php
require_once 'db_conn.php'; 

// Read standard Form/POST input
$product_id = $_POST['product_id'] ?? null;
$available = isset($_POST['available']) ? (int)$_POST['available'] : null;

if (!$product_id || $available === null) {
    echo json_encode(['success' => false, 'message' => 'Missing product ID or status']);
    exit;
}

// Update the Product using correct DB columns
$query = "UPDATE products SET Prod_available = ? WHERE Prod_ID = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    echo json_encode([
        'success' => false, 
        'message' => 'Prepare failed: ' . $conn->error
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