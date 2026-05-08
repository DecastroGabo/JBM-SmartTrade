<?php
// 1. SUPPRESS RAW PHP WARNINGS (Stops unexpected HTML output from corrupting JSON)
ob_start();
ini_set('display_errors', 0);
error_reporting(E_ALL);

// 2. STRENGTHEN CORS & SECURITY HEADERS (Mandatory for Vercel deployment)
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

require_once 'db_conn.php'; 

try {
    // CASE A: Fetch Single Product Detail
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        
        // Joined with productstock to get the real 'ps_status'
        $stmt = $conn->prepare("
            SELECT 
                p.Prod_ID as id, 
                p.Prod_Name as name, 
                p.Prod_Description as description,
                pp.PP_ProdPrice as price, 
                c.Cat_Name as category, 
                pi.pi_imagepath as image,
                ps.ps_status as status
            FROM products p
            LEFT JOIN productprice pp ON p.Prod_ID = pp.Prod_ID
            LEFT JOIN productcategory pc ON p.Prod_ID = pc.Prod_ID
            LEFT JOIN category c ON pc.Cat_ID = c.Cat_ID
            LEFT JOIN product_image pi ON p.Prod_ID = pi.Prod_ID
            LEFT JOIN productstock ps ON p.Prod_ID = ps.Prod_ID
            WHERE p.Prod_ID = ? AND (pp.PP_ValidTo IS NULL OR pp.PP_ValidTo > NOW())
        ");
        
        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }

        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $product = $result->fetch_assoc();
        
        if ($product) {
            $product['price'] = (float)$product['price'];
            // Since ps_status is 1 (available) or 0 (unavailable)
            $product['inStock'] = ((int)$product['status'] === 1); 
            
            ob_end_clean();
            echo json_encode(['success' => true, 'product' => $product]);
        } else {
            ob_end_clean();
            echo json_encode(['success' => false, 'message' => 'Product not found']);
        }
        $stmt->close();

    } else {
        // CASE B: Fetch ALL Products for the Main Gallery
        $sql = "SELECT 
            p.Prod_ID as id, 
            p.Prod_Name as name, 
            p.Prod_Description as description,
            pp.PP_ProdPrice as price, 
            c.Cat_Name as category, 
            pi.pi_imagepath as image,
            ps.ps_status as status
        FROM products p
        LEFT JOIN productprice pp ON p.Prod_ID = pp.Prod_ID
        LEFT JOIN productcategory pc ON p.Prod_ID = pc.Prod_ID
        LEFT JOIN category c ON pc.Cat_ID = c.Cat_ID
        LEFT JOIN product_image pi ON p.Prod_ID = pi.Prod_ID
        LEFT JOIN productstock ps ON p.Prod_ID = ps.Prod_ID
        WHERE (pp.PP_ValidTo IS NULL OR pp.PP_ValidTo > NOW())";

        $result = $conn->query($sql);
        
        $products = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $row['price'] = (float)$row['price'];
                // Set react's inStock boolean based on ps_status (1 = true, 0 = false)
                $row['inStock'] = (isset($row['status']) && (int)$row['status'] === 1);
                $products[] = $row;
            }
        }
        
        ob_end_clean();
        echo json_encode($products);
    }

} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>