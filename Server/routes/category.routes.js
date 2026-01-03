import express from 'express';
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authenticate.js';
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getSingleCategory,
  updateCategory,
} from '../controllers/category.controller.js';
const router = express.Router();

router
  .route('/')
  .post([authenticateUser, authorizePermissions('ADMIN'), createCategory])
  .get(getAllCategories);

router
  .route('/:id')
  .get(getSingleCategory)
  .patch([authenticateUser, authorizePermissions('ADMIN'), updateCategory])
  .delete([authenticateUser, authorizePermissions('ADMIN'), deleteCategory]);

export default router;
