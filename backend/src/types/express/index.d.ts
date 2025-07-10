import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        name: string;
      };
      file?: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        destination: string;
        filename: string;
        path: string;
        buffer: Buffer;
      };
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

export interface MpesaCallbackRequest extends Request {
  body: {
    Body: {
      stkCallback: {
        MerchantRequestID: string;
        CheckoutRequestID: string;
        ResultCode: number;
        ResultDesc: string;
        CallbackMetadata?: {
          Item: Array<{
            Name: string;
            Value: string | number;
          }>;
        };
      };
    };
  };
}