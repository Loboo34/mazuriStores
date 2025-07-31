import React, { useState } from 'react';
import { Settings, Package, Plus, Edit2, Trash2 } from 'lucide-react';
import { Button } from '../components/common/Button';

export const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'ingredients'>('products');

  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'ingredients', label: 'Ingredients', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-800 mb-2">Admin Dashboard</h1>
          <p className="text-amber-600">Manage products and ingredients</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-amber-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'products' && <ProductManagement />}
        {activeTab === 'ingredients' && <IngredientManagement />}
      </div>
    </div>
  );
};

const ProductManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
        <Button>
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Price</th>
                <th className="px-6 py-3">Stock</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data - replace with actual data */}
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">Croissant</td>
                <td className="px-6 py-4">Pastries</td>
                <td className="px-6 py-4">$3.50</td>
                <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    In Stock
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const IngredientManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Ingredient Management</h2>
        <Button>
          <Plus className="h-4 w-4" />
          Add Ingredient
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Unit</th>
                <th className="px-6 py-3">Store Stock</th>
                <th className="px-6 py-3">Kitchen Stock</th>
                <th className="px-6 py-3">Min Threshold</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Sample data - replace with actual data */}
              <tr className="bg-white border-b">
                <td className="px-6 py-4 font-medium text-gray-900">Flour</td>
                <td className="px-6 py-4">kg</td>
                <td className="px-6 py-4">50</td>
                <td className="px-6 py-4">25</td>
                <td className="px-6 py-4">10</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};