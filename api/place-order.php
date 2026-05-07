<?php
// 1. Include Master Connection (Handles Headers, Session, and DB)
require_once 'db_conn.php'; 

// 2. Read JSON Input
$data = json_decode(file_get_contents("php://input"));

// 3. Validation
if (!isset($data->items) || count($data->items) === 0) {
    echo json_encode(["success" => false, "message" => "Cart is empty"]);
    exit;
}

// 4. Start Transaction (All or Nothing)
$conn->begin_transaction();

try {
    // Step A: Prepare Variables
    // We check if user is logged in via session, fallback to input data
    $user_id = $_SESSION['user_id'] ?? null;
    
    // If not logged in, we set user_id to NULL for "Guest Checkout"
    if (!$user_id && isset($data->user_id) && is_numeric($data->user_id)) {
        $user_id = $data->user_id;
    }

    $name = $data->customer_name ?? 'Guest';
    $email = $data->customer_email ?? '';
    $phone = $data->customer_phone ?? '';
    $address = $data->address ?? '';
    $city = $data->city ?? '';
    $postal_code = $data->postal_code ?? '';
    $payment_method = $data->payment_method ?? 'COD';
    $subtotal = $data->subtotal ?? 0;
    $total = $data->total ?? 0;

    // Step B: Insert into 'orders' table using Prepared Statement
    $stmt = $conn->prepare("INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, address, city, postal_code, payment_method, subtotal, total, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())");
    
    $stmt->bind_param("isssssssdd", $user_id, $name, $email, $phone, $address, $city, $postal_code, $payment_method, $subtotal, $total);
    
    if (!$stmt->execute()) {
        throw new Exception("Order Creation Failed: " . $stmt->error);
    }

    // Get the ID of the new order
    $order_id = $conn->insert_id;

    // Step C: Insert items into 'order_items'
    $stmt_item = $conn->prepare("INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity) VALUES (?, ?, ?, ?, ?)");

    foreach ($data->items as $item) {
        $p_id = $item->id;
        $p_name = $item->name;
        $p_price = $item->price;
        $p_qty = $item->quantity;

        $stmt_item->bind_param("iisdi", $order_id, $p_id, $p_name, $p_price, $p_qty);
        
        if (!$stmt_item->execute()) {
            throw new Exception("Item Insertion Failed for: " . $p_name);
        }
    }

    // Step D: Clear the User's Cart (Important!)
    if ($user_id) {
        $stmt_clear = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
        $stmt_clear->bind_param("i", $user_id);
        $stmt_clear->execute();
    }

    // Step E: Commit everything
    $conn->commit();
    echo json_encode(["success" => true, "message" => "Order placed successfully!", "order_id" => $order_id]);

} catch (Exception $e) {
    // Undo changes if anything failed
    $conn->rollback();
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
?>