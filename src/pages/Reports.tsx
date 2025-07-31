import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date().toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const [filters, setFilters] = useState({
    buyerType: 'all',
    category: 'all'
  });

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-800 mb-2">Sales Reports</h1>
          <p className="text-amber-600">Analyze sales performance and trends</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buyer Type
              </label>
              <select
                value={filters.buyerType}
                onChange={(e) => setFilters(prev => ({ ...prev, buyerType: e.target.value }))}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Buyers</option>
                <option value="customer">Customers</option>
                <option value="vendor">Vendors</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3 py-2 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">All Categories</option>
                <option value="bread">Bread</option>
                <option value="pastries">Pastries</option>
                <option value="beverages">Beverages</option>
                <option value="cakes">Cakes</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="primary">
              Apply Filters
            </Button>
            <Button variant="outline">
              Reset
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-2xl font-bold text-amber-600">$2,485</div>
            <div className="text-gray-600">Total Revenue</div>
            <div className="text-sm text-green-600 mt-1">+12% from yesterday</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-2xl font-bold text-amber-600">147</div>
            <div className="text-gray-600">Orders</div>
            <div className="text-sm text-green-600 mt-1">+8% from yesterday</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-2xl font-bold text-amber-600">$16.90</div>
            <div className="text-gray-600">Avg Order Value</div>
            <div className="text-sm text-red-600 mt-1">-3% from yesterday</div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-2xl font-bold text-amber-600">89</div>
            <div className="text-gray-600">Items Sold</div>
            <div className="text-sm text-green-600 mt-1">+15% from yesterday</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Items */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Top Selling Items</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Croissant', sales: 45, revenue: '$157.50' },
                { name: 'Coffee', sales: 38, revenue: '$114.00' },
                { name: 'Chocolate Cake', sales: 22, revenue: '$176.00' },
                { name: 'Bread Loaf', sales: 31, revenue: '$93.00' },
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-600">{item.sales} sold</div>
                  </div>
                  <div className="font-bold text-amber-600">{item.revenue}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">Recent Orders</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-3">
              {[
                { id: '#1234', total: '$24.50', buyer: 'Customer', time: '2:45 PM' },
                { id: '#1235', total: '$67.80', buyer: 'Vendor', time: '2:38 PM' },
                { id: '#1236', total: '$12.30', buyer: 'Customer', time: '2:30 PM' },
                { id: '#1237', total: '$89.90', buyer: 'Vendor', time: '2:15 PM' },
              ].map((order, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{order.id}</div>
                    <div className="text-sm text-gray-600">{order.buyer} • {order.time}</div>
                  </div>
                  <div className="font-bold text-amber-600">{order.total}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};