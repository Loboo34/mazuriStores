import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt.util';
import User from '../models/user.model';

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded: JwtPayload = verifyToken(token);
      
      // Verify user still exists and is active
      const user = await User.findById(decoded.id).select('-password');
      if (!user || !user.isActive) {
         res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
        return;
      }

      // Add user to request object
      req.user = {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
        name: user.name
      };

      next();
    } catch (tokenError) {
       res.status(401).json({
        success: false,
        message: 'Invalid or expired token'
      });
    }
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed'
    });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
       res.status(401).json({
         success: false,
         message: 'Authentication required'
       });
       return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
      return;
    }

    next();
  };
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      
      try {
        const decoded: JwtPayload = verifyToken(token);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.isActive) {
          req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            name: user.name
          };
        }
      } catch (tokenError) {
        // Token is invalid, but we continue without authentication
      }
    }

    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next();
  }
};

export default {
  authenticate,
  authorize,
  optionalAuth
};