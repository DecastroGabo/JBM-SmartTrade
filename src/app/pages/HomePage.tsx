import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Package, Award, Truck, ShieldCheck } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

// 1. Define what a Product looks like (matching your DB)
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export function HomePage() {
  // 2. State to hold data from XAMPP
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  // 3. Fetch data when the page loads
  useEffect(() => {
    fetch('http://localhost/JBMTRADING/api/get-product.php')
      .then(res => res.json())
      .then(data => {
        // Transform the raw DB data (prices are strings) into the format React expects
        const formattedProducts = data.map((item: any) => ({
          ...item,
          id: item.id,
          price: parseFloat(item.price), // Convert "15.00" to 15.00
        }));
        setFeaturedProducts(formattedProducts.slice(0, 6));
      })
      .catch(err => console.error("Error fetching homepage products:", err));
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-card dark:to-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-foreground mb-6">
                Your Trusted Partner for{' '}
                <span className="text-red-600 dark:text-primary">Quality Supplies</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-muted-foreground mb-8 leading-relaxed">
                JBM Trading Company delivers premium school supplies, medical equipment, and office essentials 
                to businesses and institutions nationwide. Experience reliable service, competitive pricing, 
                and quality products that meet your exact needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-red-600 dark:bg-primary text-white px-8 py-4 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-semibold text-lg"
                >
                  Get in Touch
                  <ArrowRight size={20} />
                </Link>
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 bg-white dark:bg-card text-gray-900 dark:text-foreground px-8 py-4 rounded-lg hover:bg-gray-50 dark:hover:bg-secondary transition-colors font-semibold text-lg border border-gray-300 dark:border-border"
                >
                  View Products
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&h=600&fit=crop"
                  alt="Warehouse with organized supplies"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="py-16 bg-white dark:bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
              Our Product Categories
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              Browse our extensive selection of quality supplies across three main categories
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* School Supplies */}
            <Link
              to="/products?category=school"
              className="group bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-lg transition-all p-8 border border-gray-200 dark:border-border"
            >
              <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-red-600 dark:text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">
                School Supplies
              </h3>
              <p className="text-gray-600 dark:text-muted-foreground mb-4">
                Notebooks, pens, backpacks, and everything students need for success
              </p>
              <span className="inline-flex items-center gap-2 text-red-600 dark:text-primary font-semibold group-hover:gap-3 transition-all">
                Browse Products
                <ArrowRight size={18} />
              </span>
            </Link>

            {/* Medical Supplies */}
            <Link
              to="/products?category=medical"
              className="group bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-lg transition-all p-8 border border-gray-200 dark:border-border"
            >
              <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-8 h-8 text-red-600 dark:text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">
                Medical Supplies
              </h3>
              <p className="text-gray-600 dark:text-muted-foreground mb-4">
                Masks, sanitizers, first aid kits, and healthcare essentials
              </p>
              <span className="inline-flex items-center gap-2 text-red-600 dark:text-primary font-semibold group-hover:gap-3 transition-all">
                Browse Products
                <ArrowRight size={18} />
              </span>
            </Link>

            {/* Office Supplies */}
            <Link
              to="/products?category=office"
              className="group bg-white dark:bg-card rounded-xl shadow-sm hover:shadow-lg transition-all p-8 border border-gray-200 dark:border-border"
            >
              <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-red-600 dark:text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">
                Office Supplies
              </h3>
              <p className="text-gray-600 dark:text-muted-foreground mb-4">
                Paper, organizers, desk accessories for productive workspaces
              </p>
              <span className="inline-flex items-center gap-2 text-red-600 dark:text-primary font-semibold group-hover:gap-3 transition-all">
                Browse Products
                <ArrowRight size={18} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50 dark:bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-foreground mb-4">
              Why Choose Us
            </h2>
            <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-2xl mx-auto">
              We're committed to delivering excellence in every order
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Bulk Ordering */}
            <div className="bg-white dark:bg-background rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-border">
              <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-red-600 dark:text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-2">
                Bulk Ordering
              </h3>
              <p className="text-gray-600 dark:text-muted-foreground">
                Special pricing and flexible terms for large orders. Perfect for institutions and businesses.
              </p>
            </div>

            {/* Quality Assured */}
            <div className="bg-white dark:bg-background rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-border">
              <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-red-600 dark:text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-2">
                Quality Assured
              </h3>
              <p className="text-gray-600 dark:text-muted-foreground">
                All products are sourced from trusted manufacturers and undergo strict quality checks.
              </p>
            </div>

            {/* Fast Delivery */}
            <div className="bg-white dark:bg-background rounded-xl shadow-sm p-8 text-center border border-gray-200 dark:border-border">
              <div className="bg-red-100 dark:bg-red-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-red-600 dark:text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-foreground mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600 dark:text-muted-foreground">
                Reliable logistics network ensures your orders arrive on time, every time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}