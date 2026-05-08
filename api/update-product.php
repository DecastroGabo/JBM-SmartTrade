<?php
// 1. CLEAR & SUPPRESS RAW HTML WARNINGS
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 2. STRENGTHEN CORS & SECURITY HEADERS
header("Access-Control-Allow-Origin: https://jbm-smart-trade.vercel.app");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
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

// 5. PROCESS POST REQUEST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Support both JSON fetch payloads and traditional POST forms
    $raw_input = file_get_contents('php://input');
    $json_data = json_decode($raw_input, true);

    $product_id  = $json_data['product_id']  ?? $_POST['product_id']  ?? null;
    $name        = $json_data['product_name'] ?? $_POST['product_name'] ?? null;
    $description = $json_data['product_description'] ?? $_POST['product_description'] ?? '';
    $price       = $json_data['product_price'] ?? $_POST['product_price'] ?? null;
    $category    = $json_data['product_category'] ?? $_POST['product_category'] ?? null;
    $image_url   = $json_data['product_image'] ?? $_POST['product_image'] ?? ''; 

    // 6. SANITIZE AND VALIDATE INPUTS
    $product_id  = filter_var($product_id, FILTER_SANITIZE_NUMBER_INT);
    $name        = htmlspecialchars(strip_tags(trim($name)));
    $description = htmlspecialchars(strip_tags(trim($description)));
    $price       = filter_var($price, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $category    = htmlspecialchars(strip_tags(trim($category)));
    $image_url   = filter_var(trim($image_url), FILTER_SANITIZE_URL);

    if (empty($product_id) || empty($name) || empty($price) || empty($category)) {
        ob_end_clean();
        echo json_encode(['success' => false, 'message' => 'Required fields are missing']);
        exit;
    }

    // 7. TRANSACTIONAL DATABASE WRITE
    // We use a transaction so that if one update fails, they all roll back safely.
    $conn->begin_transaction();

    try {
        // A. Update MAIN products table
        $stmtProduct = $conn->prepare("UPDATE products SET Prod_Name = ?, Prod_Description = ?, Prod_Category = ? WHERE Prod_ID = ?");
        if (!$stmtProduct) throw new Exception("Prepare products failed: " . $conn->error);
        
        $stmtProduct->bind_param("sssi", $name, $description, $category, $product_id);
        if (!$stmtProduct->execute()) throw new Exception("Execute products failed: " . $stmtProduct->error);
        $stmtProduct->close();

        // B. Update/Upsert the SEPARATE product_image table
        // We check if an image path already exists for this Prod_ID. If yes, update it. If not, insert a new one.
        $imgCheck = $conn->prepare("SELECT pi_id FROM product_image WHERE Prod_ID = ?");
        $imgCheck->bind_param("i", $product_id);
        $imgCheck->execute();
        $imgResult = $imgCheck->get_result();
        $imgCheck->close();

        if ($imgResult->num_rows > 0) {
            // Update existing image path
            $stmtImage = $conn->prepare("UPDATE product_image SET pi_imagepath = ? WHERE Prod_ID = ?");
            if (!$stmtImage) throw new Exception("Prepare image update failed: " . $conn->error);
            $stmtImage->bind_param("si", $image_url, $product_id);
        } else {
            // Insert brand new image entry if it wasn't there
            $stmtImage = $conn->prepare("INSERT INTO product_image (Prod_ID, pi_imagepath) VALUES (?, ?)");
            if (!$stmtImage) throw new Exception("Prepare image insert failed: " . $conn->error);
            $stmtImage->bind_param("is", $product_id, $image_url);
        }
        
        if (!$stmtImage->execute()) throw new Exception("Execute image save failed: " . $stmtImage->error);
        $stmtImage->close();

        // C. Update the SEPARATE pricing table
        $stmtPrice = $conn->prepare("UPDATE productprice SET PP_ProdPrice = ? WHERE Prod_ID = ? AND (PP_ValidTo IS NULL OR PP_ValidTo > NOW())");
        if (!$stmtPrice) throw new Exception("Prepare pricing failed: " . $conn->error);
        
        $stmtPrice->bind_param("di", $price, $product_id);
        if (!$stmtPrice->execute()) throw new Exception("Execute pricing failed: " . $stmtPrice->error);
        $stmtPrice->close();

        // Commit transaction if all queries succeeded
        $conn->commit();

        ob_end_clean();
        echo json_encode(['success' => true, 'message' => 'Product details, image URL, and price successfully updated']);

    } catch (Exception $e) {
        // Rollback all database actions if even one query fails
        $conn->rollback();
        
        ob_end_clean();
        echo json_encode([
            'success' => false, 
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    ob_end_clean();
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>