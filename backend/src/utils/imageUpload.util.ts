import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config/env.config';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET
});

// Multer configuration for memory storage
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Check file type
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Multer upload configuration
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter
});

// Upload single image to Cloudinary
export const uploadToCloudinary = async (
  buffer: Buffer,
  folder: string = 'mazuri-stores',
  filename?: string
): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto'
      };

      if (filename) {
        uploadOptions.public_id = filename;
      }

      cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result!.secure_url);
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    throw new Error(`Failed to upload image: ${error}`);
  }
};

// Upload multiple images to Cloudinary
export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  folder: string = 'mazuri-stores'
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file, index) => 
      uploadToCloudinary(file.buffer, folder, `${Date.now()}_${index}`)
    );
    
    return Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(`Failed to upload images: ${error}`);
  }
};

// Delete image from Cloudinary
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Failed to delete image: ${error}`);
  }
};

// Extract public ID from Cloudinary URL
export const extractPublicId = (url: string): string => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
};

// Generate optimized image URL
export const generateOptimizedUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
  } = {}
): string => {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  
  let transformation = `q_${quality},f_${format}`;
  
  if (width) transformation += `,w_${width}`;
  if (height) transformation += `,h_${height}`;
  
  return cloudinary.url(publicId, {
    transformation
  });
};

export default {
  upload,
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  extractPublicId,
  generateOptimizedUrl
};