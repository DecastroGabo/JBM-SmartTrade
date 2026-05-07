<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/functions.php';
?>
<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($page_title) ? $page_title . ' - ' : ''; ?>JBM Trading Company</title>
    <link rel="stylesheet" href="/jbmtrading/assets/css/style.css?v=<?php echo time(); ?>">
</head>
<body>
    <nav class="navbar">
        <div class="container">
            <!-- Logo - JBM in white rounded box with red text -->
            <div class="navbar-brand">
                <a href="index.php" class="brand-link">
                    <div class="brand-box" style="background: white !important; border: 1px solid #e5e7eb !important;">
                        <span class="brand-text" style="color: #dc2626 !important;">JBM</span>
                    </div>
                    <span class="brand-name">Trading Company</span>
                </a>
            </div>
            
            <!-- Desktop Navigation -->
            <div class="navbar-menu" id="navbarMenu">
                <a href="index.php" class="nav-link">Home</a>
                
                <div class="dropdown">
                    <button class="nav-link dropdown-toggle">Products</button>
                    <div class="dropdown-menu">
                        <a href="products.php" class="dropdown-item dropdown-header-item">All Products</a>
                        <div class="dropdown-divider"></div>
                        <a href="products.php?category=School Supplies" class="dropdown-item">School Supplies</a>
                        <a href="products.php?category=Office Supplies and Equipment" class="dropdown-item">Office Supplies and Equipment</a>
                        <a href="products.php?category=Medicine and Medical Supplies" class="dropdown-item">Medicine and Medical Supplies</a>
                        <a href="products.php?category=Sports Supplies and Equipment" class="dropdown-item">Sports Supplies and Equipment</a>
                        <a href="products.php?category=Furniture and Fixtures" class="dropdown-item">Furniture and Fixtures</a>
                    </div>
                </div>
                
                <a href="about.php" class="nav-link">About</a>
                <a href="contact.php" class="nav-link">Contact</a>
                
                <?php if (isAdmin()): ?>
                    <a href="admin-dashboard.php" class="nav-link admin-link">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        Admin
                    </a>
                <?php endif; ?>
            </div>
            
            <!-- Right Side Icons -->
            <div class="navbar-actions">
                <!-- Dark Mode Toggle -->
                <button id="themeToggle" class="btn-icon" title="Toggle dark mode">
                    <svg class="theme-icon sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <svg class="theme-icon moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
                
                <!-- Shopping Cart -->
                <a href="cart.php" class="btn-icon cart-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <?php if (isLoggedIn() && getCartCount() > 0): ?>
                        <span class="cart-count"><?php echo getCartCount(); ?></span>
                    <?php endif; ?>
                </a>
                
                <!-- User Menu or Login/Register -->
                <?php if (isLoggedIn()): ?>
                    <div class="dropdown user-dropdown">
                        <button class="btn-icon user-menu-btn">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                            <span class="user-name"><?php echo htmlspecialchars($_SESSION['user_name']); ?></span>
                        </button>
                        <div class="dropdown-menu dropdown-menu-right user-menu">
                            <div class="user-info">
                                <p class="user-info-name"><?php echo htmlspecialchars($_SESSION['user_name']); ?></p>
                                <p class="user-info-email"><?php echo htmlspecialchars($_SESSION['user_email']); ?></p>
                            </div>
                            <a href="orders.php" class="dropdown-item">My Orders</a>
                            <a href="logout.php" class="dropdown-item logout-item">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Sign Out
                            </a>
                        </div>
                    </div>
                <?php else: ?>
                    <div class="auth-links">
                        <a href="login.php" class="nav-link">Login</a>
                        <a href="register.php" class="btn btn-primary">Sign Up</a>
                    </div>
                <?php endif; ?>
                
                <!-- Mobile Menu Toggle -->
                <button class="mobile-menu-toggle" id="mobileMenuToggle">
                    <svg class="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    <svg class="close-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Mobile Menu -->
        <div class="mobile-menu" id="mobileMenu">
            <a href="index.php" class="mobile-link">Home</a>
            <a href="products.php" class="mobile-link">Products</a>
            <a href="products.php?category=School Supplies" class="mobile-link">School Supplies</a>
            <a href="products.php?category=Office Supplies and Equipment" class="mobile-link">Office Supplies</a>
            <a href="products.php?category=Medicine and Medical Supplies" class="mobile-link">Medical Supplies</a>
            <a href="products.php?category=Sports Supplies and Equipment" class="mobile-link">Sports Supplies</a>
            <a href="products.php?category=Furniture and Fixtures" class="mobile-link">Furniture</a>
            <a href="about.php" class="mobile-link">About</a>
            <a href="contact.php" class="mobile-link">Contact</a>
            
            <?php if (isAdmin()): ?>
                <a href="admin-dashboard.php" class="mobile-link admin-link">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                    Admin Dashboard
                </a>
            <?php endif; ?>
            
            <?php if (isLoggedIn()): ?>
                <div class="mobile-user-info">
                    <p class="mobile-user-name"><?php echo htmlspecialchars($_SESSION['user_name']); ?></p>
                    <p class="mobile-user-email"><?php echo htmlspecialchars($_SESSION['user_email']); ?></p>
                    <a href="orders.php" class="mobile-link">My Orders</a>
                    <a href="logout.php" class="mobile-link logout-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Sign Out
                    </a>
                </div>
            <?php else: ?>
                <div class="mobile-auth">
                    <a href="login.php" class="mobile-link">Login</a>
                    <a href="register.php" class="btn btn-primary btn-block">Sign Up</a>
                </div>
            <?php endif; ?>
        </div>
    </nav>
    
    <main class="main-content">