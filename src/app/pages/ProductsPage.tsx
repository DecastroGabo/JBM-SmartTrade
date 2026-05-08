import { useState, useEffect } from 'react';
import { Package, Heart, Briefcase, Dumbbell, Armchair, GraduationCap, FileText } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { getAllCategories, categoryLabels, ProductCategory } from '../data/products';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface DBProduct {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  available: string | number;
  status?: string; 
}

const categoryIcons: Record<ProductCategory, any> = {
  school: GraduationCap,
  office: Briefcase,
  medical: Heart,
  sports: Dumbbell,
  furniture: Armchair,
};

const mapDBCategoryToFrontend = (dbCategory: string): ProductCategory => {
  const lower = dbCategory.toLowerCase();
  if (lower.includes('school')) return 'school';
  if (lower.includes('office')) return 'office';
  if (lower.includes('medicine') || lower.includes('medical')) return 'medical';
  if (lower.includes('sports')) return 'sports';
  if (lower.includes('furniture')) return 'furniture';
  return 'school'; 
};

// FIX 1: Moved this outside so it doesn't force React to re-render constantly
const ALL_CATEGORIES = getAllCategories();

export function ProductsPage() {
  // FIX 2: Pulled in setSearchParams so we can update the web address
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const [allProducts, setAllProducts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  const categoryFromUrl = searchParams.get('category') as ProductCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');

 const loadProducts = () => {
  fetch('/api/get-product.php')
    .then(res => res.json())
      .then((data: DBProduct[]) => {
        const formattedProducts = data.map(item => {
            const isAvailable = item.available == 1;
            return {
                ...item,
                id: item.id, 
                price: parseFloat(item.price), 
                category: mapDBCategoryToFrontend(item.category),
                available: isAvailable,
                inStock: isAvailable,
                status: item.status || (isAvailable ? 'available' : 'unavailable')
            };
        });
        setAllProducts(formattedProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // FIX 3: This now safely checks the URL without fighting your clicks
  useEffect(() => {
    if (categoryFromUrl && ALL_CATEGORIES.includes(categoryFromUrl)) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory('all');
    }
  }, [categoryFromUrl]);

  const categoryFilteredProducts = selectedCategory === 'all' 
    ? allProducts
    : allProducts.filter(p => p.category === selectedCategory);

  const displayProducts = isAdmin 
    ? categoryFilteredProducts 
    : categoryFilteredProducts.filter(p => p.inStock === true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600 animate-pulse">
          Loading catalog...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <Package className="w-8 h-8 text-red-600 dark:text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-foreground">
                All Products
              </h1>
              <p className="text-lg text-gray-600 dark:text-muted-foreground mt-1">
                Browse our complete catalog across all categories
              </p>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-gray-200 dark:border-border p-2">
            <div className="flex flex-wrap gap-2">
              {/* All Products Tab */}
              <button
                // FIX 4: Clicking "All Products" now clears the URL
                onClick={() => setSearchParams({})} 
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-red-600 dark:bg-primary text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-secondary text-gray-700 dark:text-foreground hover:bg-gray-200 dark:hover:bg-muted'
                }`}
              >
                <Package size={18} />
                <span>All Products</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === 'all' ? 'bg-white/20' : 'bg-gray-200 dark:bg-muted'
                }`}>
                  {isAdmin ? allProducts.length : allProducts.filter(p => p.inStock).length}
                </span>
              </button>

              {/* Specific Category Tabs */}
              {ALL_CATEGORIES.map((category) => {
                const Icon = categoryIcons[category];
                const categoryProducts = allProducts.filter(p => p.category === category);
                const activeCategoryCount = isAdmin ? categoryProducts.length : categoryProducts.filter(p => p.inStock).length;
                
                return (
                  <button
                    key={category}
                    // FIX 5: Clicking a tab changes the URL (e.g., ?category=school)
                    onClick={() => setSearchParams({ category: category })} 
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-red-600 dark:bg-primary text-white shadow-sm'
                        : 'bg-gray-100 dark:bg-secondary text-gray-700 dark:text-foreground hover:bg-gray-200 dark:hover:bg-muted'
                    }`}
                  >
                    <Icon size={18} />
                    <span className="hidden sm:inline">{categoryLabels[category]}</span>
                    <span className="sm:hidden">{categoryLabels[category].split(' ')[0]}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category ? 'bg-white/20' : 'bg-gray-200 dark:bg-muted'
                    }`}>
                      {activeCategoryCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Specific Order Button */}
          <div className="mt-4">
            <button
              onClick={() => navigate('/specific-order')}
              className="w-full bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 text-white px-6 py-4 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-3 font-semibold"
            >
              <FileText size={22} />
              <div className="text-left">
                <div className="text-lg">Custom / Specific Order</div>
                <div className="text-sm font-normal opacity-90">Request items not listed in our catalog</div>
              </div>
            </button>
          </div>
        </div>

        {/* Category Info Banner */}
        {selectedCategory !== 'all' && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-6 mb-8 border border-red-100 dark:border-red-900/30">
            <div className="flex items-start gap-4">
              {(() => {
                const Icon = categoryIcons[selectedCategory];
                return (
                  <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                    <Icon className="w-6 h-6 text-red-600 dark:text-primary" />
                  </div>
                );
              })()}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">
                  {categoryLabels[selectedCategory]}
                </h2>
                <p className="text-gray-700 dark:text-muted-foreground">
                  {getCategoryDescription(selectedCategory)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-gray-600 dark:text-muted-foreground">
            Showing <span className="font-semibold text-gray-900 dark:text-foreground">{displayProducts.length}</span> products
            {selectedCategory !== 'all' && (
              <span> in <span className="font-semibold text-red-600 dark:text-primary">{categoryLabels[selectedCategory]}</span></span>
            )}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onProductUpdate={loadProducts} 
            />
          ))}
        </div>

        {/* Empty State */}
        {displayProducts.length === 0 && (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-400 dark:text-muted-foreground mx-auto mb-4" />
            <p className="text-gray-600 dark:text-muted-foreground text-lg">
              No products available in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getCategoryDescription(category: ProductCategory): string {
  const descriptions: Record<ProductCategory, string> = {
    school: 'Educational supplies and resources for learning and development. Textbooks, notebooks, pens, calculators, and educational software.',
    office: 'Professional office supplies and equipment for productive workspaces. Copy paper, pens, organizers, printers, and desk accessories.',
    medical: 'Medicine and medical supplies for healthcare and safety. Paracetamol, vitamins, first aid kits, thermometers, and protective equipment.',
    sports: 'Sports supplies and equipment for staying active and healthy. Basketballs, yoga mats, dumbbells, resistance bands, and training gear.',
    furniture: 'Durable furniture and fixtures for homes and offices. Chairs, desks, bookshelves, filing cabinets, and storage solutions.',
  };
  return descriptions[category];
}