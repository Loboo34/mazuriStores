import { Router } from 'express';
import {
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
} from '../controllers/category.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validate, validateParams, schemas } from '../middlewares/validate.middleware';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/main', getMainCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', validateParams(schemas.mongoId), getCategoryById);
router.get('/:id/subcategories', validateParams(schemas.mongoId), getSubcategories);

// Protected routes (Admin only)
router.use(authenticate);
router.use(authorize('admin'));

router.post('/', validate(schemas.createCategory), createCategory);
router.put('/:id', validateParams(schemas.mongoId), updateCategory);
router.delete('/:id', validateParams(schemas.mongoId), deleteCategory);
router.patch('/:id/toggle-status', validateParams(schemas.mongoId), toggleCategoryStatus);
router.get('/admin/stats', getCategoryStats);

export default router;