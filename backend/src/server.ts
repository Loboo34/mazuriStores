import app from './app';
import connectDB from './config/db.config';
import { config } from './config/env.config';
import User from './models/user.model';
import Category from './models/category.model';
import { hashPassword } from './utils/password.util';

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Create default admin user if it doesn't exist
    await createDefaultAdmin();

    // Create default categories if they don't exist
    await createDefaultCategories();

    // Start server
    const server = app.listen(config.PORT, () => {
      console.log(`
🚀 Mazuri Stores API Server Started Successfully!

📍 Environment: ${config.NODE_ENV}
🌐 Server URL: http://localhost:${config.PORT}
📊 API Version: ${config.API_VERSION}
🔗 Health Check: http://localhost:${config.PORT}/health
📚 API Base: http://localhost:${config.PORT}/api/${config.API_VERSION}

🛍️ Endpoints:
   • Auth: /api/${config.API_VERSION}/auth
   • Products: /api/${config.API_VERSION}/products
   • Orders: /api/${config.API_VERSION}/orders
   • Categories: /api/${config.API_VERSION}/categories
   • Payments: /api/${config.API_VERSION}/payments
   • Admin: /api/${config.API_VERSION}/admin

🔐 Default Admin Credentials:
   • Email: ${config.ADMIN_EMAIL}
   • Password: ${config.ADMIN_PASSWORD}

💳 M-Pesa Integration: ${process.env.MPESA_ENVIRONMENT || 'sandbox'} mode
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🔄 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('🔄 SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('✅ Process terminated');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Create default admin user
const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: config.ADMIN_EMAIL });
    console.log(config.ADMIN_PASSWORD)
    
     if (!adminExists) {
    //   const hashedPassword = await hashPassword(config.ADMIN_PASSWORD);
      
      await User.create({
        name: config.ADMIN_NAME,
        email: config.ADMIN_EMAIL,
        password: config.ADMIN_PASSWORD,
        phone: '254759511401',
        role: 'admin',
        isActive: true,
        emailVerified: true,
        phoneVerified: true
      });
      
      console.log('✅ Default admin user created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};

// Create default categories
const createDefaultCategories = async () => {
  try {
    const categoriesCount = await Category.countDocuments();
    
    if (categoriesCount === 0) {
      const defaultCategories = [
        {
          name: 'Home Decor',
          slug: 'home-decor',
          description: 'Beautiful African home decoration items',
          icon: '🏠',
          sortOrder: 1
        },
        {
          name: 'Artifacts',
          slug: 'artifacts',
          description: 'Authentic African artifacts and traditional items',
          icon: '🏺',
          sortOrder: 2
        },
        {
          name: 'Kitchen',
          slug: 'kitchen',
          description: 'Traditional African kitchen items and pottery',
          icon: '🥄',
          sortOrder: 3
        },
        {
          name: 'Wall Art',
          slug: 'wall-art',
          description: 'African wall art and decorative pieces',
          icon: '🎨',
          sortOrder: 4
        },
        {
          name: 'Woven Items',
          slug: 'woven-items',
          description: 'Handwoven baskets and textile items',
          icon: '🧺',
          sortOrder: 5
        },
        {
          name: 'Hair Accessories',
          slug: 'hair-accessories',
          description: 'Traditional African hair accessories',
          icon: '👑',
          sortOrder: 6
        },
        {
          name: 'Beaded Mirror',
          slug: 'beaded-mirror',
          description: 'Handcrafted beaded mirrors',
          icon: '🪞',
          sortOrder: 7
        }
      ];

      await Category.insertMany(defaultCategories);
      console.log('✅ Default categories created successfully');
    }
  } catch (error) {
    console.error('❌ Error creating default categories:', error);
  }
};

// Start the server
startServer();