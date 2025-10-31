import express from "express";
import * as userController from '../controllers/user.controller.js'
import * as addressController from '../controllers/address.controller.js'
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.get('/me', verifyToken, userController.getCurrentUserController)
router.put('/me', verifyToken, userController.updateCurrentUserController)
router.put('/me/password', verifyToken, userController.changePasswordController)
router.post('/forgot-password', userController.forgotPasswordController); 
router.post('/reset-password', userController.resetPasswordController);
router.get('/me/addresses', verifyToken, addressController.getUserAddressesController)
router.post('/me/addresses', verifyToken, addressController.addUserAddressController);
router.put('/me/addresses/:addressId', verifyToken, addressController.updateUserAddressController);
router.delete('/me/addresses/:addressId', verifyToken, addressController.deleteUserAddressController);

export default router;