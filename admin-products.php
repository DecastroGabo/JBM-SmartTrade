<?php
$page_title = 'Product Management';
require_once 'includes/header.php';
requireAdmin();

$products = getAllProductsAdmin();
$category_filter = isset($_GET['category']) ? clean($_GET['category']) : '';

if ($category_filter) {
    $products = array_filter($products, function($p) use ($category_filter) {
        return $p['category'] === $category_filter;
    });
}
?>

<div class="page-header">
    <div class="container">
        <h1>Product Management</h1>
        <button class="btn btn-primary" onclick="showAddProductModal()">Add New Product</button>
    </div>
</div>

<div class="container py-4">
    <!-- Filter -->
    <div class="filter-bar">
        <select id="categoryFilter" class="form-control" onchange="filterByCategory(this.value)">
            <option value="">All Categories</option>
            <option value="School Supplies" <?php echo $category_filter === 'School Supplies' ? 'selected' : ''; ?>>School Supplies</option>
            <option value="Office Supplies and Equipment" <?php echo $category_filter === 'Office Supplies and Equipment' ? 'selected' : ''; ?>>Office Supplies</option>
            <option value="Medicine and Medical Supplies" <?php echo $category_filter === 'Medicine and Medical Supplies' ? 'selected' : ''; ?>>Medicine & Medical</option>
            <option value="Sports Supplies and Equipment" <?php echo $category_filter === 'Sports Supplies and Equipment' ? 'selected' : ''; ?>>Sports Supplies</option>
            <option value="Furniture and Fixtures" <?php echo $category_filter === 'Furniture and Fixtures' ? 'selected' : ''; ?>>Furniture</option>
        </select>
    </div>
    
    <!-- Products Table -->
    <div class="card">
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($products as $product): ?>
                        <tr>
                            <td><?php echo $product['id']; ?></td>
                            <td>
                                <img src="<?php echo $product['image']; ?>" alt="<?php echo htmlspecialchars($product['name']); ?>" class="product-thumb">
                            </td>
                            <td><?php echo htmlspecialchars($product['name']); ?></td>
                            <td><?php echo $product['category']; ?></td>
                            <td><?php echo formatPrice($product['price']); ?></td>
                            <td>
                                <span class="badge <?php echo $product['available'] ? 'badge-success' : 'badge-danger'; ?>">
                                    <?php echo $product['available'] ? 'Available' : 'Unavailable'; ?>
                                </span>
                            </td>
                            <td>
                                <button class="btn-sm btn-primary" onclick="editProduct(<?php echo $product['id']; ?>)">Edit</button>
                                <button class="btn-sm btn-warning" onclick="toggleAvailability(<?php echo $product['id']; ?>, <?php echo $product['available']; ?>)">
                                    <?php echo $product['available'] ? 'Mark Unavailable' : 'Mark Available'; ?>
                                </button>
                                <button class="btn-sm btn-danger" onclick="deleteProduct(<?php echo $product['id']; ?>)">Delete</button>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Edit Product Modal -->
<div id="editProductModal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h2>Edit Product</h2>
            <button class="modal-close" onclick="closeEditProductModal()">&times;</button>
        </div>
        <form id="editProductForm">
            <input type="hidden" id="edit_product_id" name="product_id">
            
            <div class="form-group">
                <label for="edit_product_name">Product Name *</label>
                <input type="text" id="edit_product_name" name="product_name" required class="form-control">
            </div>
            
            <div class="form-group">
                <label for="edit_product_description">Description *</label>
                <textarea id="edit_product_description" name="product_description" rows="3" required class="form-control"></textarea>
            </div>
            
            <div class="form-group">
                <label for="edit_product_price">Price (₱) *</label>
                <input type="number" id="edit_product_price" name="product_price" step="0.01" required class="form-control">
            </div>
            
            <div class="form-group">
                <label for="edit_product_category">Category *</label>
                <select id="edit_product_category" name="product_category" required class="form-control">
                    <option value="School Supplies">School Supplies</option>
                    <option value="Office Supplies and Equipment">Office Supplies and Equipment</option>
                    <option value="Medicine and Medical Supplies">Medicine and Medical Supplies</option>
                    <option value="Sports Supplies and Equipment">Sports Supplies and Equipment</option>
                    <option value="Furniture and Fixtures">Furniture and Fixtures</option>
                </select>
            </div>
            
            <div class="form-group">
                <label for="edit_product_image">Image URL *</label>
                <input type="url" id="edit_product_image" name="product_image" required class="form-control">
            </div>
            
            <button type="submit" class="btn btn-primary btn-block">Update Product</button>
        </form>
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
