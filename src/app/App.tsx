import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/app/contexts/AuthContext';
import { CartProvider } from '@/app/contexts/CartContext';
import { ThemeProvider } from '@/app/contexts/ThemeContext';
import { OrderProvider } from '@/app/contexts/OrderContext';
import { ProductProvider } from '@/app/contexts/ProductContext';
import { Header } from '@/app/components/Header';
import { Footer } from '@/app/components/Footer';
import { HomePage } from '@/app/pages/HomePage';
import { ProductsPage } from '@/app/pages/ProductsPage';
import { SchoolSuppliesPage } from '@/app/pages/SchoolSuppliesPage';
import { OfficeSuppliesPage } from '@/app/pages/OfficeSuppliesPage';
import { HygieneSuppliesPage } from '@/app/pages/HygieneSuppliesPage';
import { AboutPage } from '@/app/pages/AboutPage';
import { ContactPage } from '@/app/pages/ContactPage';
import { LoginPage } from '@/app/pages/LoginPage';
import { RegisterPage } from '@/app/pages/RegisterPage';
import { CartPage } from '@/app/pages/CartPage';
import { CheckoutPage } from '@/app/pages/CheckoutPage';
import { AdminDashboardPage } from '@/app/pages/AdminDashboardPage';
import { SpecificOrderPage } from '@/app/pages/SpecificOrderPage';
import { OrdersPage } from '@/app/pages/OrdersPage';
import { useEffect } from 'react'; // Import useEffect

export default function App() {

  // --- THE FIX: SAFETY RESET ---
  // This clears the old, broken data that is causing the white screen.
  // You can remove this useEffect block after you successfully load the page once.
  useEffect(() => {
    console.log("Cleaning up old session data...");
    localStorage.removeItem('jbm_user');
    localStorage.removeItem('jbm_current_user'); 
  }, []);
  // -----------------------------

  return (
    <ThemeProvider>
      {/* AuthProvider MUST be the top-level provider for user data */}
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <OrderProvider>
              <Router>
                <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors">
                  <Header />
                  <main className="flex-1 pt-16">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/products" element={<ProductsPage />} />
                      <Route path="/specific-order" element={<SpecificOrderPage />} />
                      <Route path="/school-supplies" element={<SchoolSuppliesPage />} />
                      <Route path="/office-supplies" element={<OfficeSuppliesPage />} />
                      <Route path="/hygiene-supplies" element={<HygieneSuppliesPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/orders" element={<OrdersPage />} />
                      <Route path="/admin" element={<AdminDashboardPage />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </Router>
            </OrderProvider>
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}