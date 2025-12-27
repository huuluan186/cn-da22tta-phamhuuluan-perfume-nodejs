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

// ==================== BRANDS ====================
/**
 * @swagger
 * /admin/brands:
 *   get:
 *     tags: ['[ADMIN] Brands']
 *     summary: "[ADMIN] Lấy tất cả thương hiệu"
 *     description: Lấy danh sách tất cả thương hiệu (bao gồm đã xóa mềm). Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thương hiệu thành công
 *       401:
 *         description: Chưa đăng nhập
 *       403:
 *         description: Không có quyền admin
 */
router.get('/brands', verifyToken, isAdmin, brandController.getAllBrandsController);

/**
 * @swagger
 * /admin/brands:
 *   post:
 *     tags: ['[ADMIN] Brands']
 *     summary: "[ADMIN] Tạo thương hiệu mới"
 *     description: Tạo một thương hiệu mới. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - country
 *               - logoUrl
 *             properties:
 *               name:
 *                 type: string
 *                 example: Dior
 *               country:
 *                 type: string
 *                 example: France
 *               logoUrl:
 *                 type: string
 *                 example: /uploads/brands/dior-logo.png
 *               posterUrl:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Tạo thương hiệu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/brands', verifyToken, isAdmin, brandController.createBrandController);

/**
 * @swagger
 * /admin/brands/{id}:
 *   put:
 *     tags: ['[ADMIN] Brands']
 *     summary: "[ADMIN] Cập nhật thương hiệu"
 *     description: Cập nhật thông tin thương hiệu. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               country:
 *                 type: string
 *               logoUrl:
 *                 type: string
 *               posterUrl:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy thương hiệu
 */
router.put('/brands/:id', verifyToken, isAdmin, brandController.updateBrandController);

/**
 * @swagger
 * /admin/brands/{id}:
 *   delete:
 *     tags: ['[ADMIN] Brands']
 *     summary: "[ADMIN] Xóa thương hiệu"
 *     description: Xóa mềm thương hiệu. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy thương hiệu
 */
router.delete('/brands/:id', verifyToken, isAdmin, brandController.deleteBrandController);

// ==================== CATEGORIES ====================
/**
 * @swagger
 * /admin/categories:
 *   get:
 *     tags: ['[ADMIN] Categories']
 *     summary: "[ADMIN] Lấy tất cả danh mục"
 *     description: Lấy danh sách tất cả danh mục (bao gồm đã xóa mềm). Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách danh mục thành công
 */
router.get('/categories', verifyToken, isAdmin, categoryController.getAllCategoriesAdminController);

/**
 * @swagger
 * /admin/categories:
 *   post:
 *     tags: ['[ADMIN] Categories']
 *     summary: "[ADMIN] Tạo danh mục mới"
 *     description: Tạo danh mục mới (có thể là danh mục con với parentId). Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nước hoa nam
 *               parentId:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               sortOrder:
 *                 type: integer
 *                 example: 0
 *     responses:
 *       201:
 *         description: Tạo danh mục thành công
 */
router.post('/categories', verifyToken, isAdmin, categoryController.createCategoryController);

/**
 * @swagger
 * /admin/categories/{id}:
 *   put:
 *     tags: ['[ADMIN] Categories']
 *     summary: "[ADMIN] Cập nhật danh mục"
 *     description: Cập nhật thông tin danh mục. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parentId:
 *                 type: string
 *                 nullable: true
 *               sortOrder:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.put('/categories/:id', verifyToken, isAdmin, categoryController.updateCategoryController);

/**
 * @swagger
 * /admin/categories/{id}:
 *   delete:
 *     tags: ['[ADMIN] Categories']
 *     summary: "[ADMIN] Xóa danh mục"
 *     description: Xóa mềm danh mục. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.delete('/categories/:id', verifyToken, isAdmin, categoryController.deleteCategoryController);

/**
 * @swagger
 * /admin/categories/{id}:
 *   get:
 *     tags: ['[ADMIN] Categories']
 *     summary: "[ADMIN] Lấy chi tiết danh mục"
 *     description: Lấy thông tin chi tiết danh mục theo ID. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 */
router.get('/categories/:id', verifyToken, isAdmin, categoryController.getCategoryByIdController);

// ==================== COUPONS ====================
/**
 * @swagger
 * /admin/coupons:
 *   get:
 *     tags: ['[ADMIN] Coupons']
 *     summary: "[ADMIN] Lấy tất cả coupon"
 *     description: Lấy danh sách tất cả coupon trong hệ thống. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách coupon thành công
 */
router.get('/coupons', verifyToken, isAdmin, couponController.getAllCouponsController);

/**
 * @swagger
 * /admin/coupons:
 *   post:
 *     tags: ['[ADMIN] Coupons']
 *     summary: "[ADMIN] Tạo coupon mới"
 *     description: Tạo một mã giảm giá mới. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *             properties:
 *               code:
 *                 type: string
 *                 example: SUMMER2024
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: percentage
 *               discountValue:
 *                 type: number
 *                 example: 20
 *     responses:
 *       201:
 *         description: Tạo coupon thành công
 */
router.post('/coupons', verifyToken, isAdmin, couponController.createCouponController);

/**
 * @swagger
 * /admin/coupons/{couponId}:
 *   post:
 *     tags: ['[ADMIN] Coupons']
 *     summary: "[ADMIN] Gán coupon cho user"
 *     description: Gán coupon thủ công cho một hoặc nhiều user. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userIds
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1", "user2"]
 *               validFrom:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *               validUntil:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Gán coupon thành công
 */
router.post('/coupons/:couponId', verifyToken, isAdmin, couponController.assignCouponManualController);

/**
 * @swagger
 * /admin/coupons/{couponId}:
 *   delete:
 *     tags: ['[ADMIN] Coupons']
 *     summary: "[ADMIN] Xóa coupon"
 *     description: Xóa mềm coupon. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: couponId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa coupon thành công
 */
router.delete('/coupons/:couponId', verifyToken, isAdmin, couponController.deleteCouponController);

// ==================== CONTACTS ====================
/**
 * @swagger
 * /admin/contacts:
 *   get:
 *     tags: ['[ADMIN] Contacts']
 *     summary: "[ADMIN] Lấy tất cả liên hệ"
 *     description: Lấy danh sách tất cả form liên hệ từ khách hàng. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách liên hệ thành công
 */
router.get('/contacts', verifyToken, isAdmin, contactController.getAllContactsController);

/**
 * @swagger
 * /admin/contacts/{id}/status:
 *   patch:
 *     tags: ['[ADMIN] Contacts']
 *     summary: "[ADMIN] Cập nhật trạng thái liên hệ"
 *     description: Cập nhật trạng thái xử lý của form liên hệ. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, replied, ignored]
 *                 example: replied
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */
router.patch('/contacts/:id/status', verifyToken, isAdmin, contactController.updateContactStatusController)

// ==================== ORDERS ====================
/**
 * @swagger
 * /admin/orders:
 *   get:
 *     tags: ['[ADMIN] Orders']
 *     summary: "[ADMIN] Lấy tất cả đơn hàng"
 *     description: Lấy danh sách tất cả đơn hàng với filter và phân trang. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: hasPagination
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: orderStatus
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Processing, Shipped, Completed, Cancelled]
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Paid, Failed, Refunded]
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 */
router.get('/orders', verifyToken, isAdmin, orderController.getAllOrdersController);

/**
 * @swagger
 * /admin/orders/{id}:
 *   get:
 *     tags: ['[ADMIN] Orders']
 *     summary: "[ADMIN] Lấy chi tiết đơn hàng"
 *     description: Lấy chi tiết một đơn hàng theo ID. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy chi tiết đơn hàng thành công
 *       404:
 *         description: Không tìm thấy đơn hàng
 */
router.get('/orders/:id', verifyToken, isAdmin, orderController.getOrderDetailController);

/**
 * @swagger
 * /admin/orders/{id}/confirm:
 *   patch:
 *     tags: ['[ADMIN] Orders']
 *     summary: "[ADMIN] Xác nhận đơn hàng"
 *     description: Admin xác nhận đơn hàng (chuyển từ Pending/Processing sang Confirmed). Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xác nhận đơn hàng thành công
 *       400:
 *         description: Đơn hàng không ở trạng thái hợp lệ để xác nhận
 */
router.patch('/orders/:id/confirm', verifyToken, isAdmin, orderController.confirmOrderController);

// ==================== ROLES ====================
/**
 * @swagger
 * /admin/roles:
 *   get:
 *     tags: ['[ADMIN] Roles']
 *     summary: "[ADMIN] Lấy tất cả vai trò"
 *     description: Lấy danh sách tất cả vai trò trong hệ thống. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách vai trò thành công
 */
router.get('/roles', verifyToken, isAdmin, roleController.getAllRolesController);

/**
 * @swagger
 * /admin/roles:
 *   post:
 *     tags: ['[ADMIN] Roles']
 *     summary: "[ADMIN] Tạo vai trò mới"
 *     description: Tạo một vai trò mới trong hệ thống. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: editor
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: Content editor role
 *     responses:
 *       201:
 *         description: Tạo vai trò thành công
 */
router.post('/roles', verifyToken, isAdmin, roleController.createRoleController);

/**
 * @swagger
 * /admin/roles/{id}:
 *   put:
 *     tags: ['[ADMIN] Roles']
 *     summary: "[ADMIN] Cập nhật vai trò"
 *     description: Cập nhật thông tin vai trò. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật vai trò thành công
 */
router.put('/roles/:id', verifyToken, isAdmin, roleController.updateRoleController);

/**
 * @swagger
 * /admin/roles/{id}:
 *   delete:
 *     tags: ['[ADMIN] Roles']
 *     summary: "[ADMIN] Xóa vai trò"
 *     description: Xóa vai trò khỏi hệ thống. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa vai trò thành công
 */
router.delete('/roles/:id', verifyToken, isAdmin, roleController.deleteRoleController);

// ==================== USERS ====================
/**
 * @swagger
 * /admin/users:
 *   get:
 *     tags: ['[ADMIN] Users']
 *     summary: "[ADMIN] Lấy tất cả người dùng"
 *     description: Lấy danh sách tất cả người dùng (bao gồm đã xóa mềm). Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công
 */
router.get('/users', verifyToken, isAdmin, userController.getAllUsersController);

/**
 * @swagger
 * /admin/users/{id}/roles:
 *   patch:
 *     tags: ['[ADMIN] Users']
 *     summary: "[ADMIN] Cập nhật vai trò của user"
 *     description: Gán vai trò mới cho user (thay thế vai trò cũ). Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleIds
 *             properties:
 *               roleIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["role1", "role2"]
 *     responses:
 *       200:
 *         description: Cập nhật vai trò thành công
 */
router.patch('/users/:id/roles', verifyToken, isAdmin, userController.updateUserRoleController)

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     tags: ['[ADMIN] Users']
 *     summary: "[ADMIN] Xóa người dùng"
 *     description: Xóa mềm người dùng. Không thể xóa admin. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *       400:
 *         description: Không thể xóa admin
 */
router.delete('/users/:id', verifyToken, isAdmin, userController.softDeleteUserController)

// ==================== PRODUCTS ====================
/**
 * @swagger
 * /admin/products:
 *   get:
 *     tags: ['[ADMIN] Products']
 *     summary: "[ADMIN] Lấy tất cả sản phẩm"
 *     description: Lấy danh sách tất cả sản phẩm với phân trang. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: hasPagination
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
 */
router.get('/products', verifyToken, isAdmin, prodController.getAllProductsAdmin);

/**
 * @swagger
 * /admin/products:
 *   post:
 *     tags: ['[ADMIN] Products']
 *     summary: "[ADMIN] Tạo sản phẩm mới"
 *     description: Tạo sản phẩm mới. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - gender
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sauvage Eau de Toilette
 *               brandId:
 *                 type: string
 *                 nullable: true
 *               gender:
 *                 type: string
 *                 enum: [nam, nữ, unisex]
 *                 example: nam
 *               origin:
 *                 type: string
 *                 nullable: true
 *               releaseYear:
 *                 type: integer
 *                 nullable: true
 *               fragranceGroup:
 *                 type: string
 *                 nullable: true
 *               style:
 *                 type: string
 *                 nullable: true
 *               scentNotes:
 *                 type: string
 *                 nullable: true
 *               description:
 *                 type: string
 *                 nullable: true
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["cat1", "cat2"]
 *     responses:
 *       201:
 *         description: Tạo sản phẩm thành công
 */
router.post('/products', verifyToken, isAdmin, prodController.createProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   put:
 *     tags: ['[ADMIN] Products']
 *     summary: "[ADMIN] Cập nhật sản phẩm"
 *     description: Cập nhật thông tin sản phẩm. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               brandId:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [nam, nữ, unisex]
 *               origin:
 *                 type: string
 *               releaseYear:
 *                 type: integer
 *               fragranceGroup:
 *                 type: string
 *               style:
 *                 type: string
 *               scentNotes:
 *                 type: string
 *               description:
 *                 type: string
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Cập nhật sản phẩm thành công
 */
router.put('/products/:id', verifyToken, isAdmin, prodController.updateProduct);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     tags: ['[ADMIN] Products']
 *     summary: "[ADMIN] Xóa sản phẩm"
 *     description: Xóa mềm sản phẩm. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa sản phẩm thành công
 */
router.delete('/products/:id', verifyToken, isAdmin, prodController.deleteProduct);

// ==================== VARIANTS ====================
/**
 * @swagger
 * /admin/products/{id}/variants:
 *   post:
 *     tags: ['[ADMIN] Product Variants']
 *     summary: "[ADMIN] Tạo biến thể sản phẩm"
 *     description: Thêm biến thể (dung tích/giá/kho) cho sản phẩm. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - volume
 *               - price
 *               - originalPrice
 *             properties:
 *               sku:
 *                 type: string
 *                 nullable: true
 *                 example: DIOR-SAU-100ML
 *               volume:
 *                 type: integer
 *                 example: 100
 *               price:
 *                 type: number
 *                 example: 2500000
 *               originalPrice:
 *                 type: number
 *                 example: 3000000
 *               discountPercent:
 *                 type: number
 *                 nullable: true
 *                 example: 16.67
 *               stockQuantity:
 *                 type: integer
 *                 example: 50
 *               weight:
 *                 type: number
 *                 nullable: true
 *               isDefault:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Tạo biến thể thành công
 */
router.post('/products/:id/variants', prodVController.createVariant);

/**
 * @swagger
 * /admin/variants/{id}:
 *   put:
 *     tags: ['[ADMIN] Product Variants']
 *     summary: "[ADMIN] Cập nhật biến thể sản phẩm"
 *     description: Cập nhật thông tin biến thể. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sku:
 *                 type: string
 *               volume:
 *                 type: integer
 *               price:
 *                 type: number
 *               originalPrice:
 *                 type: number
 *               discountPercent:
 *                 type: number
 *               stockQuantity:
 *                 type: integer
 *               weight:
 *                 type: number
 *               isDefault:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cập nhật biến thể thành công
 */
router.put('/variants/:id', prodVController.updateVariant);

/**
 * @swagger
 * /admin/variants/{id}:
 *   delete:
 *     tags: ['[ADMIN] Product Variants']
 *     summary: "[ADMIN] Xóa biến thể sản phẩm"
 *     description: Xóa mềm biến thể sản phẩm. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa biến thể thành công
 */
router.delete('/variants/:id', prodVController.deleteVariant);

// ==================== PRODUCT IMAGES ====================
/**
 * @swagger
 * /admin/products/{id}/images:
 *   post:
 *     tags: ['[ADMIN] Product Images']
 *     summary: "[ADMIN] Upload hình ảnh sản phẩm"
 *     description: Upload nhiều hình ảnh cho sản phẩm (tối đa 10 ảnh). Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 10
 *     responses:
 *       201:
 *         description: Upload hình ảnh thành công
 */
router.post('/products/:id/images', uploadMultipleImages('products', 10), prodImgController.addProductImages);

/**
 * @swagger
 * /admin/products/images/{id}:
 *   delete:
 *     tags: ['[ADMIN] Product Images']
 *     summary: "[ADMIN] Xóa hình ảnh sản phẩm"
 *     description: Xóa một hình ảnh của sản phẩm. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa hình ảnh thành công
 */
router.delete('/products/images/:id', prodImgController.deleteProductImage);

/**
 * @swagger
 * /admin/products/{id}/thumbnail:
 *   patch:
 *     tags: ['[ADMIN] Product Images']
 *     summary: "[ADMIN] Đặt thumbnail sản phẩm"
 *     description: Đặt một hình ảnh làm thumbnail chính cho sản phẩm. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - imageId
 *             properties:
 *               imageId:
 *                 type: string
 *                 example: img_123
 *     responses:
 *       200:
 *         description: Đặt thumbnail thành công
 */
router.patch('/products/:id/thumbnail',verifyToken,isAdmin,prodImgController.setThumbnail);

// ==================== REVIEWS ====================
/**
 * @swagger
 * /admin/reviews:
 *   get:
 *     tags: ['[ADMIN] Reviews']
 *     summary: "[ADMIN] Lấy tất cả đánh giá"
 *     description: Lấy danh sách tất cả đánh giá (kể cả chưa duyệt). Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách đánh giá thành công
 */
router.get('/reviews', verifyToken, isAdmin, reviewController.getAllReviewsAdmin);

/**
 * @swagger
 * /admin/reviews/{id}:
 *   get:
 *     tags: ['[ADMIN] Reviews']
 *     summary: "[ADMIN] Lấy chi tiết đánh giá"
 *     description: Lấy chi tiết một đánh giá theo ID. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy chi tiết đánh giá thành công
 */
router.get('/reviews/:id', verifyToken, isAdmin, reviewController.getReviewDetailAdmin); 

/**
 * @swagger
 * /admin/reviews/{id}:
 *   delete:
 *     tags: ['[ADMIN] Reviews']
 *     summary: "[ADMIN] Xóa đánh giá"
 *     description: Xóa mềm đánh giá. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa đánh giá thành công
 */
router.delete('/reviews/:id', verifyToken, isAdmin, reviewController.deleteReviewAdmin);

/**
 * @swagger
 * /admin/reviews/{id}:
 *   patch:
 *     tags: ['[ADMIN] Reviews']
 *     summary: "[ADMIN] Duyệt/Bỏ duyệt đánh giá"
 *     description: Toggle trạng thái approved của đánh giá. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */
router.patch('/reviews/:id', verifyToken, isAdmin, reviewController.toggleReviewApproval);

// ==================== STATISTICS ====================
/**
 * @swagger
 * /admin/statistics/kpis:
 *   get:
 *     tags: ['[ADMIN] Statistics']
 *     summary: "[ADMIN] Lấy KPIs tổng quan"
 *     description: Lấy các chỉ số kinh doanh chính (tổng doanh thu, tổng đơn hàng, v.v.). Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy KPIs thành công
 */
router.get('/statistics/kpis', verifyToken, isAdmin, statisticController.getKPIs);

/**
 * @swagger
 * /admin/statistics/revenue-trend:
 *   get:
 *     tags: ['[ADMIN] Statistics']
 *     summary: "[ADMIN] Lấy xu hướng doanh thu"
 *     description: Lấy biểu đồ doanh thu theo thời gian. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lấy xu hướng doanh thu thành công
 */
router.get('/statistics/revenue-trend', verifyToken, isAdmin, statisticController.getRevenueTrend);

/**
 * @swagger
 * /admin/statistics/top-products:
 *   get:
 *     tags: ['[ADMIN] Statistics']
 *     summary: "[ADMIN] Lấy top sản phẩm bán chạy"
 *     description: Lấy danh sách sản phẩm bán chạy nhất. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lấy top sản phẩm thành công
 */
router.get('/statistics/top-products', verifyToken, isAdmin, statisticController.getTopProducts);

/**
 * @swagger
 * /admin/statistics/revenue-by-category:
 *   get:
 *     tags: ['[ADMIN] Statistics']
 *     summary: "[ADMIN] Doanh thu theo danh mục"
 *     description: Lấy biểu đồ doanh thu phân bổ theo danh mục. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy doanh thu theo danh mục thành công
 */
router.get('/statistics/revenue-by-category', verifyToken, isAdmin, statisticController.getRevenueByCategory);

/**
 * @swagger
 * /admin/statistics/revenue-by-brand:
 *   get:
 *     tags: ['[ADMIN] Statistics']
 *     summary: "[ADMIN] Doanh thu theo thương hiệu"
 *     description: Lấy biểu đồ doanh thu phân bổ theo thương hiệu. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy doanh thu theo thương hiệu thành công
 */
router.get('/statistics/revenue-by-brand', verifyToken, isAdmin, statisticController.getRevenueByBrand);

/**
 * @swagger
 * /admin/statistics/revenue-by-payment:
 *   get:
 *     tags: ['[ADMIN] Statistics']
 *     summary: "[ADMIN] Doanh thu theo phương thức thanh toán"
 *     description: Lấy biểu đồ doanh thu phân bổ theo phương thức thanh toán. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy doanh thu theo phương thức thanh toán thành công
 */
router.get('/statistics/revenue-by-payment', verifyToken, isAdmin, statisticController.getRevenueByPayment);

/**
 * @swagger
 * /admin/statistics/top-customers:
 *   get:
 *     tags: ['[ADMIN] Statistics']
 *     summary:  Top khách hàng
 *     description: Lấy danh sách khách hàng chi tiêu nhiều nhất. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *     responses:
 *       200:
 *         description: Lấy top khách hàng thành công
 */
router.get('/statistics/top-customers', verifyToken, isAdmin, statisticController.getTopCustomers);

// ==================== CONTACTS ====================
/**
 * @swagger
 * /admin/contacts:
 *   get:
 *     tags: [Admin - Contacts]
 *     summary: "[ADMIN] Lấy tất cả liên hệ"
 *     description: Lấy danh sách tất cả form liên hệ từ khách hàng với filter và phân trang. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [new, replied, ignored]
 *         description: Lọc theo trạng thái
 *     responses:
 *       200:
 *         description: Lấy danh sách liên hệ thành công
 */
router.get('/contacts', verifyToken, isAdmin, contactController.getAllContactsController);

/**
 * @swagger
 * /admin/contacts/{id}:
 *   get:
 *     tags: [Admin - Contacts]
 *     summary: "[ADMIN] Lấy chi tiết liên hệ"
 *     description: Lấy thông tin chi tiết một form liên hệ. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lấy chi tiết liên hệ thành công
 *       404:
 *         description: Không tìm thấy liên hệ
 */
router.get('/contacts/:id', verifyToken, isAdmin, contactController.getContactDetailController);

/**
 * @swagger
 * /admin/contacts/{id}/status:
 *   patch:
 *     tags: [Admin - Contacts]
 *     summary: "[ADMIN] Cập nhật trạng thái liên hệ"
 *     description: Cập nhật trạng thái xử lý của form liên hệ. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [new, replied, ignored]
 *                 example: replied
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái thành công
 */
router.patch('/contacts/:id/status', verifyToken, isAdmin, contactController.updateContactStatusController);

/**
 * @swagger
 * /admin/contacts/{id}:
 *   delete:
 *     tags: [Admin - Contacts]
 *     summary: "[ADMIN] Xóa liên hệ"
 *     description: Xóa mềm form liên hệ. Chỉ admin.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa liên hệ thành công
 */
router.delete('/contacts/:id', verifyToken, isAdmin, contactController.deleteContactController);

export default router;