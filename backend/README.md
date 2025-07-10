# 🌍 Mazuri Stores Backend API

A comprehensive Node.js backend API for the Mazuri Stores African e-commerce platform, built with TypeScript, Express.js, MongoDB, and M-Pesa integration.

## ✨ Features

### 🔐 **Authentication & Authorization**
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/Customer)
- Secure password hashing with bcrypt
- Protected routes and middleware

### 🛍️ **E-commerce Core**
- Product management with categories
- Shopping cart functionality
- Order processing and tracking
- Inventory management
- Customer management

### 💳 **Payment Integration**
- M-Pesa STK Push integration
- Payment status tracking
- Transaction logging
- Webhook handling for payment callbacks

### 📊 **Admin Dashboard**
- Real-time analytics and statistics
- Sales reporting and charts
- Order management
- Product inventory tracking
- Customer insights

### 🖼️ **File Management**
- Cloudinary integration for image uploads
- Multiple image support for products
- Optimized image delivery

### 🔒 **Security Features**
- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation with Joi
- Error handling and logging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 4.4+
- npm or yarn

### Installation

1. **Clone and setup**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables**
   ```env
   # Server
   NODE_ENV=development
   PORT=5000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/mazuri_stores
   
   # JWT
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   
   # M-Pesa (Sandbox)
   MPESA_CONSUMER_KEY=your_consumer_key
   MPESA_CONSUMER_SECRET=your_consumer_secret
   MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
   MPESA_SHORTCODE=174379
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── db.config.ts
│   │   ├── env.config.ts
│   │   └── mpesa.config.ts
│   ├── controllers/      # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   ├── payment.controller.ts
│   │   └── dashboard.controller.ts
│   ├── models/          # MongoDB models
│   │   ├── user.model.ts
│   │   ├── product.model.ts
│   │   ├── order.model.ts
│   │   └── transaction.model.ts
│   ├── routes/          # API routes
│   │   ├── auth.routes.ts
│   │   ├── product.routes.ts
│   │   ├── order.routes.ts
│   │   └── payment.routes.ts
│   ├── middlewares/     # Custom middleware
│   │   ├── auth.middleware.ts
│   │   ├── validate.middleware.ts
│   │   └── errorHandler.middleware.ts
│   ├── utils/           # Utility functions
│   │   ├── jwt.util.ts
│   │   ├── mpesa.util.ts
│   │   └── imageUpload.util.ts
│   ├── types/           # TypeScript types
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── uploads/             # Local file uploads
├── .env.example         # Environment template
├── package.json
└── tsconfig.json
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register      # User registration
POST   /api/v1/auth/login         # User login
GET    /api/v1/auth/profile       # Get user profile
PUT    /api/v1/auth/profile       # Update profile
PUT    /api/v1/auth/change-password # Change password
POST   /api/v1/auth/refresh-token # Refresh JWT token
```

### Products
```
GET    /api/v1/products           # Get all products
GET    /api/v1/products/:id       # Get product by ID
GET    /api/v1/products/featured  # Get featured products
GET    /api/v1/products/search    # Search products
POST   /api/v1/products           # Create product (Admin)
PUT    /api/v1/products/:id       # Update product (Admin)
DELETE /api/v1/products/:id       # Delete product (Admin)
```

### Orders
```
POST   /api/v1/orders             # Create new order
GET    /api/v1/orders/my-orders   # Get user orders
GET    /api/v1/orders/:id         # Get order by ID
PATCH  /api/v1/orders/:id/cancel  # Cancel order
GET    /api/v1/orders             # Get all orders (Admin)
PATCH  /api/v1/orders/:id/status  # Update order status (Admin)
```

### Payments
```
POST   /api/v1/payments/mpesa/initiate    # Initiate M-Pesa payment
GET    /api/v1/payments/mpesa/status/:id  # Check payment status
POST   /api/v1/payments/mpesa/callback    # M-Pesa callback (webhook)
GET    /api/v1/payments/history           # Payment history
GET    /api/v1/payments/admin/transactions # All transactions (Admin)
```

### Admin Dashboard
```
GET    /api/v1/admin/dashboard/stats           # Dashboard statistics
GET    /api/v1/admin/dashboard/sales-analytics # Sales analytics
GET    /api/v1/admin/dashboard/top-products    # Top selling products
GET    /api/v1/admin/dashboard/recent-orders   # Recent orders
```

## 💳 M-Pesa Integration

### Setup M-Pesa Credentials

1. **Get Sandbox Credentials**
   - Visit [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
   - Create an app and get Consumer Key & Secret
   - Use sandbox credentials for testing

2. **Configure Environment**
   ```env
   MPESA_ENVIRONMENT=sandbox
   MPESA_CONSUMER_KEY=your_consumer_key
   MPESA_CONSUMER_SECRET=your_consumer_secret
   MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
   MPESA_SHORTCODE=174379
   MPESA_CALLBACK_URL=https://yourdomain.com/api/v1/payments/mpesa/callback
   ```

3. **Test Payment Flow**
   ```bash
   # Initiate payment
   curl -X POST http://localhost:5000/api/v1/payments/mpesa/initiate \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "orderId": "ORDER_ID",
       "phoneNumber": "254708374149",
       "amount": 1000
     }'
   ```

### M-Pesa Test Numbers
- **Test Phone**: 254708374149
- **Test Amount**: Any amount between 1-70000
- **PIN**: 1234

## 🗄️ Database Schema

### User Model
```typescript
{
  name: string;
  email: string;
  password: string;
  phone: string;
  address?: string;
  role: 'customer' | 'admin';
  isActive: boolean;
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
  };
}
```

### Product Model
```typescript
{
  name: string;
  description: string;
  culturalStory: string;
  price: number;
  images: string[];
  category: string;
  tags: string[];
  availability: 'in-stock' | 'out-of-stock' | 'limited';
  stock: number;
  rating: number;
  featured: boolean;
}
```

### Order Model
```typescript
{
  orderNumber: string;
  user: ObjectId;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
    address?: string;
  };
  items: [{
    product: ObjectId;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'mpesa' | 'card' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed';
}
```

### Transaction Model
```typescript
{
  transactionId: string;
  order: ObjectId;
  user: ObjectId;
  amount: number;
  paymentMethod: 'mpesa' | 'card' | 'cash';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  mpesaData?: {
    merchantRequestId?: string;
    checkoutRequestId?: string;
    mpesaReceiptNumber?: string;
    phoneNumber?: string;
  };
}
```

## 🔒 Security Features

### Authentication
- JWT tokens with expiration
- Refresh token mechanism
- Password hashing with bcrypt (12 rounds)
- Role-based access control

### API Security
- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- Input validation with Joi
- MongoDB injection prevention

### Error Handling
- Global error handler
- Operational vs programming errors
- Detailed error logging
- User-friendly error messages

## 📊 Monitoring & Logging

### Request Logging
- Morgan HTTP request logger
- Different formats for dev/production
- Request timing and status codes

### Error Logging
- Comprehensive error tracking
- Stack traces in development
- Sanitized errors in production

### Health Checks
```bash
GET /health
```
Returns server status and basic information.

## 🧪 Testing

### Manual Testing
```bash
# Test authentication
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mazuristores.com", "password": "admin123"}'

# Test product creation
curl -X POST http://localhost:5000/api/v1/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "description": "Test description",
    "culturalStory": "Test story",
    "price": 1000,
    "category": "artifacts",
    "stock": 10,
    "origin": "Kenya"
  }'
```

### API Testing Tools
- **Postman**: Import collection from `/docs/postman/`
- **Thunder Client**: VS Code extension
- **curl**: Command line testing

## 🚀 Deployment

### Environment Setup
```bash
# Production environment variables
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your-production-secret
MPESA_ENVIRONMENT=production
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 5000
CMD ["node", "dist/server.js"]
```

### PM2 Process Manager
```bash
npm install -g pm2
pm2 start dist/server.js --name "mazuri-api"
pm2 startup
pm2 save
```

## 🔧 Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/mazuri_stores |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRE` | JWT expiration time | 7d |
| `MPESA_CONSUMER_KEY` | M-Pesa consumer key | Required for payments |
| `MPESA_CONSUMER_SECRET` | M-Pesa consumer secret | Required for payments |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Required for images |

### Default Admin Account
- **Email**: admin@mazuristores.com
- **Password**: admin123
- **Role**: admin

## 📈 Performance Optimization

### Database Optimization
- Indexed fields for faster queries
- Aggregation pipelines for analytics
- Connection pooling
- Query optimization

### Caching Strategy
- In-memory caching for frequently accessed data
- Redis integration (optional)
- HTTP caching headers

### File Handling
- Cloudinary for image optimization
- Automatic image resizing
- CDN delivery

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   ```bash
   # Check MongoDB status
   sudo systemctl status mongod
   
   # Start MongoDB
   sudo systemctl start mongod
   ```

2. **M-Pesa Integration Issues**
   ```bash
   # Test M-Pesa connectivity
   curl -X GET http://localhost:5000/api/v1/payments/mpesa/test
   ```

3. **JWT Token Errors**
   ```bash
   # Check token expiration
   # Ensure JWT_SECRET is set correctly
   ```

### Debug Mode
```bash
DEBUG=* npm run dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add proper error handling
- Update documentation
- Test your changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Safaricom Daraja API** for M-Pesa integration
- **MongoDB** for database solutions
- **Cloudinary** for image management
- **Express.js** community for excellent middleware

## 📞 Support

For technical support or questions:

- **Email**: support@mazuristores.com
- **Phone**: +254 759 511 401
- **GitHub Issues**: [Report bugs or request features](https://github.com/mazuri-stores/backend/issues)

---

**Built with ❤️ for African Heritage** | **Mazuri Stores Backend © 2024**