<?php


$page_title = 'Home';
include 'includes/header.php';
?>

<section class="hero">
    <div class="container">
        <div class="hero-content">
            <div class="hero-actions">
                <a href="products.php" class="btn btn-primary btn-lg">Browse Products</a>
                <a href="special-order.php" class="btn btn-outline btn-lg">Request Special Order</a>
            </div>
        </div>
    </div>
</section>

<section class="categories">
    <div class="container">
        <h2 class="section-title">Our Product Categories</h2>
        
        <div class="category-grid">
            <a href="products.php?category=School Supplies" class="category-card">
                <div class="category-icon">📚</div>
                <h3>School Supplies</h3>
                <p>Everything students need for success</p>
            </a>
            
            <a href="products.php?category=Office Supplies and Equipment" class="category-card">
                <div class="category-icon">🖊️</div>
                <h3>Office Supplies</h3>
                <p>Professional office equipment and supplies</p>
            </a>
            
            <a href="products.php?category=Medicine and Medical Supplies" class="category-card">
                <div class="category-icon">⚕️</div>
                <h3>Medicine & Medical</h3>
                <p>Essential medical supplies and equipment</p>
            </a>
            
            <a href="products.php?category=Sports Supplies and Equipment" class="category-card">
                <div class="category-icon">⚽</div>
                <h3>Sports Supplies</h3>
                <p>Quality sports and fitness equipment</p>
            </a>
            
            <a href="products.php?category=Furniture and Fixtures" class="category-card">
                <div class="category-icon">🪑</div>
                <h3>Furniture & Fixtures</h3>
                <p>Durable office and commercial furniture</p>
            </a>
        </div>
    </div>
</section>

<section class="features">
    <div class="container">
        <h2 class="section-title">Why Choose JBM Trading?</h2>
        
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">✓</div>
                <h3>Quality Products</h3>
                <p>We source only the best quality products for your business needs</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">🚚</div>
                <h3>Fast Delivery</h3>
                <p>Quick and reliable delivery to your location</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">💰</div>
                <h3>Competitive Prices</h3>
                <p>B2B pricing that helps your business grow</p>
            </div>
            
            <div class="feature-card">
                <div class="feature-icon">📞</div>
                <h3>24/7 Support</h3>
                <p>Our team is always ready to assist you</p>
            </div>
        </div>
    </div>
</section>

<?php include 'includes/footer.php'; ?>