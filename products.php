<?php
$page_title = 'Products';
include 'includes/header.php';

$category = isset($_GET['category']) ? clean($_GET['category']) : '';
$products = $category ? getProductsByCategory($category) : getAllProducts();
?>

<div class="page-header">
    <div class="container">
        <h1><?php echo $category ? $category : 'All Products'; ?></h1>
        <p>Browse our extensive catalog of quality products</p>
    </div>
</div>

<div class="container py-4">
    <?php if (!isLoggedIn()): ?>
        <div class="alert alert-info">
            Please <a href="/login.php">login</a> to add items to your cart.
        </div>
    <?php endif; ?>
    
    <?php if (empty($products)): ?>
        <div class="alert alert-warning">
            No products found in this category.
        </div>
    <?php else: ?>
        <div class="products-grid">
            <?php foreach ($products as $product): ?>
                <div class="product-card" data-product-id="<?php echo $product['id']; ?>">
                    <div class="product-image">
                        <img src="<?php echo $product['image']; ?>" alt="<?php echo htmlspecialchars($product['name']); ?>">
                    </div>
                    
                    <div class="product-info">
                        <h3 class="product-name"><?php echo htmlspecialchars($product['name']); ?></h3>
                        <p class="product-description"><?php echo htmlspecialchars($product['description']); ?></p>
                        <p class="product-category"><?php echo $product['category']; ?></p>
                        
                        <div class="product-footer">
                            <div class="product-price"><?php echo formatPrice($product['price']); ?></div>
                            
                            <?php if (isLoggedIn()): ?>
                                <div class="product-actions">
                                    <div class="quantity-selector">
                                        <button class="qty-btn minus" data-product-id="<?php echo $product['id']; ?>">-</button>
                                        <input type="number" class="qty-input" value="1" min="1" max="999" data-product-id="<?php echo $product['id']; ?>">
                                        <button class="qty-btn plus" data-product-id="<?php echo $product['id']; ?>">+</button>
                                    </div>
                                    <button class="btn btn-primary add-to-cart-btn" data-product-id="<?php echo $product['id']; ?>">
                                        Add to Cart
                                    </button>
                                </div>
                            <?php else: ?>
                                <button class="btn btn-outline" onclick="window.location.href='/login.php'">
                                    Login to Order
                                </button>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

<?php include 'includes/footer.php'; ?>
