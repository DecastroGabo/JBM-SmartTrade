</main>
    
    <footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>JBM Trading Company</h3>
                    <p>Your one-stop shop for school supplies, office equipment, medical supplies, sports gear, and furniture.</p>
                </div>
                
                <div class="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="index.php">Home</a></li>
                        <li><a href="products.php">Products</a></li>
                        <li><a href="about.php">About Us</a></li>
                        <li><a href="contact.php">Contact</a></li>
                        <li><a href="special-order.php">Special Orders</a></li>
                        <?php if (isLoggedIn()): ?>
                            <li><a href="orders.php">My Orders</a></li>
                        <?php endif; ?>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Categories</h4>
                    <ul>
                        <li><a href="products.php?category=School Supplies">School Supplies</a></li>
                        <li><a href="products.php?category=Office Supplies and Equipment">Office Supplies</a></li>
                        <li><a href="products.php?category=Medicine and Medical Supplies">Medicine & Medical</a></li>
                        <li><a href="products.php?category=Sports Supplies and Equipment">Sports Supplies</a></li>
                        <li><a href="products.php?category=Furniture and Fixtures">Furniture</a></li>
                    </ul>
                </div>
                
                <div class="footer-section">
                    <h4>Contact</h4>
                    <p>Email: info@jbmtrading.com</p>
                    <p>Phone: +63 123 456 7890</p>
                    <p>Address: 123 Business Avenue, Makati City, Metro Manila, Philippines</p>
                </div>
            </div>
            
            <div class="footer-bottom">
                <p>&copy; <?php echo date('Y'); ?> JBM Trading Company. All rights reserved.</p>
            </div>
        </div>
    </footer>
    
    <script src="/jbmtrading/assets/js/script.js?v=<?php echo time(); ?>"></script>
</body>
</html>