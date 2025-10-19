import express from "express";
import * as userController from '../controllers/user.controller.js'
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

router.get('/me', verifyToken, userController.getCurrentUserController)

export default router;