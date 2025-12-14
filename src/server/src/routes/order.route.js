import * as controller from '../controllers/order.controller.js';
import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { isAdmin } from '../middlewares/userAuthentication.js';

const router = express.Router();

router.get('/', verifyToken, isAdmin, controller.getAllOrdersController);

export default router;