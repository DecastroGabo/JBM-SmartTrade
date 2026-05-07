import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem } from './CartContext';

export interface Order {
  id: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  notes?: string;
  items: CartItem[];
  subtotal?: number;
  total: number;
  paymentMethod: 'cod' | 'gcash' | 'bank' | 'Pending Quote';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'Pending Quote';
  orderDate: string;
  message?: string;
  isSpecialOrder?: boolean;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Partial<Order>) => void;
  getOrdersByCustomer: (email: string) => Order[];
  getAllOrders: () => Order[];
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('jbm_orders');
    return savedOrders ? JSON.parse(savedOrders) : [];
  });

  useEffect(() => {
    localStorage.setItem('jbm_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: orderData.id || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items: orderData.items || [],
      total: orderData.total || 0,
      orderDate: orderData.orderDate || new Date().toISOString(),
      status: orderData.status || 'pending',
      paymentMethod: orderData.paymentMethod || 'cod',
      ...orderData,
    } as Order;
    setOrders(prev => [newOrder, ...prev]);
  };

  const getOrdersByCustomer = (email: string) => {
    return orders.filter(order => order.customerEmail === email);
  };

  const getAllOrders = () => {
    return orders;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        getOrdersByCustomer,
        getAllOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
}

// Keep backwards compatibility
export const useOrders = useOrder;