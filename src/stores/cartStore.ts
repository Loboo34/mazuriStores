import { create } from 'zustand';
import { CartItem, Product, BuyerType, PaymentMethod, DiscountType } from '../types';

interface CartState {
  items: CartItem[];
  buyerType: BuyerType;
  paymentMethod: PaymentMethod;
  discount: { type: DiscountType; value: number } | null;
  notes: string;
  
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  setBuyerType: (type: BuyerType) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  setDiscount: (discount: { type: DiscountType; value: number } | null) => void;
  setNotes: (notes: string) => void;
  
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  buyerType: 'customer',
  paymentMethod: 'cash',
  discount: null,
  notes: '',

  addItem: (product, quantity = 1) => {
    const { items } = get();
    const existingItem = items.find(item => item.product.id === product.id);

    if (existingItem) {
      set({
        items: items.map(item =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + quantity,
                subtotal: (item.quantity + quantity) * product.price
              }
            : item
        )
      });
    } else {
      set({
        items: [
          ...items,
          {
            product,
            quantity,
            subtotal: quantity * product.price
          }
        ]
      });
    }
  },

  removeItem: (productId) => {
    set({
      items: get().items.filter(item => item.product.id !== productId)
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }

    set({
      items: get().items.map(item =>
        item.product.id === productId
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.product.price
            }
          : item
      )
    });
  },

  clearCart: () => {
    set({
      items: [],
      buyerType: 'customer',
      paymentMethod: 'cash',
      discount: null,
      notes: ''
    });
  },

  setBuyerType: (type) => set({ buyerType: type }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),
  setDiscount: (discount) => set({ discount }),
  setNotes: (notes) => set({ notes }),

  getSubtotal: () => {
    return get().items.reduce((total, item) => total + item.subtotal, 0);
  },

  getDiscountAmount: () => {
    const { discount } = get();
    const subtotal = get().getSubtotal();
    
    if (!discount) return 0;
    
    if (discount.type === 'percentage') {
      return (subtotal * discount.value) / 100;
    } else {
      return Math.min(discount.value, subtotal);
    }
  },

  getTotal: () => {
    return Math.max(0, get().getSubtotal() - get().getDiscountAmount());
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));