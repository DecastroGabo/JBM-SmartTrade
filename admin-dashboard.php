<?php
$page_title = 'Admin Dashboard';
require_once 'includes/header.php';
requireAdmin();

$all_orders = getAllOrders();
$special_orders = getAllSpecialOrders();
$products = getAllProductsAdmin();

// Calculate statistics
$total_orders = count($all_orders);
$total_revenue = 0;
foreach ($all_orders as $order) {
    $total_revenue += $order['total'];
}
$pending_orders = count(array_filter($all_orders, function($o) { return $o['status'] === 'pending'; }));
$pending_special = count(array_filter($special_orders, function($o) { return $o['status'] === 'pending'; }));
?>

<div class="page-header">
    <div class="container">
        <h1>Admin Dashboard</h1>
    </div>
</div>

<div class="container py-4">
    <!-- Statistics Cards -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-content">
                <h3><?php echo $total_orders; ?></h3>
                <p>Total Orders</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
                <h3><?php echo formatPrice($total_revenue); ?></h3>
                <p>Total Revenue</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
                <h3><?php echo $pending_orders; ?></h3>
                <p>Pending Orders</p>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon">📋</div>
            <div class="stat-content">
                <h3><?php echo $pending_special; ?></h3>
                <p>Special Requests</p>
            </div>
        </div>
    </div>
    
    <!-- Quick Actions -->
    <div class="admin-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
            <a href="/admin-products.php" class="btn btn-primary">Manage Products</a>
            <button class="btn btn-outline" onclick="showAddProductModal()">Add New Product</button>
        </div>
    </div>
    
    <!-- Recent Orders -->
    <div class="card">
        <div class="card-header">
            <h2>Recent Orders</h2>
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach (array_slice($all_orders, 0, 10) as $order): ?>
                        <tr>
                            <td>#<?php echo str_pad($order['id'], 6, '0', STR_PAD_LEFT); ?></td>
                            <td><?php echo htmlspecialchars($order['customer_name']); ?></td>
                            <td><?php echo date('M j, Y', strtotime($order['created_at'])); ?></td>
                            <td><?php echo formatPrice($order['total']); ?></td>
                            <td><?php echo strtoupper($order['payment_method']); ?></td>
                            <td>
                                <select class="status-select" data-order-id="<?php echo $order['id']; ?>">
                                    <option value="pending" <?php echo $order['status'] === 'pending' ? 'selected' : ''; ?>>Pending</option>
                                    <option value="processing" <?php echo $order['status'] === 'processing' ? 'selected' : ''; ?>>Processing</option>
                                    <option value="shipped" <?php echo $order['status'] === 'shipped' ? 'selected' : ''; ?>>Shipped</option>
                                    <option value="delivered" <?php echo $order['status'] === 'delivered' ? 'selected' : ''; ?>>Delivered</option>
                                    <option value="cancelled" <?php echo $order['status'] === 'cancelled' ? 'selected' : ''; ?>>Cancelled</option>
                                </select>
                            </td>
                            <td>
                                <button class="btn-sm btn-outline" onclick="viewOrderDetails(<?php echo $order['id']; ?>)">View</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
    
    <!-- Special Order Requests -->
    <div class="card">
        <div class="card-header">
            <h2>Special Order Requests</h2>
        </div>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Product Description</th>
                        <th>Quantity</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($special_orders as $order): ?>
                        <tr>
                            <td>#<?php echo str_pad($order['id'], 6, '0', STR_PAD_LEFT); ?></td>
                            <td><?php echo htmlspecialchars($order['customer_name']); ?></td>
                            <td><?php echo htmlspecialchars(substr($order['product_description'], 0, 50)) . '...'; ?></td>
                            <td><?php echo $order['quantity']; ?></td>
                            <td><?php echo date('M j, Y', strtotime($order['created_at'])); ?></td>
                            <td>
                                <select class="status-select" data-special-order-id="<?php echo $order['id']; ?>">
                                    <option value="pending" <?php echo $order['status'] === 'pending' ? 'selected' : ''; ?>>Pending</option>
                                    <option value="reviewing" <?php echo $order['status'] === 'reviewing' ? 'selected' : ''; ?>>Reviewing</option>
                                    <option value="approved" <?php echo $order['status'] === 'approved' ? 'selected' : ''; ?>>Approved</option>
                                    <option value="rejected" <?php echo $order['status'] === 'rejected' ? 'selected' : ''; ?>>Rejected</option>
                                </select>
                            </td>
                            <td>
                                <button class="btn-sm btn-outline" onclick="viewSpecialOrderDetails(<?php echo $order['id']; ?>)">View</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Add Product Modal -->
<div id="addProductModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Add New Product</h2>
            <button class="modal-close" onclick="closeAddProductModal()">&times;</button>
        </div>
        <form id="addProductForm">
            <div class="form-group">
                <label for="product_name">Product Name *</label>
                <input type="text" id="product_name" name="product_name" required class="form-control">
            </div>
            
            <div class="form-group">
                <label for="product_description">Description *</label>
                <textarea id="product_description" name="product_description" rows="3" required class="form-control"></textarea>
            </div>
            
            <div class="form-group">
                <label for="product_price">Price (₱) *</label>
                <input type="number" id="product_price" name="product_price" step="0.01" required class="form-control">
            </div>
            
            <div class="form-group">
                <label for="product_category">Category *</label>
                <select id="product_category" name="product_category" required class="form-control">
                    <option value="">Select Category</option>
                    <option value="School Supplies">School Supplies</option>
                    <option value="Office Supplies and Equipment">Office Supplies and Equipment</option>
                    <option value="Medicine and Medical Supplies">Medicine and Medical Supplies</option>
                    <option value="Sports Supplies and Equipment">Sports Supplies and Equipment</option>
                    <option value="Furniture and Fixtures">Furniture and Fixtures</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="product_image">Image URL *</label>
                <input type="url" id="product_image" name="product_image" required class="form-control">
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">Add Product</button>
        </form>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
