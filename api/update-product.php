<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:5173"); 
header("Access-Control-Allow-Credentials: true"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}


require_once '../config/database.php';
require_once '../includes/functions.php';
session_start();
include 'db_conn.php'; 
if (!isAdmin()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = clean($_POST['product_id']);
    $name = clean($_POST['product_name']);
    $description = clean($_POST['product_description']);
    $price = clean($_POST['product_price']);
    $category = clean($_POST['product_category']);
    $image = clean($_POST['product_image']);
    
    if (empty($name) || empty($price) || empty($category)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }
    
    $update_query = "UPDATE products SET 
                     name = '$name', 
                     description = '$description', 
                     price = '$price', 
                     category = '$category', 
                     image = '$image' 
                     WHERE id = '$product_id'";
    
    if (mysqli_query($conn, $update_query)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update product']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
