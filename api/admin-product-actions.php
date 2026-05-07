<?php
error_reporting(0);
require_once 'db_conn.php';

header('Content-Type: application/json');

// Security: Only admins can perform these actions
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

$data = json_decode(file_get_contents("php://input"));
$action = $data->action ?? '';
$product_id = (int)($data->product_id ?? 0);

if (!$product_id) {
    echo json_encode(['success' => false, 'message' => 'Product ID is missing']);
    exit;
}

try {
    switch ($action) {
        case 'delete':
            $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
            $stmt->bind_param("i", $product_id);
            $stmt->execute();
            echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
            break;

        case 'update_price':
            $new_price = (float)$data->price;
            
            // 1. Expire the old price
            $conn->query("UPDATE productprice SET PP_ValidTo = NOW() WHERE Prod_ID = $product_id AND PP_ValidTo IS NULL");
            
            // 2. Insert the new active price
            $stmt = $conn->prepare("INSERT INTO productprice (Prod_ID, Prod_Price, PP_ValidFrom) VALUES (?, ?, NOW())");
            $stmt->bind_param("id", $product_id, $new_price);
            $stmt->execute();
            
            echo json_encode(['success' => true, 'message' => 'Price updated successfully']);
            break;

        case 'toggle_availability':
            // FIX: We now convert the React string into a 1 or 0 for your 'available' column
            $status_text = $data->status ?? 'available';
            $is_available = ($status_text === 'available') ? 1 : 0;
            
            $stmt = $conn->prepare("UPDATE products SET available = ? WHERE id = ?");
            $stmt->bind_param("ii", $is_available, $product_id);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Availability updated successfully']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Update failed: ' . $conn->error]);
            }
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Unknown action requested']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
}
?>