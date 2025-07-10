import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  deactivateUser,
  activateUser,
  getUserStats
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';
import { validateParams, validateQuery, schemas } from '../middlewares/validate.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.use(authorize('admin'));

router.get('/', validateQuery(schemas.pagination), getAllUsers);
router.get('/stats', getUserStats);
router.get('/:id', validateParams(schemas.mongoId), getUserById);
router.put('/:id', validateParams(schemas.mongoId), updateUser);
router.delete('/:id', validateParams(schemas.mongoId), deleteUser);
router.patch('/:id/deactivate', validateParams(schemas.mongoId), deactivateUser);
router.patch('/:id/activate', validateParams(schemas.mongoId), activateUser);

export default router;