// 1. Added 'Package' to the imports
import { Menu, X, ShoppingCart, User, LogOut, Moon, Sun, Shield, Package } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { useCart } from '@/app/contexts/CartContext';
import { useTheme } from '@/app/contexts/ThemeContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white dark:bg-card shadow-sm z-50 border-b border-gray-200 dark:border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                <span className="text-red-600 font-bold text-2xl">JBM</span>
              </div>
              <span className="text-gray-900 dark:text-foreground font-semibold text-lg hidden sm:block">
                Trading Company
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className={`transition-colors ${
                isActive('/') 
                  ? 'text-red-600 dark:text-primary font-semibold' 
                  : 'text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-primary'
              }`}
            >
              Home
            </Link>
            {/* ... (Keep other links: Products, About, Contact) ... */}
            <Link 
                to="/products"
                className={`transition-colors ${
                  isActive('/products') 
                    ? 'text-red-600 dark:text-primary font-semibold' 
                    : 'text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-primary'
                }`}
              >
                Products
            </Link>
            <Link
              to="/about"
              className={`transition-colors ${
                isActive('/about') 
                  ? 'text-red-600 dark:text-primary font-semibold' 
                  : 'text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-primary'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`transition-colors ${
                isActive('/contact') 
                  ? 'text-red-600 dark:text-primary font-semibold' 
                  : 'text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-primary'
              }`}
            >
              Contact
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className={`transition-colors flex items-center gap-1 ${
                  isActive('/admin') 
                    ? 'text-red-600 dark:text-primary font-semibold' 
                    : 'text-gray-700 dark:text-foreground hover:text-red-600 dark:hover:text-primary'
                }`}
              >
                <Shield size={18} />
                Admin
              </Link>
            )}
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-secondary transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* --- NEW: My Orders Icon --- */}
            {isAuthenticated && (
              <Link
                to="/orders"
                className={`p-2 rounded-lg transition-colors ${
                  isActive('/orders') 
                    ? 'text-red-600 dark:text-primary' 
                    : 'text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-secondary'
                }`}
                title="My Orders"
              >
                <Package size={20} />
              </Link>
            )}

            {/* Shopping Cart */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-secondary transition-colors"
            >
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative hidden md:block">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg text-gray-700 dark:text-foreground hover:bg-gray-100 dark:hover:bg-secondary transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">{user?.name}</span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-card shadow-lg rounded-lg border border-gray-200 dark:border-border">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-border">
                      <p className="text-sm font-medium text-gray-900 dark:text-foreground">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-muted-foreground">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-secondary flex items-center gap-2 rounded-b-lg"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="text-gray-700 dark:text-foreground hover:text-red-600 transition-colors px-3 py-2">
                  Login
                </Link>
                <Link to="/register" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className="md:hidden text-gray-700 dark:text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col space-y-4 border-t border-gray-200 dark:border-border pt-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className={isActive('/') ? 'text-red-600 font-semibold' : 'text-gray-700'}>Home</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)} className={isActive('/products') ? 'text-red-600 font-semibold' : 'text-gray-700'}>Products</Link>
            
            {/* --- NEW: Mobile My Orders --- */}
            {isAuthenticated && (
              <Link to="/orders" onClick={() => setIsMenuOpen(false)} className={isActive('/orders') ? 'text-red-600 font-semibold' : 'text-gray-700'}>
                My Orders
              </Link>
            )}

            <Link to="/about" onClick={() => setIsMenuOpen(false)} className={isActive('/about') ? 'text-red-600 font-semibold' : 'text-gray-700'}>About</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className={isActive('/contact') ? 'text-red-600 font-semibold' : 'text-gray-700'}>Contact</Link>
            
            {/* ... (Keep logout/login/admin links same as before) ... */}
          </nav>
        )}
      </div>
    </header>
  );
}