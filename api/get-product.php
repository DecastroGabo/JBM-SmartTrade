<?php
// 1. Include Master Connection
require_once 'db_conn.php'; 

try {
    // Case A: Fetch Single Product
    if (isset($_GET['id'])) {
        $id = (int)$_GET['id'];
        
        // FIX: Changed p.id to p.Prod_ID and added product_image join
        $stmt = $conn->prepare("
            SELECT p.*, pp.PP_ProdPrice as price, c.Cat_Name as category, pi.pi_imagepath
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
            echo json_encode(['success' => true, 'product' => $product]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Product not found']);
        }

    } else {
        // Case B: Fetch ALL Products
        // FIX: Changed p.id to p.Prod_ID and added pi.pi_imagepath
        $sql = "SELECT p.*, pp.PP_ProdPrice as price, c.Cat_Name as category, pi.pi_imagepath 
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
                $products[] = $row;
            }
        }
        
        echo json_encode($products);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>