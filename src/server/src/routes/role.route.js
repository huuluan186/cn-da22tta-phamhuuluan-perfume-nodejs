import express from 'express';
import * as controller from '../controllers/enum.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { isAdmin } from '../middlewares/userAuthentication.js';

const router = express.Router();

// chỉ admin mới xem role
router.get('/', verifyToken, isAdmin, controller.getAllRolesController);

export default router;
