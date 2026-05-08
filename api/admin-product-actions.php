<?php
// 1. CLEAR & SUPPRESS RAW HTML WARNINGS
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 2. STRENGTHEN CORS & CORB SECURITY HEADERS
header("Access-Control-Allow-Origin: https://jbm-smart-trade.vercel.app");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");
header("X-Content-Type-Options: nosniff"); // Crucial to stop Chrome CORB blocking

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit;
}

// 3. INCLUDE DATABASE (Initializes DB and Sessions)
require_once 'db_conn.php'; 

// Check Admin Authorization
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Unauthorized access']);
    exit;
}

// 4. PARSE THE JSON INPUT SAFELY
$raw_input = file_get_contents('php://input');
$data = json_decode($raw_input, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid JSON payload received by server']);
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
            // Convert status string ('available' / 'unavailable') to database integer (1 / 0)
            $newStatus = ($statusInput === 'available' || $statusInput === 1 || $statusInput === '1') ? 1 : 0;

            // Database column check: Uses 'Prod_available' and 'Prod_ID'
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

        case 'update_price':
            $newPrice = $data['price'] ?? null;
            if ($newPrice === null) {
                throw new Exception("Missing price value");
            }
            $stmt = $conn->prepare("UPDATE productprice SET PP_ProdPrice = ? WHERE Prod_ID = ? AND (PP_ValidTo IS NULL OR PP_ValidTo > NOW())");
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $stmt->bind_param("di", $newPrice, $product_id);
            if (!$stmt->execute()) {
                throw new Exception("Execute failed: " . $stmt->error);
            }
            $stmt->close();
            break;

        case 'delete':
            // Delete safely from child tables first to avoid foreign key blocks
            if (!$conn->query("DELETE FROM product_image WHERE Prod_ID = " . (int)$product_id)) {
                throw new Exception("Delete image failed: " . $conn->error);
            }
            if (!$conn->query("DELETE FROM productprice WHERE Prod_ID = " . (int)$product_id)) {
                throw new Exception("Delete price failed: " . $conn->error);
            }
            if (!$conn->query("DELETE FROM products WHERE Prod_ID = " . (int)$product_id)) {
                throw new Exception("Delete product failed: " . $conn->error);
            }
            break;

        default:
            throw new Exception("Invalid action: " . $action);
    }

    // Success: Clear buffer and output clean JSON
    ob_end_clean();
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    // If anything fails in the SQL, return it safely as JSON so JavaScript doesn't crash!
    ob_end_clean();
    echo json_encode([
        'success' => false, 
        'message' => 'Backend Error: ' . $e->getMessage()
    ]);
}
?>