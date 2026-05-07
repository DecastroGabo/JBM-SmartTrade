import { useState } from 'react';
import { ShoppingCart, Plus, Minus, Edit2, Trash2, ToggleLeft, ToggleRight, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: any; 
  onProductUpdate?: () => void; 
}

export function ProductCard({ product, onProductUpdate }: ProductCardProps) {
  const { isAuthenticated, isAdmin } = useAuth();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrice, setEditedPrice] = useState(product.price.toString());

  const subtotal = product.price * quantity;

  // --- API CONNECTION FOR ADMIN CONTROLS ---
  const handleAdminAction = async (action: string, extraData: any = {}) => {
    try {
      const response = await fetch('api/admin-product-actions.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          action: action,
          product_id: product.id,
          ...extraData
        })
      });

      const result = await response.json();
      if (result.success) {
        setIsEditing(false);
        if (onProductUpdate) onProductUpdate(); 
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Action failed:", error);
      alert("Network error occurred while updating the database.");
    }
  };

  const handleSaveEdit = () => {
    const newPrice = parseFloat(editedPrice);
    if (!isNaN(newPrice) && newPrice > 0) {
      handleAdminAction('update_price', { price: newPrice });
    }
  };

  const handleToggleStock = () => {
    const newStatus = product.inStock ? 'unavailable' : 'available';
    handleAdminAction('toggle_availability', { status: newStatus });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete "${product.name}"?`)) {
      handleAdminAction('delete');
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      setTimeout(() => setShowAuthPrompt(false), 3000);
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    }, quantity);

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
    setQuantity(1);
  };

  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-sm hover:shadow-md transition-all border border-gray-200 dark:border-border overflow-hidden group relative">
      {/* Success Badge */}
      {showSuccess && (
        <div className="absolute top-4 right-4 z-10 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-fade-in">
          Added!
        </div>
      )}

      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-100 dark:bg-secondary">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-foreground mb-1 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-muted-foreground mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Fixed Price per unit */}
        <div className="mb-3">
          <span className="text-sm text-gray-600 dark:text-muted-foreground">Price per unit:</span>
          <p className="text-xl font-bold text-red-600 dark:text-primary">
            ₱{product.price.toFixed(2)}
          </p>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-700 dark:text-foreground font-medium">Quantity:</span>
          <div className="flex items-center bg-gray-100 dark:bg-secondary rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-gray-200 dark:hover:bg-muted rounded-l-lg transition-colors"
              disabled={!product.inStock}
            >
              <Minus size={16} className="text-gray-700 dark:text-foreground" />
            </button>
            <span className="w-12 text-center font-semibold text-gray-900 dark:text-foreground">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-muted rounded-r-lg transition-colors"
              disabled={!product.inStock}
            >
              <Plus size={16} className="text-gray-700 dark:text-foreground" />
            </button>
          </div>
        </div>

        {/* Subtotal */}
        <div className="bg-gray-50 dark:bg-secondary rounded-lg p-3 mb-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-muted-foreground">Subtotal:</span>
            <span className="text-lg font-bold text-gray-900 dark:text-foreground">
              ₱{subtotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-red-600 dark:bg-primary text-white py-2.5 rounded-lg hover:bg-red-700 dark:hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={18} />
          Add to Cart
        </button>

        {/* Auth Prompt */}
        {showAuthPrompt && (
          <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 text-center">
            <p className="text-xs text-yellow-800 dark:text-yellow-200">
              Please sign in to place an order
            </p>
          </div>
        )}

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mt-4 border-t border-gray-200 dark:border-border pt-4 space-y-2">
            <div className="bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded text-xs text-red-600 dark:text-red-400 font-semibold text-center mb-2">
              ADMIN CONTROLS
            </div>
            
            {!isEditing ? (
              <>
                <button
                  onClick={handleToggleStock}
                  className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm ${
                    product.inStock
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                  }`}
                >
                  {product.inStock ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                  {product.inStock ? 'Mark Unavailable' : 'Mark Available'}
                </button>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <Edit2 size={16} />
                  Edit Price
                </button>

                <button
                  onClick={handleDelete}
                  className="w-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 py-2 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                >
                  <Trash2 size={16} />
                  Delete Product
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <div>
                  <label className="text-xs font-medium text-gray-700 dark:text-muted-foreground block mb-1">
                    Fixed Price (₱)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-border rounded-lg dark:bg-secondary dark:text-foreground text-sm"
                    placeholder="e.g., 250.00"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                  >
                    <Save size={16} />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 dark:bg-secondary text-gray-700 dark:text-foreground py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-muted transition-colors flex items-center justify-center gap-2 font-medium text-sm"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}