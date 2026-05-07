<?php
$page_title = 'My Orders';
require_once 'includes/header.php';
requireLogin();

$orders = getUserOrders($_SESSION['user_id']);
$special_orders = getUserSpecialOrders($_SESSION['user_id']);
?>

<div class="page-header">
    <div class="container">
        <h1>My Orders</h1>
    </div>
</div>

<div class="container py-4">
    <div class="orders-tabs">
        <button class="tab-btn active" data-tab="regular">Regular Orders</button>
        <button class="tab-btn" data-tab="special">Special Orders</button>
    </div>
    
    <!-- Regular Orders -->
    <div class="tab-content active" id="regular-orders">
        <?php if (empty($orders)): ?>
            <div class="empty-state">
                <p>You haven't placed any orders yet.</p>
                <a href="/products.php" class="btn btn-primary">Start Shopping</a>
            </div>
        <?php else: ?>
            <div class="orders-list">
                <?php foreach ($orders as $order): ?>
                    <?php $order_items = getOrderItems($order['id']); ?>
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <h3>Order #<?php echo str_pad($order['id'], 6, '0', STR_PAD_LEFT); ?></h3>
                                <p class="text-muted"><?php echo formatDate($order['created_at']); ?></p>
                            </div>
                            <span class="badge <?php echo getStatusBadgeClass($order['status']); ?>">
                                <?php echo ucfirst($order['status']); ?>
                            </span>
                        </div>
                        
                        <div class="order-items-list">
                            <?php foreach ($order_items as $item): ?>
                                <div class="order-item-row">
                                    <span><?php echo htmlspecialchars($item['product_name']); ?></span>
                                    <span>Qty: <?php echo $item['quantity']; ?></span>
                                    <span><?php echo formatPrice($item['product_price'] * $item['quantity']); ?></span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        
                        <div class="order-footer">
                            <div>
                                <strong>Payment Method:</strong> <?php echo strtoupper($order['payment_method']); ?>
                            </div>
                            <div class="order-total">
                                <strong>Total:</strong> <?php echo formatPrice($order['total']); ?>
                            </div>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
    
    <!-- Special Orders -->
    <div class="tab-content" id="special-orders">
        <?php if (empty($special_orders)): ?>
            <div class="empty-state">
                <p>You haven't placed any special orders yet.</p>
                <a href="/special-order.php" class="btn btn-primary">Request Special Order</a>
            </div>
        <?php else: ?>
            <div class="orders-list">
                <?php foreach ($special_orders as $order): ?>
                    <div class="order-card">
                        <div class="order-header">
                            <div>
                                <h3>Special Order #<?php echo str_pad($order['id'], 6, '0', STR_PAD_LEFT); ?></h3>
                                <p class="text-muted"><?php echo formatDate($order['created_at']); ?></p>
                            </div>
                            <span class="badge <?php echo getStatusBadgeClass($order['status']); ?>">
                                <?php echo ucfirst($order['status']); ?>
                            </span>
                        </div>
                        
                        <div class="order-details">
                            <p><strong>Product Description:</strong></p>
                            <p><?php echo htmlspecialchars($order['product_description']); ?></p>
                            <p><strong>Quantity:</strong> <?php echo $order['quantity']; ?></p>
                            <?php if ($order['notes']): ?>
                                <p><strong>Notes:</strong> <?php echo htmlspecialchars($order['notes']); ?></p>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
