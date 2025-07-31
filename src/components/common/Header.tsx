import React from 'react';
import { LogOut, User, ShoppingBag } from 'lucide-react';
import { useUserStore } from '../../stores/userStore';
import { useCartStore } from '../../stores/cartStore';
import { Button } from './Button';

export const Header: React.FC = () => {
  const { user, logout } = useUserStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <header className="bg-white shadow-sm border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <ShoppingBag className="h-8 w-8 text-amber-600 mr-3" />
            <h1 className="text-2xl font-bold text-amber-800">Golden Crust Bakery</h1>
          </div>

          {/* User info and actions */}
          <div className="flex items-center space-x-4">
            {itemCount > 0 && (
              <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                Cart: {itemCount} items
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{user?.username}</span>
              <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                {user?.role}
              </span>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-gray-600 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};