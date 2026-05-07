import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Smartphone, CheckCircle } from 'lucide-react';

import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useOrders } from '../contexts/OrderContext';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { addOrder } = useOrders();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'gcash' | 'bank'>('cod');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: '',
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  // Redirect if cart is empty
  if (items.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const shipping = 0;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATED: Async handleSubmit to connect to XAMPP
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalTotal = subtotal + shipping;

    // FIX: Only send the user_id if it's a real number from the DB
    const userId = user?.id;
    const validUserId = (userId && !isNaN(Number(userId))) ? Number(userId) : null;

    const orderData = {
      user_id: validUserId, 
      customer_name: formData.fullName,
      customer_email: formData.email,
      customer_phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postal_code: formData.postalCode,
      notes: formData.notes,
      items: items.map((item: any) => ({ // Fix: Added ': any' to stop red squiggle
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      subtotal: subtotal,
      total: finalTotal,
      payment_method: paymentMethod,
    };

    try {
      const response = await fetch('/api/place-order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        setOrderTotal(finalTotal);
        
        // Fix: Mapping properties to match your Context's expected names
        addOrder({
          id: result.order_id,
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          notes: formData.notes,
          items: items,
          subtotal: subtotal,
          total: finalTotal,
          paymentMethod: paymentMethod,
          status: 'pending'
        });

        setOrderPlaced(true);
        clearCart();
      } else {
        alert("Order failed: " + result.message);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert("Connection Error: Is XAMPP running?");
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Order Total</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-500">₱{orderTotal.toFixed(2)}</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          Checkout
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Shipping Information
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Order Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-transparent"
                      placeholder="Any special instructions for your order..."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Payment Method
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-red-600 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <Banknote className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Cash on Delivery</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pay when you receive</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-red-600 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gcash"
                      checked={paymentMethod === 'gcash'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">GCash</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Pay via GCash mobile wallet</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:border-red-600 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="text-red-600 focus:ring-red-600"
                    />
                    <CreditCard className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">Bank Transfer</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Direct bank transfer</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {items.map((item: any) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-red-600 dark:text-red-500">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-gray-200 dark:border-gray-700 pt-4 mb-6">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Subtotal</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Shipping</span>
                    <span className="text-green-600 dark:text-green-500">FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg text-gray-900 dark:text-gray-100 pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span>Total</span>
                    <span className="text-red-600 dark:text-red-500">₱{total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  Place Order
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}