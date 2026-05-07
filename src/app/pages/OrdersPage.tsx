import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, Truck, FileText, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserOrders = async () => {
    try {
      const response = await fetch('/api/get-user-orders.php', {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        // Sort by date so newest orders appear at the top
        const sorted = data.orders.sort((a: any, b: any) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setOrders(sorted);
      }
    } catch (err) {
      console.error("Order fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchUserOrders();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <button onClick={() => navigate('/login')} className="bg-red-600 text-white px-6 py-2 rounded-lg">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold">My Orders</h1>
        </div>

        {loading ? (
          <div className="text-center py-20 animate-pulse">Fetching your orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 border rounded-lg bg-gray-50 dark:bg-card">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-4">No orders yet</h2>
            <button onClick={() => navigate('/products')} className="bg-red-600 text-white px-6 py-2 rounded-lg">Browse Products</button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.isSpecialOrder ? `spec-${order.id}` : `reg-${order.id}`} className="bg-white dark:bg-card rounded-lg shadow-sm border overflow-hidden">
                {/* Header Section */}
                <div className="bg-gray-50 dark:bg-secondary px-6 py-4 border-b flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <p className="font-mono font-bold">#{order.id}</p>
                    {order.isSpecialOrder && <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded text-xs font-bold">SPECIAL</span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold uppercase">{order.status}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {order.isSpecialOrder ? (
                    <p className="italic text-gray-600">"{order.message}"</p>
                  ) : (
                    <div className="space-y-4">
                      {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-4 border-b last:border-0 pb-2">
                          <img src={item.image} className="w-12 h-12 object-cover rounded" alt="" />
                          <div className="flex-1">
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-bold">₱{parseFloat(item.price).toFixed(2)}</p>
                        </div>
                      ))}
                      <div className="text-right pt-2">
                        <p className="text-lg font-black text-red-600">Total: ₱{parseFloat(order.total).toFixed(2)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}