import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

export function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const { isAuthenticated } = useAuth();

  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 dark:text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-muted-foreground mb-8">
              Add some products to your cart to get started
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-red-600 dark:bg-primary text-white px-6 py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 dark:text-muted-foreground hover:text-red-600 dark:hover:text-primary transition-colors"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground mb-8">
          Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-card rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-border">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-6 border-b border-gray-200 dark:border-border last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-foreground mb-1">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-muted-foreground mb-2">
                      {item.category}
                    </p>
                    <p className="text-lg font-bold text-red-600 dark:text-primary">
                      ₱{item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 dark:text-muted-foreground hover:text-red-600 dark:hover:text-primary transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-secondary rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-muted rounded-l-lg transition-colors text-gray-900 dark:text-foreground"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-semibold text-gray-900 dark:text-foreground">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-muted rounded-r-lg transition-colors text-gray-900 dark:text-foreground"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 sticky top-24 border border-gray-200 dark:border-border">
              <h2 className="text-xl font-bold text-gray-900 dark:text-foreground mb-4">
                Order Summary
              </h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600 dark:text-muted-foreground">
                  <span>Subtotal ({items.length} items)</span>
                  <span>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600 dark:text-green-500">FREE</span>
                </div>
                <div className="border-t border-gray-200 dark:border-border pt-3 flex justify-between font-bold text-lg text-gray-900 dark:text-foreground">
                  <span>Total</span>
                  <span className="text-red-600 dark:text-primary">₱{total.toFixed(2)}</span>
                </div>
              </div>
              
              {isAuthenticated ? (
                <Link
                  to="/checkout"
                  className="block w-full bg-red-600 dark:bg-primary text-white text-center py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-semibold"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 text-center">
                      Please sign in to place an order
                    </p>
                  </div>
                  <Link
                    to="/login"
                    className="block w-full bg-red-600 dark:bg-primary text-white text-center py-3 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors font-semibold"
                  >
                    Sign In to Checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}