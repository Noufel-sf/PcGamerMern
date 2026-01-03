import express from 'express';
import {
  addToCart,
  clearCart,
  deleteProductFromCart,
  getCart,
  updateCartItems,
} from '../controllers/cart.controller.js';
import { authenticateUser } from '../middleware/authenticate.js';
const router = express.Router();

router
  .route('/')
  .post([authenticateUser], addToCart)
  .get([authenticateUser], getCart)
  .patch([authenticateUser], updateCartItems)
  .delete([authenticateUser], clearCart);

router.route('/deleteItem').delete([authenticateUser], deleteProductFromCart);

export default router;
