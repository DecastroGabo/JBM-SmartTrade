<?php
error_reporting(0); // Stop warnings from breaking JSON
require_once 'db_conn.php';

header('Content-Type: application/json');

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not logged in']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    // 1. Fetch Regular Orders
    $orders_res = $conn->query("SELECT * FROM orders WHERE user_id = $user_id ORDER BY created_at DESC");
    $regular_orders = [];

    if ($orders_res) {
        while ($order = $orders_res->fetch_assoc()) {
            $order_id = $order['id'];
            
            // FIX: We join with 'productprice' instead of looking for 'oi.price'
            $items_res = $conn->query("
                SELECT oi.quantity, pp.Prod_Price as price, p.name, p.image 
                FROM order_items oi 
                JOIN products p ON oi.product_id = p.id 
                LEFT JOIN productprice pp ON p.id = pp.Prod_ID
                WHERE oi.order_id = $order_id AND (pp.PP_ValidTo IS NULL OR pp.PP_ValidTo > NOW())
            ");
            
            $order['items'] = $items_res ? $items_res->fetch_all(MYSQLI_ASSOC) : [];
            $order['isSpecialOrder'] = false;
            $regular_orders[] = $order;
        }
    }

    // 2. Fetch Special Orders
    $special_res = $conn->query("SELECT * FROM special_orders WHERE user_id = $user_id ORDER BY created_at DESC");
    $special_orders = [];
    if ($special_res) {
        while ($spec = $special_res->fetch_assoc()) {
            $spec['isSpecialOrder'] = true;
            $spec['message'] = $spec['product_description']; 
            $special_orders[] = $spec;
        }
    }

    echo json_encode([
        'success' => true,
        'orders' => array_merge($regular_orders, $special_orders)
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>