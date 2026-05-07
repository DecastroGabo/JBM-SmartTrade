<?php
// Prevent any HTML warnings from breaking the JSON response
error_reporting(0); 
require_once 'db_conn.php'; 

header('Content-Type: application/json');

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

try {
    // 1. Fetch Stats - Using 'total' to match your database
    $res = $conn->query("SELECT COUNT(*) as count, SUM(total) as revenue FROM orders");
    $order_data = $res->fetch_assoc();

    // 2. Count Pending Orders
    $res_p = $conn->query("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'");
    $pending_orders = $res_p->fetch_assoc();

    // 3. Fetch ALL Special Requests with Customer Details
    // We added u.email as customer_email to solve your missing email issue
    $res_special = $conn->query("SELECT s.*, u.name as customer_name, u.email as customer_email 
                                 FROM special_orders s 
                                 JOIN users u ON s.user_id = u.id 
                                 ORDER BY s.created_at DESC");
    
    $special_requests = [];
    if ($res_special) {
        $special_requests = $res_special->fetch_all(MYSQLI_ASSOC);
    }

    // 4. Count Pending Special Requests for the stats card
    $pending_special_count = count(array_filter($special_requests, function($req) {
        return $req['status'] === 'pending';
    }));

    // 5. Fetch Recent Regular Orders
    $res_recent = $conn->query("SELECT o.*, u.name as customer_name FROM orders o 
                                JOIN users u ON o.user_id = u.id 
                                ORDER BY o.created_at DESC LIMIT 10");
    $recent_orders = $res_recent->fetch_all(MYSQLI_ASSOC);

    // 6. Clean Data for React
    $formatted_orders = array_map(function($order) {
        $order['total_amount'] = $order['total']; 
        return $order;
    }, $recent_orders);

    // 7. FINAL JSON OUTPUT
    echo json_encode([
        'success' => true,
        'stats' => [
            'totalOrders' => (int)$order_data['count'],
            'totalRevenue' => (float)($order_data['revenue'] ?? 0),
            'pendingOrders' => (int)$pending_orders['count'],
            'pendingSpecial' => $pending_special_count
        ],
        'recentOrders' => $formatted_orders,
        'specialRequests' => $special_requests 
    ]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>