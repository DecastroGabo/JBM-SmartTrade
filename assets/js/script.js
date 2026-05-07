// Theme Toggle
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            const menuIcon = mobileMenuToggle.querySelector('.menu-icon');
            const closeIcon = mobileMenuToggle.querySelector('.close-icon');
            
            if (mobileMenu.classList.contains('active')) {
                menuIcon.style.display = 'none';
                closeIcon.style.display = 'block';
            } else {
                menuIcon.style.display = 'block';
                closeIcon.style.display = 'none';
            }
        });
        
        // Close mobile menu when clicking on a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.remove('active');
                const menuIcon = mobileMenuToggle.querySelector('.menu-icon');
                const closeIcon = mobileMenuToggle.querySelector('.close-icon');
                menuIcon.style.display = 'block';
                closeIcon.style.display = 'none';
            });
        });
    }
    
    // Initialize all functionality
    initializeCart();
    initializeOrders();
    initializeAdmin();
});

// Cart Functionality
function initializeCart() {
    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const quantityInput = document.querySelector(`.qty-input[data-product-id="${productId}"]`);
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            
            addToCart(productId, quantity);
        });
    });
    
    // Quantity increment/decrement on products page
    const qtyBtns = document.querySelectorAll('.qty-btn');
    qtyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const input = document.querySelector(`.qty-input[data-product-id="${productId}"]`);
            
            if (!input) return;
            
            let currentValue = parseInt(input.value) || 1;
            
            if (this.classList.contains('plus')) {
                currentValue = Math.min(currentValue + 1, 999);
            } else if (this.classList.contains('minus')) {
                currentValue = Math.max(currentValue - 1, 1);
            }
            
            input.value = currentValue;
        });
    });
    
    // Cart quantity update buttons
    const cartQtyBtns = document.querySelectorAll('.cart-qty-update');
    cartQtyBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cartId = this.dataset.cartId;
            const action = this.dataset.action;
            const input = document.querySelector(`.qty-input[data-cart-id="${cartId}"]`);
            
            if (!input) return;
            
            let currentValue = parseInt(input.value) || 1;
            
            if (action === 'increase') {
                currentValue++;
            } else if (action === 'decrease' && currentValue > 1) {
                currentValue--;
            }
            
            input.value = currentValue;
            updateCartQuantity(cartId, currentValue);
        });
    });
    
    // Cart quantity input change
    const cartQtyInputs = document.querySelectorAll('.cart-item .qty-input');
    cartQtyInputs.forEach(input => {
        input.addEventListener('change', function() {
            const cartId = this.dataset.cartId;
            const quantity = Math.max(1, parseInt(this.value) || 1);
            this.value = quantity;
            updateCartQuantity(cartId, quantity);
        });
    });
    
    // Remove from cart buttons
    const removeButtons = document.querySelectorAll('.remove-cart-item');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const cartId = this.dataset.cartId;
            removeFromCart(cartId);
        });
    });
}

// Add to cart AJAX
function addToCart(productId, quantity) {
    fetch('/api/add-to-cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `product_id=${productId}&quantity=${quantity}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Product added to cart!', 'success');
            updateCartCount(data.cart_count);
        } else {
            showAlert(data.message || 'Failed to add to cart', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Failed to add to cart', 'danger');
    });
}

// Update cart quantity AJAX
function updateCartQuantity(cartId, quantity) {
    fetch('/api/update-cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `cart_id=${cartId}&quantity=${quantity}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Update subtotal display
            const cartItem = document.querySelector(`.cart-item[data-cart-id="${cartId}"]`);
            if (cartItem) {
                const price = parseFloat(data.item_price);
                const subtotal = price * quantity;
                const subtotalElement = cartItem.querySelector('.cart-item-subtotal');
                if (subtotalElement) {
                    subtotalElement.textContent = formatPrice(subtotal);
                }
            }
            
            // Update cart totals
            document.getElementById('cart-subtotal').textContent = formatPrice(data.cart_subtotal);
            document.getElementById('cart-total').textContent = formatPrice(data.cart_subtotal);
            updateCartCount(data.cart_count);
        } else {
            showAlert(data.message || 'Failed to update quantity', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Failed to update quantity', 'danger');
    });
}

// Remove from cart AJAX
function removeFromCart(cartId) {
    if (!confirm('Are you sure you want to remove this item?')) {
        return;
    }
    
    fetch('/api/remove-from-cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `cart_id=${cartId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Remove item from DOM
            const cartItem = document.querySelector(`.cart-item[data-cart-id="${cartId}"]`);
            if (cartItem) {
                cartItem.remove();
            }
            
            // Update cart totals
            document.getElementById('cart-subtotal').textContent = formatPrice(data.cart_subtotal);
            document.getElementById('cart-total').textContent = formatPrice(data.cart_subtotal);
            updateCartCount(data.cart_count);
            
            // Show empty state if no items
            if (data.cart_count === 0) {
                location.reload();
            }
            
            showAlert('Item removed from cart', 'success');
        } else {
            showAlert(data.message || 'Failed to remove item', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Failed to remove item', 'danger');
    });
}

// Update cart count badge
function updateCartCount(count) {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

// Orders Page Tabs
function initializeOrders() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to selected
            this.classList.add('active');
            document.getElementById(`${tab}-orders`).classList.add('active');
        });
    });
}

// Admin Functionality
function initializeAdmin() {
    // Order status change
    const statusSelects = document.querySelectorAll('.status-select');
    statusSelects.forEach(select => {
        select.addEventListener('change', function() {
            if (this.dataset.orderId) {
                updateOrderStatus(this.dataset.orderId, this.value);
            } else if (this.dataset.specialOrderId) {
                updateSpecialOrderStatus(this.dataset.specialOrderId, this.value);
            }
        });
    });
}

// Update order status
function updateOrderStatus(orderId, status) {
    fetch('/api/update-order-status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `order_id=${orderId}&status=${status}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Order status updated', 'success');
        } else {
            showAlert(data.message || 'Failed to update status', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Failed to update status', 'danger');
    });
}

// Update special order status
function updateSpecialOrderStatus(orderId, status) {
    fetch('/api/update-special-order-status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `order_id=${orderId}&status=${status}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Special order status updated', 'success');
        } else {
            showAlert(data.message || 'Failed to update status', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Failed to update status', 'danger');
    });
}

// Product Management
function filterByCategory(category) {
    if (category) {
        window.location.href = `/admin-products.php?category=${encodeURIComponent(category)}`;
    } else {
        window.location.href = '/admin-products.php';
    }
}

function showAddProductModal() {
    document.getElementById('addProductModal').classList.add('active');
}

function closeAddProductModal() {
    document.getElementById('addProductModal').classList.remove('active');
    document.getElementById('addProductForm').reset();
}

function showEditProductModal() {
    document.getElementById('editProductModal').classList.add('active');
}

function closeEditProductModal() {
    document.getElementById('editProductModal').classList.remove('active');
    document.getElementById('editProductForm').reset();
}

// Add product form submit
const addProductForm = document.getElementById('addProductForm');
if (addProductForm) {
    addProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        fetch('/api/add-product.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('Product added successfully', 'success');
                closeAddProductModal();
                setTimeout(() => location.reload(), 1500);
            } else {
                showAlert(data.message || 'Failed to add product', 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Failed to add product', 'danger');
        });
    });
}

// Edit product
function editProduct(productId) {
    fetch(`/api/get-product.php?id=${productId}`)
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            document.getElementById('edit_product_id').value = data.product.id;
            document.getElementById('edit_product_name').value = data.product.name;
            document.getElementById('edit_product_description').value = data.product.description;
            document.getElementById('edit_product_price').value = data.product.price;
            document.getElementById('edit_product_category').value = data.product.category;
            document.getElementById('edit_product_image').value = data.product.image;
            showEditProductModal();
        } else {
            showAlert('Failed to load product data', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Failed to load product data', 'danger');
    });
}

// Edit product form submit
const editProductForm = document.getElementById('editProductForm');
if (editProductForm) {
    editProductForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        
        fetch('/api/update-product.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showAlert('Product updated successfully', 'success');
                closeEditProductModal();
                setTimeout(() => location.reload(), 1500);
            } else {
                showAlert(data.message || 'Failed to update product', 'danger');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showAlert('Failed to update product', 'danger');
        });
    });
}

// Toggle product availability
function toggleAvailability(productId, currentStatus) {
    const newStatus = currentStatus ? 0 : 1;
    const action = newStatus ? 'available' : 'unavailable';
    
    if (!confirm(`Are you sure you want to mark this product as ${action}?`)) {
        return;
    }
    
    fetch('/api/toggle-availability.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `product_id=${productId}&available=${newStatus}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert(`Product marked as ${action}`, 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            showAlert(data.message || 'Failed to update product', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Failed to update product', 'danger');
    });
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
        return;
    }
    
    fetch('/api/delete-product.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `product_id=${productId}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showAlert('Product deleted successfully', 'success');
            setTimeout(() => location.reload(), 1500);
        } else {
            showAlert(data.message || 'Failed to delete product', 'danger');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showAlert('Failed to delete product', 'danger');
    });
}

// View order details (placeholder)
function viewOrderDetails(orderId) {
    alert(`View order #${orderId} - This feature can be expanded with a modal showing full order details`);
}

// View special order details (placeholder)
function viewSpecialOrderDetails(orderId) {
    alert(`View special order #${orderId} - This feature can be expanded with a modal showing full details`);
}

// Utility Functions
function formatPrice(price) {
    return '₱' + parseFloat(price).toFixed(2);
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.position = 'fixed';
    alert.style.top = '20px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';
    alert.style.animation = 'slideIn 0.3s ease';
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    // Remove after 3 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Close modals when clicking outside
window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});