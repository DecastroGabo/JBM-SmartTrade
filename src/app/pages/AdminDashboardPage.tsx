import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Users, DollarSign, Package, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  
  const [data, setData] = useState<any>({
    stats: {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      pendingSpecial: 0
    },
    recentOrders: [],
    specialRequests: []
  });
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'regular' | 'special'>('regular');

  // 1. Fetch Real-Time Data from PHP API
  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/get-admin-dashboard.php', {
        credentials: 'include'
      });
      const result = await response.json();
      
      if (result.success) {
        setData(result);
      }
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Status Changes via Dropdown
  const handleStatusChange = async (id: number, newStatus: string, type: 'regular' | 'special') => {
    try {
      const response = await fetch('/api/update-order-status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status: newStatus, type })
      });

      const result = await response.json();
      if (result.success) {
        fetchDashboardData(); // Refresh UI instantly
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Status update error:", error);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [isAdmin, navigate]);

  if (!isAdmin || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-background">
        <div className="text-xl font-semibold animate-pulse flex items-center gap-3">
          <Clock className="animate-spin" /> Syncing with Database...
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'shipped': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-lg text-gray-600 dark:text-muted-foreground">Manage orders, revenue, and special requests</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-white dark:bg-card border rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Orders" value={data.stats.totalOrders} icon={<ShoppingBag className="text-red-600" />} />
          <StatCard label="Total Revenue" value={`₱${data.stats.totalRevenue.toLocaleString()}`} icon={<DollarSign className="text-green-600" />} />
          <StatCard label="Pending Items" value={data.stats.pendingOrders} icon={<Clock className="text-yellow-600" />} />
          <StatCard label="Special Requests" value={data.stats.pendingSpecial} icon={<FileText className="text-orange-600" />} />
        </div>

        {/* Tabs for Switching Tables */}
        <div className="flex border-b border-gray-200 dark:border-border mb-6">
          <button 
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'regular' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('regular')}
          >
            Regular Orders ({data.recentOrders.length})
          </button>
          <button 
            className={`px-6 py-3 font-medium transition-colors ${activeTab === 'special' ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('special')}
          >
            Special Requests ({data.specialRequests.length})
          </button>
        </div>

        {/* Dynamic Table Content */}
        <div className="bg-white dark:bg-card rounded-lg shadow-sm border border-gray-200 dark:border-border overflow-hidden">
          {activeTab === 'regular' ? (
            <OrderTable 
              orders={data.recentOrders} 
              getStatusColor={getStatusColor} 
              onStatusChange={handleStatusChange} 
            />
          ) : (
            <SpecialRequestTable 
              requests={data.specialRequests} 
              getStatusColor={getStatusColor} 
              onStatusChange={handleStatusChange} 
            />
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, icon }: any) {
  return (
    <div className="bg-white dark:bg-card rounded-lg shadow-sm p-6 border border-gray-200 dark:border-border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-gray-600 dark:text-muted-foreground">{label}</p>
        <div className="p-2 bg-gray-50 dark:bg-secondary rounded-lg">{icon}</div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-foreground">{value}</p>
    </div>
  );
}

function OrderTable({ orders, getStatusColor, onStatusChange }: any) {
  if (orders.length === 0) return <EmptyState msg="No regular orders found" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-secondary">
          <tr className="text-left text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase tracking-wider">
            <th className="px-6 py-3">Order ID</th>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Total Amount</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-border">
          {orders.map((order: any) => (
            <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-secondary transition-colors text-sm">
              <td className="px-6 py-4 font-mono font-medium">#{order.id}</td>
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900 dark:text-foreground">{order.customer_name}</p>
                <p className="text-xs text-gray-500">{order.payment_method?.toUpperCase()}</p>
              </td>
              <td className="px-6 py-4 font-bold text-red-600">₱{parseFloat(order.total_amount).toFixed(2)}</td>
              <td className="px-6 py-4">
                <select 
                  value={order.status} 
                  onChange={(e) => onStatusChange(order.id, e.target.value, 'regular')}
                  className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer border-none focus:ring-0 ${getStatusColor(order.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
              <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SpecialRequestTable({ requests, getStatusColor, onStatusChange }: any) {
  if (requests.length === 0) return <EmptyState msg="No special requests found" />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-secondary">
          <tr className="text-left text-xs font-medium text-gray-500 dark:text-muted-foreground uppercase tracking-wider">
            <th className="px-6 py-3">ID</th>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3">Qty</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-border">
          {requests.map((req: any) => (
            <tr key={req.id} className="hover:bg-gray-50 dark:hover:bg-secondary transition-colors text-sm">
              <td className="px-6 py-4 font-mono">#{req.id}</td>
              <td className="px-6 py-4 font-medium">
                <p>{req.customer_name}</p>
                <p className="text-xs text-gray-500">{req.customer_email}</p>
              </td>
              <td className="px-6 py-4 max-w-xs truncate">{req.product_description}</td>
              <td className="px-6 py-4">{req.quantity}</td>
              <td className="px-6 py-4">
                <select 
                  value={req.status} 
                  onChange={(e) => onStatusChange(req.id, e.target.value, 'special')}
                  className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer border-none focus:ring-0 ${getStatusColor(req.status)}`}
                >
                  <option value="pending">Pending</option>
                  <option value="reviewing">Reviewing</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="p-12 text-center">
      <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
      <p className="text-gray-500">{msg}</p>
    </div>
  );
}