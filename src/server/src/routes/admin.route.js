import express from "express";
import * as brandController from '../controllers/brand.controller.js';
import * as couponController from '../controllers/coupon.controller.js';
import * as contactController from '../controllers/contact.controller.js';
import * as orderController from '../controllers/order.controller.js';
import * as roleController from '../controllers/role.controller.js';
import * as userController from '../controllers/user.controller.js';
import * as categoryController from '../controllers/category.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { isAdmin } from '../middlewares/userAuthentication.js';

const router = express.Router();

// BRAND
router.get('/brands', verifyToken, isAdmin, brandController.getAllBrandsController);
router.post('/brands', verifyToken, isAdmin, brandController.createBrandController);
router.put('/brands/:id', verifyToken, isAdmin, brandController.updateBrandController);
router.delete('/brands/:id', verifyToken, isAdmin, brandController.deleteBrandController);

// CATEGORY
router.get('/categories', verifyToken, isAdmin, categoryController.getAllCategoriesAdminController);
router.post('/categories', verifyToken, isAdmin, categoryController.createCategoryController);
router.put('/categories/:id', verifyToken, isAdmin, categoryController.updateCategoryController);
router.delete('/categories/:id', verifyToken, isAdmin, categoryController.deleteCategoryController);
router.get('/categories/:id', verifyToken, isAdmin, categoryController.getCategoryByIdController);

// COUPON 
router.get('/coupons', verifyToken, isAdmin, couponController.getAllCouponsController);
router.post('/coupons', verifyToken, isAdmin, couponController.createCouponController);
router.post('/coupons/:couponId', verifyToken, isAdmin, couponController.assignCouponManualController);
router.delete('/coupons/:couponId', verifyToken, isAdmin, couponController.deleteCouponController);

// CONTACT
router.get('/contacts', verifyToken, isAdmin, contactController.getAllContactsController);
router.patch('/contacts/:id/status', verifyToken, isAdmin, contactController.updateContactStatusController)

// ORDER
router.get('/orders', verifyToken, isAdmin, orderController.getAllOrdersController);

// ROLE
router.get('/roles', verifyToken, isAdmin, roleController.getAllRolesController);
router.post('/roles', verifyToken, isAdmin, roleController.createRoleController);
router.put('/roles/:id', verifyToken, isAdmin, roleController.updateRoleController);
router.delete('/roles/:id', verifyToken, isAdmin, roleController.deleteRoleController);

//USER
router.get('/users', verifyToken, isAdmin, userController.getAllUsersController);
router.patch('/users/:id/roles', verifyToken, isAdmin, userController.updateUserRoleController)
router.delete('/users/:id', verifyToken, isAdmin, userController.softDeleteUserController)

export default router;