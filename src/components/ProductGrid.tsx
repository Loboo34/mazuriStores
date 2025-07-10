import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, onQuickView }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-african-brown mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
      {products.map((product) => (
        <div key={product.id} className="animate-fade-in">
          <ProductCard product={product} onQuickView={onQuickView} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;