import express from "express";
import * as userController from '../controllers/user.controller.js'
import * as addressController from '../controllers/address.controller.js'
import * as favorController from '../controllers/favorite.controller.js'
import * as cartController from '../controllers/cart.controller.js'
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

//user
router.get('/me', verifyToken, userController.getCurrentUserController)
router.put('/me', verifyToken, userController.updateCurrentUserController)
router.put('/me/password', verifyToken, userController.changePasswordController)
router.post('/forgot-password', userController.forgotPasswordController); 
router.post('/reset-password', userController.resetPasswordController);

//Addresses (user)
router.get('/me/addresses', verifyToken, addressController.getUserAddressesController)
router.post('/me/addresses', verifyToken, addressController.addUserAddressController);
router.put('/me/addresses/:addressId', verifyToken, addressController.updateUserAddressController);
router.delete('/me/addresses/:addressId', verifyToken, addressController.deleteUserAddressController);

// Favorites (user)
router.get("/me/favorites", verifyToken, favorController.getMyFavoritesController);
router.post("/me/favorites/:productId", verifyToken, favorController.addMyFavoriteController);
router.delete("/me/favorites/:productId", verifyToken, favorController.removeMyFavoriteController);

//cart
router.get('/me/cart', verifyToken, cartController.getMyCartController);
router.post('/me/cart', verifyToken, cartController.addToCartController);
router.put('/me/cart/:cartItemId', verifyToken, cartController.updateCartItemController);
router.delete('/me/cart/:cartItemId', verifyToken, cartController.deleteACartItemController);
router.delete('/me/cart', verifyToken, cartController.clearCartController);

export default router;