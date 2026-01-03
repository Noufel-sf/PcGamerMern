import express from 'express';
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authenticate.js';
import {
  showCurrentUser,
  updateUserInfo,
  updateUserPassword,
  adminGetAllUsers,
  adminUpdateUserInfo,
  adminUpdateUserPassword,
} from '../controllers/user.controller.js';
const router = express.Router();

router
  .route('/')
  .get([authenticateUser, authorizePermissions('ADMIN'), adminGetAllUsers]);

router.route('/showMe').get([authenticateUser], showCurrentUser);

router.route('/updateInfo').patch([authenticateUser], updateUserInfo);
router.route('/updatePassword').patch([authenticateUser], updateUserPassword);

router
  .route('/:id/updateInfo')
  .patch(
    [authenticateUser, authorizePermissions('ADMIN')],
    adminUpdateUserInfo
  );

router
  .route('/:id/updatePassword')
  .patch(
    [authenticateUser, authorizePermissions('ADMIN')],
    adminUpdateUserPassword
  );

export default router;
