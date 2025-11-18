import * as controller from '../controllers/product.controller.js';
import express from 'express';

const router = express.Router();

router.get('/', controller.getAllProductsController);
router.get('/:productId', controller.getProductDetailController);
router.get('/:productId/reviews', controller.getProductReviewsController);

export default router;