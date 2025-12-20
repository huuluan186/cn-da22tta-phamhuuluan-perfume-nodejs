import express from "express";
import * as controller from '../controllers/brand.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { isAdmin } from '../middlewares/userAuthentication.js';

const router = express.Router();

router.get('/', controller.getPublicBrandsController);
router.get('/:id', controller.getBrandByIdController);


export default router;