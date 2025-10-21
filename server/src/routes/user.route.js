import express from "express";
import * as userController from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.get('/me', verifyToken, userController.getCurrentUserController)
router.put('/me', verifyToken,  userController.updateCurrentUserController)
router.put('/me/password', verifyToken,  userController.changePasswordController)
router.post('/forgot-password', userController.forgotPasswordController); 
router.post('/reset-password', userController.resetPasswordController);

export default router;