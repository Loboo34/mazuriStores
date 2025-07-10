import { config } from './env.config';

export const mpesaConfig = {
  // M-Pesa Configuration
  ENVIRONMENT: process.env.MPESA_ENVIRONMENT || 'sandbox',
  CONSUMER_KEY: process.env.MPESA_CONSUMER_KEY || 'your_consumer_key',
  CONSUMER_SECRET: process.env.MPESA_CONSUMER_SECRET || 'your_consumer_secret',
  PASSKEY: process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
  SHORTCODE: process.env.MPESA_SHORTCODE || '174379',
  INITIATOR_NAME: process.env.MPESA_INITIATOR_NAME || 'testapi',
  SECURITY_CREDENTIAL: process.env.MPESA_SECURITY_CREDENTIAL || 'your_security_credential',
  
  // URLs
  CALLBACK_URL: process.env.MPESA_CALLBACK_URL || 'https://yourdomain.com/api/v1/payments/mpesa/callback',
  TIMEOUT_URL: process.env.MPESA_TIMEOUT_URL || 'https://yourdomain.com/api/v1/payments/mpesa/timeout',
  
  // API URLs
  BASE_URL: process.env.MPESA_ENVIRONMENT === 'production' 
    ? 'https://api.safaricom.co.ke' 
    : 'https://sandbox.safaricom.co.ke',
    
  // Endpoints
  OAUTH_URL: '/oauth/v1/generate?grant_type=client_credentials',
  STK_PUSH_URL: '/mpesa/stkpush/v1/processrequest',
  STK_QUERY_URL: '/mpesa/stkpushquery/v1/query',
  B2C_URL: '/mpesa/b2c/v1/paymentrequest',
  TRANSACTION_STATUS_URL: '/mpesa/transactionstatus/v1/query',
  ACCOUNT_BALANCE_URL: '/mpesa/accountbalance/v1/query',
};

// Test credentials for sandbox
export const testCredentials = {
  CONSUMER_KEY: 'your_test_consumer_key',
  CONSUMER_SECRET: 'your_test_consumer_secret',
  PASSKEY: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
  SHORTCODE: '174379',
  TEST_PHONE: '254708374149', // Test phone number
};

export default mpesaConfig;