<?php
session_start(); //
error_reporting(E_ALL); //
ini_set('display_errors', 1); //
require_once 'db_conn.php'; //

header('Content-Type: application/json'); //

if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') { //
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']); //
    exit; //
}

$data = json_decode(file_get_contents('php://input'), true); //
$action = $data['action'] ?? ''; //
$product_id = $data['product_id'] ?? null; //

if (!$product_id) { //
    echo json_encode(['success' => false, 'message' => 'Missing product ID']); //
    exit; //
}

try {
    switch ($action) {
        case 'toggle_availability':
            $statusInput = $data['status'] ?? ''; // 'available', 'unavailable', 1, or 0
            
            // Map the frontend status values into the 1 / 0 integer your database expects
            $newStatus = 0;
            if ($statusInput === 'available' || $statusInput === 1 || $statusInput === '1') {
                $newStatus = 1;
            }

            // Corrected: Set 'Prod_available' (integer) instead of 'Prod_Status' (string)
            $stmt = $conn->prepare("UPDATE products SET Prod_available = ? WHERE Prod_ID = ?");
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            
            $stmt->bind_param("ii", $newStatus, $product_id);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }
            $stmt->close();
            break;

        case 'update_price': //
            $newPrice = $data['price']; //
            $stmt = $conn->prepare("UPDATE productprice SET PP_ProdPrice = ? WHERE Prod_ID = ? AND (PP_ValidTo IS NULL OR PP_ValidTo > NOW())"); //
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $stmt->bind_param("di", $newPrice, $product_id); //
            $stmt->execute(); //
            $stmt->close();
            break;

        case 'delete': //
            $conn->query("DELETE FROM product_image WHERE Prod_ID = $product_id"); //
            $conn->query("DELETE FROM productprice WHERE Prod_ID = $product_id"); //
            $conn->query("DELETE FROM products WHERE Prod_ID = $product_id"); //
            break;

        default: //
            echo json_encode(['success' => false, 'message' => 'Invalid action']); //
            exit; //
    }

    echo json_encode(['success' => true]); //

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]); //
}
?>