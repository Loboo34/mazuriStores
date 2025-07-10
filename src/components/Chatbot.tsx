import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Search,
  Package,
  HelpCircle,
  ShoppingBag,
  Phone,
  Mail,
  Clock,
  MapPin,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products } from '../data/products';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'product' | 'order' | 'quick-actions';
  data?: any;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    { id: '1', label: 'Search Products', icon: <Search className="w-4 h-4" />, action: 'search_products' },
    { id: '2', label: 'Track Order', icon: <Package className="w-4 h-4" />, action: 'track_order' },
    { id: '3', label: 'Store Hours', icon: <Clock className="w-4 h-4" />, action: 'store_hours' },
    { id: '4', label: 'Contact Info', icon: <Phone className="w-4 h-4" />, action: 'contact_info' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addBotMessage(
          "🌍 Jambo! Welcome to Mazuri Stores! I'm your AI assistant. How can I help you discover authentic African decor today?",
          'quick-actions'
        );
      }, 500);
    }
  }, [isOpen]);

  const addBotMessage = (text: string, type: 'text' | 'product' | 'order' | 'quick-actions' = 'text', data?: any) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date(),
      type,
      data
    };
    setMessages(prev => [...prev, message]);
  };

  const addUserMessage = (text: string) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, message]);
  };

  const simulateTyping = (duration: number = 1000) => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), duration);
  };

  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    simulateTyping();
    
    setTimeout(() => {
      if (lowerMessage.includes('search') || lowerMessage.includes('product') || lowerMessage.includes('find')) {
        handleProductSearch(message);
      } else if (lowerMessage.includes('order') || lowerMessage.includes('track') || lowerMessage.includes('delivery')) {
        handleOrderTracking();
      } else if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('ksh')) {
        handlePriceInquiry();
      } else if (lowerMessage.includes('hours') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
        handleStoreHours();
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('email')) {
        handleContactInfo();
      } else if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
        handleLocationInfo();
      } else if (lowerMessage.includes('payment') || lowerMessage.includes('mpesa') || lowerMessage.includes('card')) {
        handlePaymentInfo();
      } else if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
        handleDeliveryInfo();
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('jambo')) {
        addBotMessage("Hello! 👋 I'm here to help you with anything related to Mazuri Stores. What would you like to know?", 'quick-actions');
      } else if (lowerMessage.includes('thank') || lowerMessage.includes('asante')) {
        addBotMessage("You're welcome! 😊 Is there anything else I can help you with today?", 'quick-actions');
      } else {
        handleGeneralInquiry(message);
      }
    }, 1000);
  };

  const handleProductSearch = (query: string) => {
    const searchTerms = query.toLowerCase().split(' ');
    const matchedProducts = products.filter(product => 
      searchTerms.some(term => 
        product.name.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.tags.some(tag => tag.toLowerCase().includes(term))
      )
    ).slice(0, 3);

    if (matchedProducts.length > 0) {
      addBotMessage(
        `I found ${matchedProducts.length} product${matchedProducts.length > 1 ? 's' : ''} that might interest you:`,
        'product',
        matchedProducts
      );
    } else {
      addBotMessage(
        "I couldn't find any products matching your search. Try searching for 'masks', 'baskets', 'pottery', or 'wall art'. Would you like to see our popular items instead?",
        'quick-actions'
      );
    }
  };

  const handleOrderTracking = () => {
    addBotMessage(
      "To track your order, I'll need your order number. It should look like #12345. You can find it in your confirmation email or SMS. Please share your order number and I'll help you track it! 📦",
      'order'
    );
  };

  const handlePriceInquiry = () => {
    addBotMessage(
      "Our products range from KSh 1,200 to KSh 3,500. Here are some popular price ranges:\n\n• Hair Accessories: KSh 1,200 - 1,500\n• Baskets & Pottery: KSh 1,500 - 2,000\n• Masks & Artifacts: KSh 2,500 - 3,500\n\nAll prices are in Kenyan Shillings. Would you like to see products in a specific price range?"
    );
  };

  const handleStoreHours = () => {
    addBotMessage(
      "🕐 **Store Hours:**\n\n📅 Monday - Saturday: 8:00 AM - 7:00 PM\n📅 Sunday: Closed\n\nWe're open 6 days a week to serve you! You can also shop online 24/7 on our website."
    );
  };

  const handleContactInfo = () => {
    addBotMessage(
      "📞 **Contact Information:**\n\n📱 Phone: 0759 511 401\n📧 Email: info@mazuristores.com\n📍 Location: Ukunda-Ramisi Rd, Ukunda, Kenya\n\nFeel free to call or email us anytime! We're here to help."
    );
  };

  const handleLocationInfo = () => {
    addBotMessage(
      "📍 **Our Location:**\n\nMazuri Stores\nUkunda-Ramisi Rd\nUkunda, Kenya\n\nWe're located on the main road and easy to find! You can visit us for pickup or browse our collection in person. We also offer delivery services."
    );
  };

  const handlePaymentInfo = () => {
    addBotMessage(
      "💳 **Payment Methods:**\n\n📱 M-Pesa (Mobile Money)\n💳 Credit/Debit Cards\n💵 Cash (for pickup orders)\n\nWe accept all major payment methods to make shopping convenient for you!"
    );
  };

  const handleDeliveryInfo = () => {
    addBotMessage(
      "🚚 **Delivery Information:**\n\n✅ Free delivery within Ukunda area\n📦 Pickup available at our store\n⏰ Same-day delivery for orders before 2 PM\n🎯 We deliver across Kenya\n\nChoose the option that works best for you during checkout!"
    );
  };

  const handleGeneralInquiry = (message: string) => {
    const responses = [
      "I'd be happy to help! Could you be more specific about what you're looking for? You can ask me about products, orders, store hours, or contact information.",
      "That's a great question! I can help you with product searches, order tracking, store information, and more. What specifically would you like to know?",
      "I'm here to assist you with Mazuri Stores! Feel free to ask about our African decor, artifacts, delivery options, or anything else you need help with."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    addBotMessage(randomResponse, 'quick-actions');
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'search_products':
        addUserMessage('I want to search for products');
        setTimeout(() => {
          addBotMessage(
            "Great! What type of African decor are you looking for? You can search for:\n\n🏺 Artifacts & Masks\n🧺 Baskets & Woven Items\n🎨 Wall Art & Kente\n🍽️ Kitchen & Pottery\n👑 Hair Accessories\n🪞 Beaded Mirrors\n\nJust tell me what interests you!"
          );
        }, 500);
        break;
      case 'track_order':
        addUserMessage('I want to track my order');
        setTimeout(() => handleOrderTracking(), 500);
        break;
      case 'store_hours':
        addUserMessage('What are your store hours?');
        setTimeout(() => handleStoreHours(), 500);
        break;
      case 'contact_info':
        addUserMessage('How can I contact you?');
        setTimeout(() => handleContactInfo(), 500);
        break;
    }
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addUserMessage(inputValue);
      processUserMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const ProductCard: React.FC<{ product: any }> = ({ product }) => (
    <div className="bg-african-cream rounded-lg p-3 mb-2 border border-african-terracotta border-opacity-20">
      <div className="flex space-x-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-16 h-16 object-cover rounded-lg"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-african-brown text-sm">{product.name}</h4>
          <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
          <p className="text-african-terracotta font-bold text-sm mt-1">
            KSh {product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
          isOpen ? 'bg-african-red' : 'bg-african-terracotta hover:bg-african-terracotta-dark'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
        
        {/* Notification Badge */}
        {!isOpen && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-african-gold rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs font-bold text-african-brown">!</span>
          </motion.div>
        )}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-24 right-6 z-40 bg-white rounded-2xl shadow-2xl border border-gray-200 ${
              isMinimized ? 'w-80 h-16' : 'w-80 sm:w-96 h-96 sm:h-[500px]'
            } transition-all duration-300`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-african-terracotta to-african-gold text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Mazuri Assistant</h3>
                  <p className="text-xs opacity-90">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={toggleChatbot}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 h-80 sm:h-96">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-african-terracotta text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {message.sender === 'bot' && (
                          <div className="flex items-center space-x-2 mb-1">
                            <Bot className="w-4 h-4 text-african-terracotta" />
                            <span className="text-xs font-medium text-african-terracotta">Mazuri Assistant</span>
                          </div>
                        )}
                        
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        
                        {/* Product Cards */}
                        {message.type === 'product' && message.data && (
                          <div className="mt-3 space-y-2">
                            {message.data.map((product: any) => (
                              <ProductCard key={product.id} product={product} />
                            ))}
                          </div>
                        )}
                        
                        {/* Quick Actions */}
                        {message.type === 'quick-actions' && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {quickActions.map((action) => (
                              <button
                                key={action.id}
                                onClick={() => handleQuickAction(action.action)}
                                className="flex items-center space-x-2 p-2 bg-african-cream text-african-brown rounded-lg hover:bg-african-gold hover:text-white transition-colors duration-200 text-xs"
                              >
                                {action.icon}
                                <span>{action.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex justify-start"
                    >
                      <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-african-terracotta" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-african-terracotta rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-african-terracotta rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-african-terracotta rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about Mazuri Stores..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-african-gold focus:border-transparent text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim()}
                      className={`p-2 rounded-full transition-colors duration-200 ${
                        inputValue.trim()
                          ? 'bg-african-terracotta text-white hover:bg-african-terracotta-dark'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;