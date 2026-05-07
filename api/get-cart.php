<?php
// 1. Include the Master Connection
// This handles CORS headers, Session Start, and Database Connection automatically.
require_once 'db_conn.php'; 

$user_id = $_SESSION['user_id'] ?? null;

// 2. Security Check
if (!$user_id) {
    echo json_encode([]); // Return empty cart if not logged in
    exit;
}

// 3. The Query (Now includes Category!)
// We added the JOINs for Category so your cart shows "School Supplies" instead of nothing.
$sql = "SELECT c.id as cart_id, p.id, p.name, p.image, 
               pp.Prod_Price as price, c.quantity, cat.Cat_Name as category
        FROM cart c
        JOIN products p ON c.product_id = p.id
        JOIN ProductPrice pp ON p.id = pp.Prod_ID
        LEFT JOIN ProductCategory pc ON p.id = pc.Prod_ID
        LEFT JOIN Category cat ON pc.Cat_ID = cat.Cat_ID
        WHERE c.user_id = ? 
        AND (pp.PP_ValidTo IS NULL OR pp.PP_ValidTo > NOW())";

// 4. Secure Execution (Prepared Statement)
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    // Ensure numbers are numbers (React prefers this)
    $row['price'] = (float)$row['price'];
    $row['quantity'] = (int)$row['quantity'];
    $items[] = $row;
}

echo json_encode($items);
?>