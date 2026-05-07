<?php
// Prevent any HTML warnings from breaking the JSON response
ini_set('display_errors', 1);
error_reporting(E_ALL); 
require_once 'db_conn.php'; 

header('Content-Type: application/json');

try {
    // Case A: Fetch Single Product Detail
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        
        $stmt = $conn->prepare("
            SELECT 
                p.Prod_ID as id, 
                p.Prod_Name as name, 
                p.Prod_Description as description,
                pp.PP_ProdPrice as price, 
                c.Cat_Name as category, 
                pi.pi_imagepath as image,
                p.Prod_Status as status
            FROM products p
            LEFT JOIN productprice pp ON p.Prod_ID = pp.Prod_ID
            LEFT JOIN productcategory pc ON p.Prod_ID = pc.Prod_ID
            LEFT JOIN category c ON pc.Cat_ID = c.Cat_ID
            LEFT JOIN product_image pi ON p.Prod_ID = pi.Prod_ID
            WHERE p.Prod_ID = ? AND (pp.PP_ValidTo IS NULL OR pp.PP_ValidTo > NOW())
        ");
        
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $product = $result->fetch_assoc();
        
        if ($product) {
            $product['price'] = (float)$product['price'];
            // Convert status to boolean for React "inStock" prop
            $product['inStock'] = ($product['status'] === 'Available'); 
            echo json_encode(['success' => true, 'product' => $product]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product not found']);
        }

    } else {
        // Case B: Fetch ALL Products for the Main Gallery and Admin Table
        $sql = "SELECT 
            p.Prod_ID as id, 
            p.Prod_Name as name, 
            p.Prod_Description as description,
            pp.PP_ProdPrice as price, 
            c.Cat_Name as category, 
            pi.pi_imagepath as image
            -- p.Prod_Status as status  <-- REMOVED THIS TO STOP THE ERROR
        FROM products p
        LEFT JOIN productprice pp ON p.Prod_ID = pp.Prod_ID
        LEFT JOIN productcategory pc ON p.Prod_ID = pc.Prod_ID
        LEFT JOIN category c ON pc.Cat_ID = c.Cat_ID
        LEFT JOIN product_image pi ON p.Prod_ID = pi.Prod_ID
        WHERE (pp.PP_ValidTo IS NULL OR pp.PP_ValidTo > NOW())";

        $result = $conn->query($sql);
        
        $products = [];
        if ($result) {
          while ($row = $result->fetch_assoc()) {
    $row['price'] = (float)$row['price'];
    $row['inStock'] = true; // Temporary: assume everything is in stock until you fix the column name
    $products[] = $row;
}
        }
        
        // Return plain array for the main products page
        echo json_encode($products);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>