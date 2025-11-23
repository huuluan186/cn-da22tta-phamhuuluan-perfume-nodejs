import * as controller from '../controllers/product.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { uploadMultipleImages } from '../middlewares/upload.middleware.js'
import express from 'express';

const router = express.Router();

router.get('/', controller.getAllProductsController);
router.get('/:productId', controller.getProductDetailController);
router.get('/:productId/reviews', controller.getProductReviewsController);
router.post(
    '/:productId/reviews', 
    verifyToken,
    uploadMultipleImages('review', 5), // max 5 ảnh, lưu trong /uploads/review
    controller.addProductReviewsController
);

export default router;