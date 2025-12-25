import express from "express";
import * as brandController from '../controllers/brand.controller.js';
import * as couponController from '../controllers/coupon.controller.js';
import * as contactController from '../controllers/contact.controller.js';
import * as orderController from '../controllers/order.controller.js';
import * as roleController from '../controllers/role.controller.js';
import * as userController from '../controllers/user.controller.js';
import * as prodController from '../controllers/product.controller.js';
import * as prodVController from '../controllers/product_variant.controller.js';
import * as prodImgController from '../controllers/product_image.controller.js';
import * as categoryController from '../controllers/category.controller.js';
import * as reviewController from '../controllers/review.controller.js'
import * as statisticController from '../controllers/statistic.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { isAdmin } from '../middlewares/userAuthentication.js';
import { uploadMultipleImages } from '../middlewares/upload.middleware.js'

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
router.get('/orders/:id', verifyToken, isAdmin, orderController.getOrderDetailController);
router.patch('/orders/:id/confirm', verifyToken, isAdmin, orderController.confirmOrderController);

// ROLE
router.get('/roles', verifyToken, isAdmin, roleController.getAllRolesController);
router.post('/roles', verifyToken, isAdmin, roleController.createRoleController);
router.put('/roles/:id', verifyToken, isAdmin, roleController.updateRoleController);
router.delete('/roles/:id', verifyToken, isAdmin, roleController.deleteRoleController);

//USER
router.get('/users', verifyToken, isAdmin, userController.getAllUsersController);
router.patch('/users/:id/roles', verifyToken, isAdmin, userController.updateUserRoleController)
router.delete('/users/:id', verifyToken, isAdmin, userController.softDeleteUserController)

// PRODUCT
router.get('/products', verifyToken, isAdmin, prodController.getAllProductsAdmin);
router.post('/products', verifyToken, isAdmin, prodController.createProduct);
router.put('/products/:id', verifyToken, isAdmin, prodController.updateProduct);
router.delete('/products/:id', verifyToken, isAdmin, prodController.deleteProduct);

// VARIANT
router.post('/products/:id/variants', prodVController.createVariant);
router.put('/variants/:id', prodVController.updateVariant);
router.delete('/variants/:id', prodVController.deleteVariant);

// IMAGE
router.post('/products/:id/images', uploadMultipleImages('products', 10), prodImgController.addProductImages);
router.delete('/products/images/:id', prodImgController.deleteProductImage);
router.patch('/products/:id/thumbnail',verifyToken,isAdmin,prodImgController.setThumbnail);

//REVIEW
router.get('/reviews', verifyToken, isAdmin, reviewController.getAllReviewsAdmin);
router.get('/reviews/:id', verifyToken, isAdmin, reviewController.getReviewDetailAdmin); 
router.delete('/reviews/:id', verifyToken, isAdmin, reviewController.deleteReviewAdmin);
router.patch('/reviews/:id', verifyToken, isAdmin, reviewController.toggleReviewApproval);

// REPORT - Thống kê doanh thu
router.get('/statistics/kpis', verifyToken, isAdmin, statisticController.getKPIs);
router.get('/statistics/revenue-trend', verifyToken, isAdmin, statisticController.getRevenueTrend);
router.get('/statistics/top-products', verifyToken, isAdmin, statisticController.getTopProducts);
router.get('/statistics/revenue-by-category', verifyToken, isAdmin, statisticController.getRevenueByCategory);
router.get('/statistics/revenue-by-brand', verifyToken, isAdmin, statisticController.getRevenueByBrand);
router.get('/statistics/revenue-by-payment', verifyToken, isAdmin, statisticController.getRevenueByPayment);
router.get('/statistics/top-customers', verifyToken, isAdmin, statisticController.getTopCustomers);

export default router;