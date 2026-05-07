<?php
$page_title = 'Contact Us';
include 'includes/header.php';
?>

<div class="page-header">
    <div class="container">
        <h1>Contact Us</h1>
        <p>Get in touch with our team</p>
    </div>
</div>

<section class="py-5">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div class="card">
                <div class="card-header">
                    <h2>Send Us a Message</h2>
                </div>
                <form style="padding: 1.5rem;" id="contactForm">
                    <div class="form-group">
                        <label for="name">Full Name *</label>
                        <input type="text" id="name" name="name" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Phone Number</label>
                        <input type="tel" id="phone" name="phone" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="subject">Subject *</label>
                        <input type="text" id="subject" name="subject" class="form-control" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="message">Message *</label>
                        <textarea id="message" name="message" class="form-control" rows="5" required></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-lg btn-block">Send Message</button>
                </form>
            </div>
            
            <div>
                <div class="card" style="margin-bottom: 2rem;">
                    <div class="card-header">
                        <h2>Contact Information</h2>
                    </div>
                    <div style="padding: 1.5rem;">
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="margin-bottom: 0.5rem;">📍 Address</h4>
                            <p style="color: var(--text-secondary);">123 Business Avenue<br>Makati City, Metro Manila<br>Philippines 1200</p>
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="margin-bottom: 0.5rem;">📞 Phone</h4>
                            <p style="color: var(--text-secondary);">+63 123 456 7890<br>+63 987 654 3210</p>
                        </div>
                        
                        <div style="margin-bottom: 1.5rem;">
                            <h4 style="margin-bottom: 0.5rem;">📧 Email</h4>
                            <p style="color: var(--text-secondary);">info@jbmtrading.com<br>sales@jbmtrading.com</p>
                        </div>
                        
                        <div>
                            <h4 style="margin-bottom: 0.5rem;">🕒 Business Hours</h4>
                            <p style="color: var(--text-secondary);">Monday - Friday: 8:00 AM - 6:00 PM<br>Saturday: 9:00 AM - 3:00 PM<br>Sunday: Closed</p>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <h2>Quick Links</h2>
                    </div>
                    <div style="padding: 1.5rem;">
                        <p style="margin-bottom: 1rem;"><a href="products.php" style="color: var(--primary); text-decoration: none;">Browse Our Products</a></p>
                        <p style="margin-bottom: 1rem;"><a href="special-order.php" style="color: var(--primary); text-decoration: none;">Request a Special Order</a></p>
                        <p style="margin-bottom: 1rem;"><a href="about.php" style="color: var(--primary); text-decoration: none;">About JBM Trading</a></p>
                        <?php if (!isLoggedIn()): ?>
                        <p style="margin-bottom: 0;"><a href="register.php" style="color: var(--primary); text-decoration: none;">Create an Account</a></p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<script>
// Contact form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // In a real application, this would send the data to a server
    showAlert('Thank you for your message! We will get back to you soon.', 'success');
    this.reset();
});
</script>

<?php include 'includes/footer.php'; ?>