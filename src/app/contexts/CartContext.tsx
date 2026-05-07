import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext'; 

export interface CartItem {
  id: number; // Matches the integer ID in your DB
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: any, quantity?: number) => Promise<void>;
  removeFromCart: (id: number) => Promise<void>;
  updateQuantity: (id: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth(); 

  // 1. Fetch Cart
  const fetchCart = async () => {
    if (!user) {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(`/api/get-cart.php`, {
        credentials: 'include' 
      });
      const data = await response.json();
      
      if (Array.isArray(data)) {
        // Map data to ensure types are correct (Price as float, Qty/ID as int)
        const validatedItems = data.map((item: any) => ({
          ...item,
          id: Number(item.id),
          price: Number(item.price),
          quantity: Number(item.quantity)
        }));
        setItems(validatedItems);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  // 2. Add to Cart
  const addToCart = async (item: any, quantity: number = 1) => {
    if (!user) {
      alert("Please login to add items to your cart.");
      return;
    }
    try {
      const response = await fetch('/api/add-to-cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ product_id: Number(item.id), quantity }),
      });
      
      const result = await response.json();
      if (result.success) {
        await fetchCart(); 
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  // 3. Remove from Cart (Fixed Filename to match remove-from-cart.php)
  const removeFromCart = async (id: number) => {
    if (!user) return;
    try {
      const response = await fetch('/api/remove-from-cart.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ product_id: id }),
      });
      const result = await response.json();
      if (result.success) {
        await fetchCart();
      }
    } catch (error) {
      console.error("Remove from cart error:", error);
    }
  };

  // 4. Update Quantity
  const updateQuantity = async (id: number, quantity: number) => {
  if (!user) return;
  if (quantity <= 0) {
    await removeFromCart(id);
    return;
  }
  
  try {
    const response = await fetch('/api/update-cart-quantity.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Ensures the session cookie is sent
      body: JSON.stringify({ product_id: Number(id), quantity: Number(quantity) }),
    });
    
    const result = await response.json();
    if (result.success) {
      await fetchCart(); // Re-sync the state with the database
    } else {
      console.error("Server update failed:", result.message);
    }
  } catch (error) {
    console.error("Update quantity error:", error);
  }
};

  // 5. Clear Cart (Calls place-order or a separate clear script)
  const clearCart = async () => {
    setItems([]);
  };

  // Calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addToCart, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        totalItems, 
        subtotal, 
        isLoading 
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}