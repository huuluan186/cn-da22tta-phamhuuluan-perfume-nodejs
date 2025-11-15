import * as controller from '../controllers/favorite.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import express from 'express';

const router = express.Router();

router.get('/me', verifyToken, controller.getFavoritesByUserController);
router.post('/me/:productId', verifyToken, controller.addFavoriteController);
router.delete('/me/:productId', verifyToken, controller.removeFavoriteController);

// Admin
//router.get('/', verifyToken, isAdmin, controller.getAllFavoritesController);

export default router;