import * as controller from '../controllers/product.controller.js';
import express from 'express';

const router = express.Router();

router.get('/', controller.getAllProductsController);

export default router;