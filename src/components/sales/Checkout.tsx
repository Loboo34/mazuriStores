import React, { useState } from 'react';
import { CreditCard, Printer, Send } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { useOrderStore } from '../../stores/orderStore';
import { useUserStore } from '../../stores/userStore';
import { Button } from '../common/Button';

export const Checkout: React.FC = () => {
  const { 
    items, 
    buyerType, 
    paymentMethod, 
    discount, 
    notes, 
    getTotal, 
    clearCart 
  } = useCartStore();
  
  const { createOrder } = useOrderStore();
  const { user } = useUserStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getTotal();

  const handleCheckout = async () => {
    if (items.length === 0 || !user) return;

    setIsProcessing(true);
    try {
      const orderData = {
        items,
        total,
        buyerType,
        paymentMethod,
        discount,
        notes,
        cashierName: user.username,
      };

      await createOrder(orderData);
      clearCart();
      
      // Here you would typically show a success message or receipt
      alert('Order completed successfully!');
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const canCheckout = items.length > 0 && total > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray-800">Checkout</h3>

      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Items:</span>
          <span>{items.length}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Buyer:</span>
          <span className="capitalize">{buyerType}</span>
        </div>
        
        <div className="flex justify-between text-sm text-gray-600">
          <span>Payment:</span>
          <span className="capitalize">{paymentMethod}</span>
        </div>
        
        <div className="flex justify-between text-lg font-bold text-amber-600 border-t pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        fullWidth
        size="lg"
        onClick={handleCheckout}
        disabled={!canCheckout}
        loading={isProcessing}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        <CreditCard className="h-5 w-5" />
        Complete Order
      </Button>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canCheckout}
          className="text-amber-600"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          disabled={!canCheckout}
          className="text-amber-600"
        >
          <Send className="h-4 w-4" />
          Email
        </Button>
      </div>
    </div>
  );
};