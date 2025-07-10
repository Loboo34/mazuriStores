import { Product, Category } from '../types';

export const categories: Category[] = [
  { id: '1', name: 'All', slug: 'all', icon: '🛍️' },
  { id: '2', name: 'Home Decor', slug: 'home-decor', icon: '🏠' },
  { id: '3', name: 'Artifacts', slug: 'artifacts', icon: '🏺' },
  { id: '4', name: 'Kitchen', slug: 'kitchen', icon: '🥄' },
  { id: '5', name: 'Wall Art', slug: 'wall-art', icon: '🎨' },
  { id: '6', name: 'Woven Items', slug: 'woven-items', icon: '🧺' },
  { id: '7', name: 'Hair Accessories', slug: 'hair-accessories', icon: '👑' },
  { id: '8', name: 'Beaded Mirror', slug: 'beaded-mirror', icon: '🪞' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Maasai Beaded Mirror',
    price: 2500,
   
    images: [
      'https://images.pexels.com/photos/6492477/pexels-photo-6492477.jpeg',
      'https://images.pexels.com/photos/6084138/pexels-photo-6084138.jpeg'
    ],
    category: 'beaded-mirror',
    description: 'Handcrafted beaded mirror with traditional Maasai patterns',
    culturalStory: 'This mirror represents the Maasai tradition of intricate beadwork, where each color tells a story of their rich cultural heritage.',
    availability: 'in-stock',
    rating: 4.8,
    reviews: 24,
    tags: ['handmade', 'traditional', 'maasai', 'mirror']
  },
  {
    id: '2',
    name: 'African Clay Pottery Set',
    price: 1800,
    image: 'https://images.pexels.com/photos/4992635/pexels-photo-4992635.jpeg',
    images: [
      'https://images.pexels.com/photos/4992635/pexels-photo-4992635.jpeg',
      'https://images.pexels.com/photos/6207516/pexels-photo-6207516.jpeg'
    ],
    category: 'kitchen',
    description: 'Traditional clay pottery set perfect for authentic African cooking',
    culturalStory: 'Crafted using ancient techniques passed down through generations, these pots enhance the flavor of traditional dishes.',
    availability: 'in-stock',
    rating: 4.6,
    reviews: 18,
    tags: ['pottery', 'clay', 'cooking', 'traditional']
  },
  {
    id: '3',
    name: 'Kente Pattern Wall Art',
    price: 3200,
    image: 'https://images.pexels.com/photos/6492663/pexels-photo-6492663.jpeg',
    images: [
      'https://images.pexels.com/photos/6492663/pexels-photo-6492663.jpeg',
      'https://images.pexels.com/photos/6207635/pexels-photo-6207635.jpeg'
    ],
    category: 'wall-art',
    description: 'Vibrant Kente-inspired wall art piece',
    culturalStory: 'Kente cloth originates from Ghana and represents the history, philosophy, and cultural heritage of West Africa.',
    availability: 'limited',
    rating: 4.9,
    reviews: 31,
    tags: ['kente', 'wall-art', 'ghana', 'colorful']
  },
  {
    id: '4',
    name: 'Handwoven Basket Set',
    price: 1500,
    image: 'https://images.pexels.com/photos/6207516/pexels-photo-6207516.jpeg',
    images: [
      'https://images.pexels.com/photos/6207516/pexels-photo-6207516.jpeg',
      'https://images.pexels.com/photos/4992635/pexels-photo-4992635.jpeg'
    ],
    category: 'woven-items',
    description: 'Set of 3 handwoven baskets for storage and decoration',
    culturalStory: 'These baskets are woven using traditional techniques from East African communities, perfect for organizing and adding natural beauty to your home.',
    availability: 'in-stock',
    rating: 4.7,
    reviews: 22,
    tags: ['baskets', 'storage', 'handwoven', 'natural']
  },
  {
    id: '5',
    name: 'Traditional Wooden Mask',
    price: 2800,
    image: 'https://images.pexels.com/photos/6084138/pexels-photo-6084138.jpeg',
    images: [
      'https://images.pexels.com/photos/6084138/pexels-photo-6084138.jpeg',
      'https://images.pexels.com/photos/6492477/pexels-photo-6492477.jpeg'
    ],
    category: 'artifacts',
    description: 'Authentic hand-carved wooden mask with ceremonial significance',
    culturalStory: 'These masks play important roles in African ceremonies and rituals, representing spirits, ancestors, and cultural values.',
    availability: 'in-stock',
    rating: 4.8,
    reviews: 15,
    tags: ['mask', 'wooden', 'ceremonial', 'handcarved']
  },
  {
    id: '6',
    name: 'Beaded Hair Accessories Set',
    price: 1200,
    image: 'https://images.pexels.com/photos/6207635/pexels-photo-6207635.jpeg',
    images: [
      'https://images.pexels.com/photos/6207635/pexels-photo-6207635.jpeg',
      'https://images.pexels.com/photos/6492663/pexels-photo-6492663.jpeg'
    ],
    category: 'hair-accessories',
    description: 'Beautiful set of beaded hair accessories',
    culturalStory: 'Hair accessories hold special meaning in African culture, often indicating social status, age, and tribal affiliation.',
    availability: 'in-stock',
    rating: 4.5,
    reviews: 28,
    tags: ['beaded', 'hair', 'accessories', 'traditional']
  }
];