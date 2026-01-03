import express from 'express';
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authenticate.js';
import {
  createOrder,
  getMyOrders,
  handleSuccess,
  adminGetAllOrders,
} from '../controllers/order.controller.js';
const router = express.Router();

router
  .route('/')
  .post([authenticateUser], createOrder)
  .get([authenticateUser], getMyOrders);
router.route('/success').get([authenticateUser], handleSuccess);

router
  .route('/all')
  .get([authenticateUser, authorizePermissions('ADMIN'), adminGetAllOrders]);

export default router;
