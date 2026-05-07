<?php
$page_title = 'Special Order Request';
require_once 'includes/header.php';
requireLogin();

$success = '';
$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $customer_name = clean($_POST['customer_name']);
    $customer_email = clean($_POST['customer_email']);
    $product_description = clean($_POST['product_description']);
    $quantity = clean($_POST['quantity']);
    $notes = clean($_POST['notes']);
    
    if (empty($product_description) || empty($quantity)) {
        $error = 'Please fill in all required fields';
    } else {
        $query = "INSERT INTO special_orders (user_id, customer_name, customer_email, product_description, quantity, notes, status) 
                  VALUES ('$user_id', '$customer_name', '$customer_email', '$product_description', '$quantity', '$notes', 'pending')";
        
        if (mysqli_query($conn, $query)) {
            $success = 'Your special order request has been submitted successfully!';
        } else {
            $error = 'Failed to submit order. Please try again.';
        }
    }
}
?>

<div class="page-header">
    <div class="container">
        <h1>Special Order Request</h1>
        <p>Can't find what you're looking for? Request a custom order!</p>
    </div>
</div>

<div class="container py-4">
    <div class="special-order-layout">
        <div class="special-order-form">
            <?php if ($success): ?>
                <div class="alert alert-success"><?php echo $success; ?></div>
            <?php endif; ?>
            
            <?php if ($error): ?>
                <div class="alert alert-danger"><?php echo $error; ?></div>
            <?php endif; ?>
            
            <div class="card">
                <h2>Request Form</h2>
                
                <form method="POST">
                    <div class="form-group">
                        <label for="customer_name">Full Name *</label>
                        <input type="text" id="customer_name" name="customer_name" required class="form-control" value="<?php echo $_SESSION['user_name']; ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="customer_email">Email *</label>
                        <input type="email" id="customer_email" name="customer_email" required class="form-control" value="<?php echo $_SESSION['user_email']; ?>">
                    </div>
                    
                    <div class="form-group">
                        <label for="product_description">Product Description *</label>
                        <textarea id="product_description" name="product_description" rows="4" required class="form-control" placeholder="Describe the product you need in detail..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="quantity">Quantity *</label>
                        <input type="number" id="quantity" name="quantity" min="1" required class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="notes">Additional Notes (Optional)</label>
                        <textarea id="notes" name="notes" rows="3" class="form-control" placeholder="Any additional information..."></textarea>
                    </div>
                    
                    <button type="submit" class="btn btn-primary btn-block">Submit Request</button>
                </form>
            </div>
        </div>
        
        <div class="special-order-info">
            <div class="card">
                <h3>How it Works</h3>
                <ol class="info-list">
                    <li>Fill out the request form with product details</li>
                    <li>Our team will review your request</li>
                    <li>We'll contact you with pricing and availability</li>
                    <li>Once approved, we'll process your order</li>
                </ol>
            </div>
            
            <div class="card">
                <h3>Why Special Orders?</h3>
                <ul class="info-list">
                    <li>✓ Custom products not in our catalog</li>
                    <li>✓ Bulk quantity discounts</li>
                    <li>✓ Personalized service</li>
                    <li>✓ Fast response time</li>
                </ul>
            </div>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
