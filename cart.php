<?php
$page_title = 'Shopping Cart';
require_once 'includes/header.php';
requireLogin();

$cart_items = getCartItems();
$subtotal = getCartSubtotal();
?>

<div class="page-header">
    <div class="container">
        <h1>Shopping Cart</h1>
    </div>
</div>

<div class="container py-4">
    <?php if (empty($cart_items)): ?>
        <div class="empty-state">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started</p>
            <a href="/products.php" class="btn btn-primary">Browse Products</a>
        </div>
    <?php else: ?>
        <div class="cart-layout">
            <div class="cart-items">
                <?php foreach ($cart_items as $item): ?>
                    <div class="cart-item" data-cart-id="<?php echo $item['id']; ?>" data-product-id="<?php echo $item['product_id']; ?>">
                        <img src="<?php echo $item['image']; ?>" alt="<?php echo htmlspecialchars($item['name']); ?>" class="cart-item-image">
                        
                        <div class="cart-item-details">
                            <h3><?php echo htmlspecialchars($item['name']); ?></h3>
                            <p class="text-muted"><?php echo $item['category']; ?></p>
                            <p class="cart-item-price"><?php echo formatPrice($item['price']); ?></p>
                        </div>
                        
                        <div class="cart-item-actions">
                            <div class="quantity-selector">
                                <button class="qty-btn minus cart-qty-update" data-cart-id="<?php echo $item['id']; ?>" data-action="decrease">-</button>
                                <input type="number" class="qty-input" value="<?php echo $item['quantity']; ?>" min="1" max="999" data-cart-id="<?php echo $item['id']; ?>">
                                <button class="qty-btn plus cart-qty-update" data-cart-id="<?php echo $item['id']; ?>" data-action="increase">+</button>
                            </div>
                            
                            <div class="cart-item-subtotal">
                                <?php echo formatPrice($item['price'] * $item['quantity']); ?>
                            </div>
                            
                            <button class="btn-icon remove-cart-item" data-cart-id="<?php echo $item['id']; ?>" title="Remove">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
            
            <div class="cart-summary">
                <h2>Order Summary</h2>
                
                <div class="summary-row">
                    <span>Subtotal</span>
                    <span id="cart-subtotal"><?php echo formatPrice($subtotal); ?></span>
                </div>
                
                <div class="summary-row">
                    <span>Shipping</span>
                    <span class="text-success">FREE</span>
                </div>
                
                <div class="summary-divider"></div>
                
                <div class="summary-row summary-total">
                    <span>Total</span>
                    <span id="cart-total"><?php echo formatPrice($subtotal); ?></span>
                </div>
                
                <a href="/checkout.php" class="btn btn-primary btn-block">Proceed to Checkout</a>
                <a href="/products.php" class="btn btn-outline btn-block">Continue Shopping</a>
            </div>
        </div>
    <?php endif; ?>
</div>

<?php include 'includes/footer.php'; ?>
