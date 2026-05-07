<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
include 'db_conn.php'; 
if (!isAdmin()) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = clean($_POST['product_name']);
    $description = clean($_POST['product_description']);
    $price = clean($_POST['product_price']);
    $category = clean($_POST['product_category']);
    $image = clean($_POST['product_image']);
    
    if (empty($name) || empty($price) || empty($category)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required']);
        exit;
    }
    
    $insert_query = "INSERT INTO products (name, description, price, category, image, available) 
                     VALUES ('$name', '$description', '$price', '$category', '$image', 1)";
    
    if (mysqli_query($conn, $insert_query)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add product']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
}
?>
