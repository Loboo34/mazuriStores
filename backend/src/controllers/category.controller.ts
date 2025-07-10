import { Request, Response } from 'express';
import Category from '../models/category.model';
import Product from '../models/product.model';
import { asyncHandler, createError } from '../middlewares/errorHandler.middleware';

// Get all categories
export const getAllCategories = asyncHandler(async (req: Request, res: Response) => {
  const includeInactive = req.query.includeInactive === 'true';
  
  const query = includeInactive ? {} : { isActive: true };
  
  const categories = await Category.find(query)
    .populate('subcategories')
    .sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    data: { categories }
  });
});

// Get category by ID
export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate('subcategories');

  if (!category) {
    throw createError('Category not found', 404);
  }

  res.status(200).json({
    success: true,
    data: { category }
  });
});

// Get category by slug
export const getCategoryBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug, isActive: true })
    .populate('subcategories');

  if (!category) {
    throw createError('Category not found', 404);
  }

  // Get products count for this category
  const productCount = await Product.countDocuments({ 
    category: category.slug, 
    isActive: true 
  });

  res.status(200).json({
    success: true,
    data: { 
      category: {
        ...category.toObject(),
        productCount
      }
    }
  });
});

// Create new category (Admin only)
export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, icon, image, parentCategory, sortOrder } = req.body;

  // Check if category with same name already exists
  const existingCategory = await Category.findOne({ name });
  if (existingCategory) {
    throw createError('Category with this name already exists', 400);
  }

  const category = await Category.create({
    name,
    description,
    icon,
    image,
    parentCategory,
    sortOrder
  });

  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: { category }
  });
});

// Update category (Admin only)
export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;

  const category = await Category.findById(id);

  if (!category) {
    throw createError('Category not found', 404);
  }

  // Check if name is being updated and if it conflicts
  if (updateData.name && updateData.name !== category.name) {
    const existingCategory = await Category.findOne({ 
      name: updateData.name,
      _id: { $ne: id }
    });
    
    if (existingCategory) {
      throw createError('Category with this name already exists', 400);
    }
  }

  const updatedCategory = await Category.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: { category: updatedCategory }
  });
});

// Delete category (Admin only)
export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw createError('Category not found', 404);
  }

  // Check if category has products
  const productCount = await Product.countDocuments({ category: category.slug });
  if (productCount > 0) {
    throw createError('Cannot delete category with existing products', 400);
  }

  // Check if category has subcategories
  const subcategoryCount = await Category.countDocuments({ parentCategory: id });
  if (subcategoryCount > 0) {
    throw createError('Cannot delete category with subcategories', 400);
  }

  await Category.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Category deleted successfully'
  });
});

// Toggle category active status (Admin only)
export const toggleCategoryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw createError('Category not found', 404);
  }

  category.isActive = !category.isActive;
  await category.save();

  res.status(200).json({
    success: true,
    message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
    data: { category }
  });
});

// Get category statistics (Admin only)
export const getCategoryStats = asyncHandler(async (req: Request, res: Response) => {
  const stats = await Category.aggregate([
    {
      $lookup: {
        from: 'products',
        localField: 'slug',
        foreignField: 'category',
        as: 'products'
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        isActive: 1,
        productCount: { $size: '$products' },
        activeProductCount: {
          $size: {
            $filter: {
              input: '$products',
              cond: { $eq: ['$$this.isActive', true] }
            }
          }
        }
      }
    },
    {
      $sort: { productCount: -1 }
    }
  ]);

  const totalCategories = await Category.countDocuments();
  const activeCategories = await Category.countDocuments({ isActive: true });

  res.status(200).json({
    success: true,
    data: {
      totalCategories,
      activeCategories,
      categoryStats: stats
    }
  });
});

// Get main categories (no parent)
export const getMainCategories = asyncHandler(async (req: Request, res: Response) => {
  const categories = await Category.find({
    parentCategory: { $exists: false },
    isActive: true
  })
    .populate('subcategories')
    .sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    data: { categories }
  });
});

// Get subcategories of a category
export const getSubcategories = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const subcategories = await Category.find({
    parentCategory: id,
    isActive: true
  }).sort({ sortOrder: 1, name: 1 });

  res.status(200).json({
    success: true,
    data: { subcategories }
  });
});

export default {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  getCategoryStats,
  getMainCategories,
  getSubcategories
};