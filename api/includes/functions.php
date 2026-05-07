<?php
// Start session if not already started
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in
function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

// Check if user is admin
function isAdmin() {
    return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
}

// Redirect if not logged in
function requireLogin() {
    if (!isLoggedIn()) {
        header('Location: /login.php');
        exit;
    }
}

// Redirect if not admin
function requireAdmin() {
    requireLogin();
    if (!isAdmin()) {
        header('Location: /index.php');
        exit;
    }
}

// Sanitize input
function clean($data) {
    global $conn;
    return mysqli_real_escape_string($conn, trim(htmlspecialchars($data)));
}

// Format price
function formatPrice($price) {
    return '₱' . number_format($price, 2);
}

// Get cart count
function getCartCount() {
    global $conn;
    if (!isLoggedIn()) {
        return 0;
    }
    
    $user_id = $_SESSION['user_id'];
    $query = "SELECT SUM(quantity) as total FROM cart WHERE user_id = '$user_id'";
    $result = mysqli_query($conn, $query);
    $row = mysqli_fetch_assoc($result);
    return $row['total'] ?? 0;
}

// Get cart items
function getCartItems() {
    global $conn;
    if (!isLoggedIn()) {
        return [];
    }
    
    $user_id = $_SESSION['user_id'];
    $query = "SELECT c.*, p.name, p.price, p.image, p.category, p.available 
              FROM cart c 
              JOIN products p ON c.product_id = p.id 
              WHERE c.user_id = '$user_id'";
    $result = mysqli_query($conn, $query);
    $items = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $items[] = $row;
    }
    return $items;
}

// Get cart subtotal
function getCartSubtotal() {
    $items = getCartItems();
    $subtotal = 0;
    foreach ($items as $item) {
        $subtotal += $item['price'] * $item['quantity'];
    }
    return $subtotal;
}

// Get product by ID
function getProductById($id) {
    global $conn;
    $id = clean($id);
    $query = "SELECT * FROM products WHERE id = '$id'";
    $result = mysqli_query($conn, $query);
    return mysqli_fetch_assoc($result);
}

// Get all products
function getAllProducts() {
    global $conn;
    $query = "SELECT * FROM products WHERE available = 1 ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);
    $products = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $products[] = $row;
    }
    return $products;
}

// Get products by category
function getProductsByCategory($category) {
    global $conn;
    $category = clean($category);
    $query = "SELECT * FROM products WHERE category = '$category' AND available = 1 ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);
    $products = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $products[] = $row;
    }
    return $products;
}

// Get all products for admin (including unavailable)
function getAllProductsAdmin() {
    global $conn;
    $query = "SELECT * FROM products ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);
    $products = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $products[] = $row;
    }
    return $products;
}

// Get user orders
function getUserOrders($user_id) {
    global $conn;
    $user_id = clean($user_id);
    $query = "SELECT * FROM orders WHERE user_id = '$user_id' ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);
    $orders = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $orders[] = $row;
    }
    return $orders;
}

// Get order items
function getOrderItems($order_id) {
    global $conn;
    $order_id = clean($order_id);
    $query = "SELECT * FROM order_items WHERE order_id = '$order_id'";
    $result = mysqli_query($conn, $query);
    $items = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $items[] = $row;
    }
    return $items;
}

// Get all orders (admin)
function getAllOrders() {
    global $conn;
    $query = "SELECT * FROM orders ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);
    $orders = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $orders[] = $row;
    }
    return $orders;
}

// Get all special orders (admin)
function getAllSpecialOrders() {
    global $conn;
    $query = "SELECT * FROM special_orders ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);
    $orders = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $orders[] = $row;
    }
    return $orders;
}

// Get user special orders
function getUserSpecialOrders($user_id) {
    global $conn;
    $user_id = clean($user_id);
    $query = "SELECT * FROM special_orders WHERE user_id = '$user_id' ORDER BY created_at DESC";
    $result = mysqli_query($conn, $query);
    $orders = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $orders[] = $row;
    }
    return $orders;
}

// Format date
function formatDate($date) {
    return date('F j, Y, g:i a', strtotime($date));
}

// Get status badge class
function getStatusBadgeClass($status) {
    $classes = [
        'pending' => 'badge-warning',
        'processing' => 'badge-info',
        'shipped' => 'badge-primary',
        'delivered' => 'badge-success',
        'cancelled' => 'badge-danger',
        'reviewing' => 'badge-info',
        'approved' => 'badge-success',
        'rejected' => 'badge-danger'
    ];
    return $classes[$status] ?? 'badge-secondary';
}
?>
