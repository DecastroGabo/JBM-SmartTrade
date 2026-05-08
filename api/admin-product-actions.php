<?php
// 1. CLEAR & SUPPRESS RAW HTML WARNINGS
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 2. SECURITY & CORS HEADERS
header("Access-Control-Allow-Origin: https://jbm-smart-trade.vercel.app");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit;
}

// 3. INCLUDE DATABASE & SESSION
require_once 'db_conn.php'; 

// 4. ADMIN AUTHORIZATION CHECK
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

// 5. PARSE INPUT
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload']);
    exit;
}

$action = $data['action'] ?? '';
$product_id = $data['product_id'] ?? null;

if (!$product_id) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Missing product ID']);
    exit;
}

try {
    switch ($action) {
        case 'toggle_availability':
            $statusInput = $data['status'] ?? '';
            // Map your toggle statuses to the 'ps_status' integer (1 for active/available, 0 for inactive/unavailable)
            $newStatus = ($statusInput === 'available' || $statusInput === 1 || $statusInput === '1') ? 1 : 0;

            // Target the correct productstock table and 'ps_status' column
            $stmt = $conn->prepare("UPDATE productstock SET ps_status = ? WHERE Prod_ID = ?");
            if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);
            
            $stmt->bind_param("ii", $newStatus, $product_id);
            if (!$stmt->execute()) throw new Exception("Execute failed: " . $stmt->error);
            $stmt->close();
            break;

        case 'update_price':
            $newPrice = $data['price'] ?? null;
            if ($newPrice === null) throw new Exception("Missing price value");
            
            $stmt = $conn->prepare("UPDATE productprice SET PP_ProdPrice = ? WHERE Prod_ID = ? AND (PP_ValidTo IS NULL OR PP_ValidTo > NOW())");
            if (!$stmt) throw new Exception("Prepare failed: " . $conn->error);
            
            $stmt->bind_param("di", $newPrice, $product_id);
            if (!$stmt->execute()) throw new Exception("Execute failed: " . $stmt->error);
            $stmt->close();
            break;

        case 'delete':
            $conn->begin_transaction();
            try {
                // Safely delete from all related child tables in order to preserve referential integrity
                $conn->query("DELETE FROM product_image WHERE Prod_ID = " . (int)$product_id);
                $conn->query("DELETE FROM productprice WHERE Prod_ID = " . (int)$product_id);
                $conn->query("DELETE FROM productstock WHERE Prod_ID = " . (int)$product_id);
                $conn->query("DELETE FROM products WHERE Prod_ID = " . (int)$product_id);
                $conn->commit();
            } catch (Exception $e) {
                $conn->rollback();
                throw $e;
            }
            break;

        default:
            throw new Exception("Invalid action: " . $action);
    }

    ob_end_clean();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    ob_end_clean();
    echo json_encode([
        'success' => false, 
        'message' => 'Backend Error: ' . $e->getMessage()
    ]);
}
?>