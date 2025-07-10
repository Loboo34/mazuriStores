import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle,
  Clock,
  XCircle,
  Phone,
  Mail,
  MapPin,
  Edit,
  Save,
  User
} from 'lucide-react';
//import { useAdmin } from '../../contexts/AdminContext';
import useOrderStore from "../../store/order.store"
import { Order } from '../../types';
import { format } from 'date-fns';

const OrderManagement: React.FC = () => {
  const { orders, fetchAllOrders, updateOrder} = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    address: ''
  });

  useEffect(() => {
    fetchAllOrders();

  }, [fetchAllOrders])

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    updateOrder(orderId, newStatus);
    // Update selected order if it's currently being viewed
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setCustomerForm({
      customerName: order.customerInfo.name,
      customerEmail: order.customerInfo.email,
      customerPhone: order.customerInfo.phone,
      address: order.customerInfo.address
    });
    setShowOrderDetails(true);
    setEditingCustomer(false);
  };

  const handleEditCustomer = () => {
    setEditingCustomer(true);
  };

  const handleSaveCustomerInfo = () => {
    if (selectedOrder) {
      updateOrderCustomerInfo(selectedOrder.id, customerForm);
      setSelectedOrder(prev => prev ? {
        ...prev,
        customerName: customerForm.customerName,
        customerEmail: customerForm.customerEmail,
        customerPhone: customerForm.customerPhone,
        address: customerForm.address,
        phone: customerForm.customerPhone
      } : null);
      setEditingCustomer(false);
    }
  };

  const handleCancelEdit = () => {
    if (selectedOrder) {
      setCustomerForm({
        customerName: selectedOrder.customerInfo.name,
        customerEmail: selectedOrder.customerInfo.email,
        customerPhone: selectedOrder.customerInfo.phone,
        address: selectedOrder.customerInfo.address
      });
    }
    setEditingCustomer(false);
  };

  const handleCustomerFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomerForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Package className="w-4 h-4" />;
      case 'shipped':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const OrderDetailsModal: React.FC = () => {
    if (!showOrderDetails || !selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Details - #{selectedOrder.id}
              </h2>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Order Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  <span className="capitalize">{selectedOrder.status}</span>
                </span>
                <span className="text-sm text-gray-500">
                  {format(new Date(selectedOrder.createdAt), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              
              <select
                value={selectedOrder.status}
                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as Order['status'])}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Customer Information</h3>
                  {!editingCustomer ? (
                    <button
                      onClick={handleEditCustomer}
                      className="p-2 text-african-terracotta hover:bg-african-cream rounded-full transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveCustomerInfo}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors duration-200"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    {editingCustomer ? (
                      <input
                        type="text"
                        name="customerName"
                        value={customerForm.customerName}
                        onChange={handleCustomerFormChange}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-african-gold"
                      />
                    ) : (
                      <span className="text-sm">{selectedOrder.customerInfo.name}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {editingCustomer ? (
                      <input
                        type="email"
                        name="customerEmail"
                        value={customerForm.customerEmail}
                        onChange={handleCustomerFormChange}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-african-gold"
                      />
                    ) : (
                      <span className="text-sm">{selectedOrder.customerInfo.email}</span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {editingCustomer ? (
                      <input
                        type="tel"
                        name="customerPhone"
                        value={customerForm.customerPhone}
                        onChange={handleCustomerFormChange}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-african-gold"
                      />
                    ) : (
                      <span className="text-sm">{selectedOrder.customerInfo.phone}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Delivery Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="text-sm capitalize">{selectedOrder.deliveryOption}</span>
                  </div>
                  {selectedOrder.deliveryOption === 'delivery' && (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      {editingCustomer ? (
                        <textarea
                          name="address"
                          value={customerForm.address}
                          onChange={handleCustomerFormChange}
                          rows={2}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-african-gold resize-none"
                        />
                      ) : (
                        <span className="text-sm">{selectedOrder.address}</span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Payment:</span>
                    <span className="text-sm capitalize">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">KSh {(item.product.price * item.quantity).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">KSh {item.product.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-african-cream rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Total Amount:</span>
                <span className="text-2xl font-bold text-african-terracotta">
                  KSh {selectedOrder.total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <div className="mt-4 sm:mt-0 text-sm text-gray-600">
          Total Orders: {orders.length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search orders by ID, customer name, or email..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-african-gold"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Order ID</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Customer</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Items</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Total</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <span className="font-mono text-sm">#{order.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-gray-900">{order.customerInfo.name}</p>
                      {/* <p className="text-sm text-gray-500">{order.customerEmail}</p> */}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold">KSh {order.total.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                      className={`px-2 py-1 rounded-full text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-african-gold ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm text-gray-600">
                      {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="p-2 text-gray-400 hover:text-african-terracotta rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal />
    </div>
  );
};

export default OrderManagement;