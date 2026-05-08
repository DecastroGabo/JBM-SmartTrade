<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'db_conn.php'; 

header('Content-Type: application/json');

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$action = $data['action'] ?? '';
$product_id = $data['product_id'] ?? null;

if (!$product_id) {
    echo json_encode(['success' => false, 'message' => 'Missing product ID']);
    exit;
}

try {
    switch ($action) {
        case 'toggle_availability':
            $newStatus = $data['status']; // 'available' or 'unavailable'
            // IMPORTANT: Make sure 'Prod_Status' matches your actual DB column name
            $stmt = $conn->prepare("UPDATE products SET Prod_Status = ? WHERE Prod_ID = ?");
            $stmt->bind_param("si", $newStatus, $product_id);
            $stmt->execute();
            break;

        case 'update_price':
            $newPrice = $data['price'];
            // This updates the productprice table
            $stmt = $conn->prepare("UPDATE productprice SET PP_ProdPrice = ? WHERE Prod_ID = ? AND (PP_ValidTo IS NULL OR PP_ValidTo > NOW())");
            $stmt->bind_param("di", $newPrice, $product_id);
            $stmt->execute();
            break;

        case 'delete':
            // Be careful! This usually requires deleting from child tables first
            $conn->query("DELETE FROM product_image WHERE Prod_ID = $product_id");
            $conn->query("DELETE FROM productprice WHERE Prod_ID = $product_id");
            $conn->query("DELETE FROM products WHERE Prod_ID = $product_id");
            break;

        default:
            echo json_encode(['success' => false, 'message' => 'Invalid action']);
            exit;
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>