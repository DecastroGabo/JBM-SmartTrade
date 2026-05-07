<?php
$page_title = 'Order Success';
require_once 'includes/header.php';
requireLogin();

$order_id = isset($_GET['order_id']) ? clean($_GET['order_id']) : '';
$total = isset($_GET['total']) ? $_GET['total'] : 0;
?>

<div class="container py-5">
    <div class="success-container">
        <div class="success-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
        </div>
        
        <h1>Order Placed Successfully!</h1>
        <p>Thank you for your order. We'll send you a confirmation email shortly.</p>
        
        <div class="order-summary-box">
            <p class="order-label">Order Number</p>
            <p class="order-number">#<?php echo str_pad($order_id, 6, '0', STR_PAD_LEFT); ?></p>
            
            <p class="order-label">Order Total</p>
            <p class="order-total"><?php echo formatPrice($total); ?></p>
        </div>
        
        <div class="success-actions">
            <a href="/orders.php" class="btn btn-primary">View Orders</a>
            <a href="/index.php" class="btn btn-outline">Continue Shopping</a>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
