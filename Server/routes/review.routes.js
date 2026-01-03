import express from 'express';
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authenticate.js';
import {
  createReview,
  getProductReviews,
} from '../controllers/review.controller.js';
const router = express.Router();

router.route('/').post([authenticateUser], createReview);
router.route('/:id').get(getProductReviews);

export default router;
