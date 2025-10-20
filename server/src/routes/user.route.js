import express from "express";
import * as userController from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.get('/me', verifyToken, userController.getCurrentUserController)
router.put('/me', verifyToken,  userController.updateCurrentUserController)

export default router;