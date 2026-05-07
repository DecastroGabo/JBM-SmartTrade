import { Heart } from 'lucide-react';
import { ProductCard } from '@/app/components/ProductCard';
import { useProducts } from '@/app/contexts/ProductContext';

export function HygieneSuppliesPage() {
  const { products: allProducts } = useProducts();
  const products = allProducts.filter(p => p.category === 'medical');

  return (
    <div className="min-h-screen bg-white dark:bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
              <Heart className="w-8 h-8 text-red-600 dark:text-primary" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-foreground">
              Medical Supplies
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-muted-foreground max-w-3xl">
            Essential medical and hygiene supplies for healthcare and safety. From protective equipment 
            and sanitizers to first aid kits and medical devices, we prioritize your health and safety.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-muted-foreground text-lg">
              No products available at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}