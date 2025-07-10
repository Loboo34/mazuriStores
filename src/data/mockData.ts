import { Order, SalesData } from '../types';
import { subDays, format } from 'date-fns';

// Generate mock orders
export const mockOrders: Order[] = [
  {
    id: '1',
    userId: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '0712345678',
    items: [
      {
        product: {
          id: '1',
          name: 'Maasai Beaded Mirror',
          price: 2500,
          image: 'https://images.pexels.com/photos/6492477/pexels-photo-6492477.jpeg',
          images: ['https://images.pexels.com/photos/6492477/pexels-photo-6492477.jpeg'],
          category: 'beaded-mirror',
          description: 'Handcrafted beaded mirror',
          culturalStory: 'Traditional Maasai beadwork',
          availability: 'in-stock',
          rating: 4.8,
          reviews: 24,
          tags: ['handmade']
        },
        quantity: 1
      }
    ],
    total: 2500,
    status: 'pending',
    paymentMethod: 'mpesa',
    deliveryOption: 'delivery',
    address: 'Nairobi, Kenya',
    phone: '0712345678',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    userId: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '0723456789',
    items: [
      {
        product: {
          id: '2',
          name: 'African Clay Pottery Set',
          price: 1800,
          image: 'https://images.pexels.com/photos/4992635/pexels-photo-4992635.jpeg',
          images: ['https://images.pexels.com/photos/4992635/pexels-photo-4992635.jpeg'],
          category: 'kitchen',
          description: 'Traditional clay pottery',
          culturalStory: 'Ancient pottery techniques',
          availability: 'in-stock',
          rating: 4.6,
          reviews: 18,
          tags: ['pottery']
        },
        quantity: 2
      }
    ],
    total: 3600,
    status: 'delivered',
    paymentMethod: 'card',
    deliveryOption: 'pickup',
    address: 'Mombasa, Kenya',
    phone: '0723456789',
    createdAt: subDays(new Date(), 2).toISOString()
  },
  {
    id: '3',
    userId: '3',
    customerName: 'Michael Johnson',
    customerEmail: 'michael@example.com',
    customerPhone: '0734567890',
    items: [
      {
        product: {
          id: '3',
          name: 'Kente Pattern Wall Art',
          price: 3200,
          image: 'https://images.pexels.com/photos/6492663/pexels-photo-6492663.jpeg',
          images: ['https://images.pexels.com/photos/6492663/pexels-photo-6492663.jpeg'],
          category: 'wall-art',
          description: 'Vibrant Kente-inspired wall art',
          culturalStory: 'Ghana Kente heritage',
          availability: 'limited',
          rating: 4.9,
          reviews: 31,
          tags: ['kente']
        },
        quantity: 1
      }
    ],
    total: 3200,
    status: 'processing',
    paymentMethod: 'mpesa',
    deliveryOption: 'delivery',
    address: 'Kisumu, Kenya',
    phone: '0734567890',
    createdAt: subDays(new Date(), 1).toISOString()
  },
  {
    id: '4',
    userId: '4',
    customerName: 'Sarah Wilson',
    customerEmail: 'sarah@example.com',
    customerPhone: '0745678901',
    items: [
      {
        product: {
          id: '4',
          name: 'Handwoven Basket Set',
          price: 1500,
          image: 'https://images.pexels.com/photos/6207516/pexels-photo-6207516.jpeg',
          images: ['https://images.pexels.com/photos/6207516/pexels-photo-6207516.jpeg'],
          category: 'woven-items',
          description: 'Set of handwoven baskets',
          culturalStory: 'East African weaving traditions',
          availability: 'in-stock',
          rating: 4.7,
          reviews: 22,
          tags: ['baskets']
        },
        quantity: 1
      }
    ],
    total: 1500,
    status: 'shipped',
    paymentMethod: 'card',
    deliveryOption: 'delivery',
    address: 'Eldoret, Kenya',
    phone: '0745678901',
    createdAt: subDays(new Date(), 3).toISOString()
  },
  {
    id: '5',
    userId: '5',
    customerName: 'David Brown',
    customerEmail: 'david@example.com',
    customerPhone: '0756789012',
    items: [
      {
        product: {
          id: '5',
          name: 'Traditional Wooden Mask',
          price: 2800,
          image: 'https://images.pexels.com/photos/6084138/pexels-photo-6084138.jpeg',
          images: ['https://images.pexels.com/photos/6084138/pexels-photo-6084138.jpeg'],
          category: 'artifacts',
          description: 'Hand-carved wooden mask',
          culturalStory: 'Ceremonial African masks',
          availability: 'in-stock',
          rating: 4.8,
          reviews: 15,
          tags: ['mask']
        },
        quantity: 1
      }
    ],
    total: 2800,
    status: 'delivered',
    paymentMethod: 'mpesa',
    deliveryOption: 'pickup',
    address: 'Nakuru, Kenya',
    phone: '0756789012',
    createdAt: subDays(new Date(), 5).toISOString()
  }
];

// Generate mock sales data for the last 30 days
export const mockSalesData: SalesData[] = Array.from({ length: 30 }, (_, i) => {
  const date = subDays(new Date(), 29 - i);
  const baseOrders = Math.floor(Math.random() * 10) + 5;
  const baseRevenue = baseOrders * (Math.random() * 2000 + 1000);
  
  return {
    date: format(date, 'yyyy-MM-dd'),
    orders: baseOrders,
    sales: baseOrders,
    revenue: Math.round(baseRevenue)
  };
});