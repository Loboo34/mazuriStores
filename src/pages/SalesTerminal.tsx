import React from 'react';
import { ProductGrid } from '../components/sales/ProductGrid';
import { Cart } from '../components/sales/Cart';
import { Checkout } from '../components/sales/Checkout';
import { useCartStore } from '../stores/cartStore';

export const SalesTerminal: React.FC = () => {
  const { items } = useCartStore();
  const hasItems = items.length > 0;

  return (
    <div className="min-h-screen bg-amber-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-amber-800 mb-2">Sales Terminal</h1>
          <p className="text-amber-600">Select products to add to cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="lg:col-span-2">
            <ProductGrid />
          </div>

          {/* Cart and Checkout */}
          <div className="space-y-6">
            <Cart />
            {hasItems && <Checkout />}
          </div>
        </div>
      </div>
    </div>
  );
};