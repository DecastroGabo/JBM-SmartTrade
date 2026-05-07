<?php
$page_title = 'Checkout';
require_once 'includes/header.php';
requireLogin();

$cart_items = getCartItems();
$subtotal = getCartSubtotal();

// Redirect if cart is empty
if (empty($cart_items)) {
    header('Location: cart.php');
    exit;
}

$shipping = 0;
$total = $subtotal + $shipping;

// Handle order submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $customer_name = clean($_POST['full_name']);
    $customer_email = clean($_POST['email']);
    $customer_phone = clean($_POST['phone']);
    $address = clean($_POST['address']);
    $city = clean($_POST['city']);
    $postal_code = clean($_POST['postal_code']);
    $notes = clean($_POST['notes']);
    $payment_method = clean($_POST['payment_method']);
    
    $user_id = $_SESSION['user_id'];
    
    // Insert order
    $order_query = "INSERT INTO orders (user_id, customer_name, customer_email, customer_phone, address, city, postal_code, notes, subtotal, total, payment_method, status) 
                    VALUES ('$user_id', '$customer_name', '$customer_email', '$customer_phone', '$address', '$city', '$postal_code', '$notes', '$subtotal', '$total', '$payment_method', 'pending')";
    
    if (mysqli_query($conn, $order_query)) {
        $order_id = mysqli_insert_id($conn);
        
        // Insert order items
        foreach ($cart_items as $item) {
            $product_id = $item['product_id'];
            $product_name = clean($item['name']);
            $product_price = $item['price'];
            $quantity = $item['quantity'];
            
            $item_query = "INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity) 
                          VALUES ('$order_id', '$product_id', '$product_name', '$product_price', '$quantity')";
            mysqli_query($conn, $item_query);
        }
        
        // Clear cart
        $clear_cart_query = "DELETE FROM cart WHERE user_id = '$user_id'";
        mysqli_query($conn, $clear_cart_query);
        
        // Redirect to success page
        header("Location: order-success.php?order_id=$order_id&total=$total");
        exit;
    }
}
?>

<div class="page-header">
    <div class="container">
        <h1>Checkout</h1>
    </div>
</div>

<div class="container py-4">
    <form method="POST" class="checkout-form">
        <div class="checkout-layout">
            <div class="checkout-main">
                <!-- Shipping Information -->
                <div class="card">
                    <h2>Shipping Information</h2>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="full_name">Full Name *</label>
                            <input type="text" id="full_name" name="full_name" required class="form-control" value="<?php echo $_SESSION['user_name']; ?>">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="email">Email *</label>
                            <input type="email" id="email" name="email" required class="form-control" value="<?php echo $_SESSION['user_email']; ?>">
                        </div>
                        
                        <div class="form-group">
                            <label for="phone">Phone *</label>
                            <input type="tel" id="phone" name="phone" required class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="address">Address *</label>
                            <input type="text" id="address" name="address" required class="form-control">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City *</label>
                            <input type="text" id="city" name="city" required class="form-control">
                        </div>
                        
                        <div class="form-group">
                            <label for="postal_code">Postal Code *</label>
                            <input type="text" id="postal_code" name="postal_code" required class="form-control">
                        </div>
                    </div>
                
                <!-- Payment Method -->
                <div class="card">
                    <h2>Payment Method</h2>
                    
                    <div class="payment-methods">
                        <label class="payment-option">
                            <input type="radio" name="payment_method" value="cod" checked>
                            <div class="payment-option-content">
                                <div class="payment-icon">💵</div>
                                <div>
                                    <strong>Cash on Delivery</strong>
                                    <p>Pay when you receive</p>
                                </div>
                            </div>
                        </label>
                        
                        <label class="payment-option">
                            <input type="radio" name="payment_method" value="gcash">
                            <div class="payment-option-content">
                                <div class="payment-icon">📱</div>
                                <div>
                                    <strong>GCash</strong>
                                    <p>Pay via GCash mobile wallet</p>
                                </div>
                            </div>
                        </label>
                        
                        <label class="payment-option">
                            <input type="radio" name="payment_method" value="bank">
                            <div class="payment-option-content">
                                <div class="payment-icon">🏦</div>
                                <div>
                                    <strong>Bank Transfer</strong>
                                    <p>Direct bank transfer</p>
                                </div>
                            </div>
                        </label>
                    </div>
                </div>
            </div>
            
            <!-- Order Summary -->
            <div class="checkout-sidebar">
                <div class="card sticky-summary">
                    <h2>Order Summary</h2>
                    
                    <div class="order-items">
                        <?php foreach ($cart_items as $item): ?>
                            <div class="order-item">
                                <img src="<?php echo $item['image']; ?>" alt="<?php echo htmlspecialchars($item['name']); ?>">
                                <div class="order-item-details">
                                    <p class="order-item-name"><?php echo htmlspecialchars($item['name']); ?></p>
                                    <p class="order-item-qty">Qty: <?php echo $item['quantity']; ?></p>
                                    <p class="order-item-price"><?php echo formatPrice($item['price'] * $item['quantity']); ?></p>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                    
                    <div class="summary-divider"></div>
                    
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span><?php echo formatPrice($subtotal); ?></span>
                    </div>
                    
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span class="text-success">FREE</span>
                    </div>
                    
                    <div class="summary-divider"></div>
                    
                    <div class="summary-row summary-total">
                        <span>Total</span>
                        <span><?php echo formatPrice($total); ?></span>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">Place Order</button>
                </div>
            </div>
        </div>
    </form>
</div>

<?php include 'includes/footer.php'; ?>
