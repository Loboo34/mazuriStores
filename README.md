# 🌍 Mazuri Stores - Authentic African E-commerce Platform

![Mazuri Stores](https://images.pexels.com/photos/6492477/pexels-photo-6492477.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

**Mazuri Stores** is a modern, responsive e-commerce platform celebrating African heritage through authentic decor, artifacts, and handcrafted items. Built with React, TypeScript, and Tailwind CSS, it offers a complete shopping experience with an integrated admin panel and AI-powered customer support.

## ✨ Features

### 🛍️ **Customer Experience**
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Product Catalog**: Browse authentic African decor, artifacts, and handcrafted items
- **Smart Search**: Find products by name, category, or cultural significance
- **Shopping Cart**: Add, remove, and manage items with real-time updates
- **Secure Checkout**: Multiple payment options (M-Pesa, Cards, Cash)
- **Order Tracking**: Monitor order status from placement to delivery
- **User Authentication**: Secure login and registration system
- **AI Chatbot**: 24/7 customer support with intelligent responses

### 🎨 **Design & UX**
- **African-Inspired Theme**: Warm terracotta, gold, and earth tones
- **Smooth Animations**: Framer Motion powered transitions
- **Cultural Storytelling**: Each product includes its cultural heritage
- **Accessibility**: WCAG compliant design with keyboard navigation
- **Mobile-First**: Progressive enhancement for all devices

### 🔧 **Admin Panel**
- **Dashboard Analytics**: Sales charts, order statistics, revenue tracking
- **Product Management**: Add, edit, delete products with image uploads
- **Order Management**: Update order status, edit customer information
- **Customer Support**: View and manage customer inquiries
- **Settings**: Admin profile management and security controls
- **JWT Authentication**: Secure admin access with token-based auth

### 🤖 **AI Chatbot Features**
- **Product Search**: Natural language product discovery
- **Order Tracking**: Real-time order status updates
- **FAQ Support**: Instant answers to common questions
- **Store Information**: Hours, location, contact details
- **Payment Help**: Guidance on payment methods
- **Delivery Info**: Shipping and pickup options
- **Cultural Context**: Information about African heritage items

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/mazuri-stores.git
   cd mazuri-stores
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 🏗️ Project Structure

```
mazuri-stores/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── admin/           # Admin panel components
│   │   ├── Chatbot.tsx      # AI chatbot component
│   │   ├── Header.tsx       # Navigation header
│   │   ├── ProductCard.tsx  # Product display card
│   │   └── ...
│   ├── contexts/            # React context providers
│   │   ├── AuthContext.tsx  # Authentication state
│   │   ├── CartContext.tsx  # Shopping cart state
│   │   └── AdminContext.tsx # Admin panel state
│   ├── data/                # Mock data and constants
│   │   ├── products.ts      # Product catalog
│   │   └── mockData.ts      # Sample orders and analytics
│   ├── types/               # TypeScript type definitions
│   └── App.tsx              # Main application component
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json            # Project dependencies
```

## 🎯 Key Technologies

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with IntelliSense
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful, customizable icons
- **React Router**: Client-side routing and navigation

### State Management
- **React Context**: Global state management
- **useReducer**: Complex state logic for cart operations
- **Local Storage**: Persistent user sessions and preferences

### Development Tools
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and quality assurance
- **PostCSS**: CSS processing and optimization

## 🛒 Product Categories

- **🏺 Artifacts**: Traditional masks, sculptures, ceremonial items
- **🧺 Woven Items**: Handwoven baskets, textiles, storage solutions
- **🎨 Wall Art**: Kente patterns, cultural paintings, decorative pieces
- **🍽️ Kitchen**: Clay pottery, traditional cooking vessels
- **👑 Hair Accessories**: Beaded headpieces, traditional ornaments
- **🪞 Beaded Mirrors**: Handcrafted mirrors with traditional beadwork

## 💳 Payment & Delivery

### Payment Methods
- **M-Pesa**: Kenya's leading mobile money platform
- **Credit/Debit Cards**: Visa, Mastercard, local bank cards
- **Cash on Delivery**: For pickup orders

### Delivery Options
- **Free Delivery**: Within Ukunda area
- **Same-Day Delivery**: Orders placed before 2 PM
- **Store Pickup**: Available during business hours
- **Nationwide Shipping**: Delivery across Kenya

## 🏪 Store Information

**Location**: Ukunda-Ramisi Rd, Ukunda, Kenya  
**Phone**: 0759 511 401  
**Email**: info@mazuristores.com  

**Business Hours**:
- Monday - Saturday: 8:00 AM - 7:00 PM
- Sunday: Closed

## 🔐 Admin Access

### Demo Credentials
- **Email**: admin@mazuristores.com
- **Password**: admin123

### Admin Features
- Real-time dashboard with sales analytics
- Product inventory management
- Order processing and status updates
- Customer information management
- Secure profile and password management

## 🤖 Chatbot Capabilities

The AI chatbot provides intelligent customer support with:

### Natural Language Processing
- Understands customer queries in multiple formats
- Provides contextual responses based on intent
- Offers quick action buttons for common tasks

### Product Discovery
- Search products by name, category, or description
- Display product cards with images and pricing
- Suggest related items and alternatives

### Customer Support
- Order tracking with real-time status updates
- Store hours and location information
- Payment and delivery guidance
- FAQ responses for common questions

### Interactive Features
- Typing indicators for natural conversation flow
- Quick action buttons for common requests
- Minimizable interface for better UX
- Responsive design for all devices

## 🎨 Design System

### Color Palette
```css
/* African-Inspired Colors */
--african-terracotta: #CD853F    /* Primary brand color */
--african-gold: #DAA520          /* Accent and highlights */
--african-red: #B22222           /* Alerts and emphasis */
--african-brown: #8B4513         /* Text and borders */
--african-cream: #F5F5DC         /* Backgrounds */
--african-teal: #008B8B          /* Secondary actions */
```

### Typography
- **Display Font**: Poppins (headings, brand elements)
- **Body Font**: Inter (content, UI elements)
- **Font Weights**: 400 (regular), 600 (semibold), 700 (bold)

### Spacing System
- Based on 8px grid system
- Consistent margins and padding
- Responsive breakpoints for all devices

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Features
- Touch-friendly interface
- Swipe gestures for product carousels
- Optimized checkout flow
- Mobile-specific navigation

## 🔒 Security Features

### Authentication
- JWT-based secure authentication
- Password hashing and validation
- Session management with auto-logout
- Role-based access control

### Data Protection
- Input validation and sanitization
- XSS protection
- CSRF token implementation
- Secure API endpoints

## 🚀 Performance Optimizations

### Frontend
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Efficient re-rendering with React.memo
- Bundle size optimization

### User Experience
- Skeleton loading states
- Optimistic UI updates
- Error boundaries for graceful failures
- Progressive Web App features

## 🧪 Testing

### Test Coverage
- Unit tests for utility functions
- Component testing with React Testing Library
- Integration tests for user flows
- E2E testing with Cypress

### Quality Assurance
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Husky for pre-commit hooks

## 🌍 Cultural Significance

Mazuri Stores celebrates African heritage by:

### Authentic Products
- Sourced directly from African artisans
- Each item includes cultural context and history
- Supporting traditional craftsmanship
- Preserving cultural knowledge

### Educational Content
- Stories behind each product
- Cultural significance explanations
- Artisan profiles and techniques
- Heritage preservation initiatives

## 📈 Analytics & Insights

### Dashboard Metrics
- Real-time sales tracking
- Order volume and trends
- Customer behavior analytics
- Product performance insights
- Revenue growth tracking

### Business Intelligence
- Daily, weekly, monthly reports
- Customer segmentation
- Inventory management
- Profit margin analysis

## 🤝 Contributing

We welcome contributions to improve Mazuri Stores! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Pexels**: High-quality product images
- **Lucide**: Beautiful icon library
- **Tailwind CSS**: Utility-first CSS framework
- **African Artisans**: Inspiration for authentic products
- **Open Source Community**: Tools and libraries that made this possible

## 📞 Support

For technical support or business inquiries:

- **Email**: support@mazuristores.com
- **Phone**: +254 759 511 401
- **GitHub Issues**: [Report bugs or request features](https://github.com/your-username/mazuri-stores/issues)

---

**Built with ❤️ for African Heritage** | **Mazuri Stores © 2024**