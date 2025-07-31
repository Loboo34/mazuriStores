import React, { useState } from 'react';
import { Minus, Plus, Trash2, Receipt, Tag } from 'lucide-react';
import { useCartStore } from '../../stores/cartStore';
import { Button } from '../common/Button';
import { BuyerType, PaymentMethod, DiscountType } from '../../types';

export const Cart: React.FC = () => {
  const {
    items,
    buyerType,
    paymentMethod,
    discount,
    notes,
    updateQuantity,
    removeItem,
    setBuyerType,
    setPaymentMethod,
    setDiscount,
    setNotes,
    getSubtotal,
    getDiscountAmount,
    getTotal,
    clearCart
  } = useCartStore();

  const [showDiscount, setShowDiscount] = useState(false);
  const [discountType, setDiscountType] = useState<DiscountType>('percentage');
  const [discountValue, setDiscountValue] = useState('');

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const total = getTotal();

  const handleApplyDiscount = () => {
    const value = parseFloat(discountValue);
    if (value > 0) {
      setDiscount({ type: discountType, value });
      setShowDiscount(false);
      setDiscountValue('');
    }
  };

  const handleRemoveDiscount = () => {
    setDiscount(null);
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Your cart is empty</p>
        <p className="text-gray-400 text-sm">Add items to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearCart}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </Button>
      </div>

      {/* Cart Items */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.product.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-gray-800">{item.product.name}</h4>
              <p className="text-sm text-gray-600">${item.product.price.toFixed(2)} each</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                className="w-8 h-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              
              <span className="w-8 text-center font-medium">{item.quantity}</span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                className="w-8 h-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.product.id)}
                className="w-8 h-8 p-0 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="ml-4 font-medium text-amber-600">
              ${item.subtotal.toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Buyer Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buyer Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {(['customer', 'vendor'] as BuyerType[]).map((type) => (
            <Button
              key={type}
              variant={buyerType === type ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setBuyerType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Payment Method
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['cash', 'card', 'mpesa'] as PaymentMethod[]).map((method) => (
            <Button
              key={method}
              variant={paymentMethod === method ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPaymentMethod(method)}
            >
              {method.charAt(0).toUpperCase() + method.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Discount */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Discount</label>
          {!discount && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDiscount(true)}
            >
              <Tag className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>

        {showDiscount && (
          <div className="bg-gray-50 p-3 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={discountType === 'percentage' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDiscountType('percentage')}
              >
                Percentage
              </Button>
              <Button
                variant={discountType === 'flat' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setDiscountType('flat')}
              >
                Flat Amount
              </Button>
            </div>
            
            <div className="flex gap-2">
              <input
                type="number"
                placeholder={discountType === 'percentage' ? 'Enter %' : 'Enter $'}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
              <Button size="sm" onClick={handleApplyDiscount}>
                Apply
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowDiscount(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {discount && (
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
            <span className="text-sm text-green-700">
              {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value}`} discount applied
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveDiscount}
              className="text-red-600"
            >
              Remove
            </Button>
          </div>
        )}
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any special instructions..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
          rows={2}
        />
      </div>

      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal:</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        
        {discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount:</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-xl font-bold text-amber-600 border-t pt-2">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};