import axios from 'axios';
import moment from 'moment';
import { mpesaConfig } from '../config/mpesa.config';

export interface MpesaTokenResponse {
  access_token: string;
  expires_in: string;
}

export interface StkPushRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  TransactionType: string;
  Amount: number;
  PartyA: string;
  PartyB: string;
  PhoneNumber: string;
  CallBackURL: string;
  AccountReference: string;
  TransactionDesc: string;
}

export interface StkPushResponse {
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResponseCode: string;
  ResponseDescription: string;
  CustomerMessage: string;
}

export interface StkQueryRequest {
  BusinessShortCode: string;
  Password: string;
  Timestamp: string;
  CheckoutRequestID: string;
}

export interface StkQueryResponse {
  ResponseCode: string;
  ResponseDescription: string;
  MerchantRequestID: string;
  CheckoutRequestID: string;
  ResultCode: string;
  ResultDesc: string;
}

// Generate M-Pesa access token
export const generateAccessToken = async (): Promise<string> => {
  try {
    const auth = Buffer.from(`${mpesaConfig.CONSUMER_KEY}:${mpesaConfig.CONSUMER_SECRET}`).toString('base64');
    
    const response = await axios.get(
      `${mpesaConfig.BASE_URL}${mpesaConfig.OAUTH_URL}`,
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const data: MpesaTokenResponse = response.data;
    return data.access_token;
  } catch (error) {
    console.error('Error generating M-Pesa access token:', error);
    throw new Error('Failed to generate M-Pesa access token');
  }
};

// Generate M-Pesa password
export const generatePassword = (): { password: string; timestamp: string } => {
  const timestamp = moment().format('YYYYMMDDHHmmss');
  const password = Buffer.from(`${mpesaConfig.SHORTCODE}${mpesaConfig.PASSKEY}${timestamp}`).toString('base64');
  
  return { password, timestamp };
};

// Format phone number for M-Pesa
export const formatPhoneNumber = (phone: string): string => {
  // Remove any non-digit characters
  let cleanPhone = phone.replace(/\D/g, '');
  
  // Handle different phone number formats
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '254' + cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('+254')) {
    cleanPhone = cleanPhone.substring(1);
  } else if (cleanPhone.startsWith('254')) {
    // Already in correct format
  } else if (cleanPhone.length === 9) {
    cleanPhone = '254' + cleanPhone;
  }
  
  return cleanPhone;
};

// Initiate STK Push
export const initiateSTKPush = async (
  phoneNumber: string,
  amount: number,
  accountReference: string,
  transactionDesc: string
): Promise<StkPushResponse> => {
  try {
    const accessToken = await generateAccessToken();
    const { password, timestamp } = generatePassword();
    const formattedPhone = formatPhoneNumber(phoneNumber);

    const stkPushData: StkPushRequest = {
      BusinessShortCode: mpesaConfig.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount), // Ensure amount is an integer
      PartyA: formattedPhone,
      PartyB: mpesaConfig.SHORTCODE,
      PhoneNumber: formattedPhone,
      CallBackURL: mpesaConfig.CALLBACK_URL,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc
    };

    const response = await axios.post(
      `${mpesaConfig.BASE_URL}${mpesaConfig.STK_PUSH_URL}`,
      stkPushData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error initiating STK Push:', error);
    throw new Error('Failed to initiate M-Pesa payment');
  }
};

// Query STK Push status
export const queryStkPushStatus = async (checkoutRequestId: string): Promise<StkQueryResponse> => {
  try {
    const accessToken = await generateAccessToken();
    const { password, timestamp } = generatePassword();

    const queryData: StkQueryRequest = {
      BusinessShortCode: mpesaConfig.SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId
    };

    const response = await axios.post(
      `${mpesaConfig.BASE_URL}${mpesaConfig.STK_QUERY_URL}`,
      queryData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error querying STK Push status:', error);
    throw new Error('Failed to query M-Pesa payment status');
  }
};

// Validate M-Pesa callback
export const validateCallback = (callbackData: any): boolean => {
  try {
    return (
      callbackData &&
      callbackData.Body &&
      callbackData.Body.stkCallback &&
      callbackData.Body.stkCallback.MerchantRequestID &&
      callbackData.Body.stkCallback.CheckoutRequestID
    );
  } catch (error) {
    return false;
  }
};

// Extract payment details from callback
export const extractPaymentDetails = (callbackData: any) => {
  try {
    const stkCallback = callbackData.Body.stkCallback;
    const callbackMetadata = stkCallback.CallbackMetadata;
    
    if (!callbackMetadata || !callbackMetadata.Item) {
      return null;
    }

    const details: any = {
      merchantRequestId: stkCallback.MerchantRequestID,
      checkoutRequestId: stkCallback.CheckoutRequestID,
      resultCode: stkCallback.ResultCode,
      resultDesc: stkCallback.ResultDesc
    };

    // Extract metadata items
    callbackMetadata.Item.forEach((item: any) => {
      switch (item.Name) {
        case 'Amount':
          details.amount = item.Value;
          break;
        case 'MpesaReceiptNumber':
          details.mpesaReceiptNumber = item.Value;
          break;
        case 'TransactionDate':
          details.transactionDate = item.Value;
          break;
        case 'PhoneNumber':
          details.phoneNumber = item.Value;
          break;
      }
    });

    return details;
  } catch (error) {
    console.error('Error extracting payment details:', error);
    return null;
  }
};

// Test M-Pesa connection
export const testMpesaConnection = async (): Promise<boolean> => {
  try {
    await generateAccessToken();
    return true;
  } catch (error) {
    return false;
  }
};

export default {
  generateAccessToken,
  generatePassword,
  formatPhoneNumber,
  initiateSTKPush,
  queryStkPushStatus,
  validateCallback,
  extractPaymentDetails,
  testMpesaConnection
};