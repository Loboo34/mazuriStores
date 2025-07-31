import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../stores/cartStore';
import { Button } from '../common/Button';
import { apiService } from '../../services/api';

export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  const categories = ['all', 'bread', 'pastries', 'beverages', 'cakes', 'cookies'];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory, searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category.toLowerCase() === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    if (product.inStock) {
      addItem(product);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className={`bg-white rounded-lg shadow-md border-2 transition-all duration-200 hover:shadow-lg ${
              product.inStock 
                ? 'border-amber-200 hover:border-amber-300' 
                : 'border-gray-200 opacity-60'
            }`}
          >
            <div className="p-4">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
              )}
              
              <h3 className="font-semibold text-lg text-gray-800 mb-1">
                {product.name}
              </h3>
              
              <p className="text-sm text-gray-600 capitalize mb-2">
                {product.category}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-amber-600">
                  ${product.price.toFixed(2)}
                </span>
                
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(product)}
                  disabled={!product.inStock}
                  className="min-w-[44px]"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              
              {!product.inStock && (
                <p className="text-red-500 text-sm mt-2 font-medium">
                  Out of Stock
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No products found</p>
        </div>
      )}
    </div>
  );
};