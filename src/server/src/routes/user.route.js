import express from "express";
import * as userController from '../controllers/user.controller.js'
import * as addressController from '../controllers/address.controller.js'
import * as favorController from '../controllers/favorite.controller.js'
import * as cartController from '../controllers/cart.controller.js'
import * as orderController from '../controllers/order.controller.js'
import * as couponController from '../controllers/coupon.controller.js'
import { verifyToken } from '../middlewares/verifyToken.middleware.js';

const router = express.Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     tags: [Users]
 *     summary: Lấy thông tin người dùng hiện tại
 *     description: Lấy thông tin chi tiết của người dùng đã đăng nhập. Yêu cầu cookie xác thực.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Get user info successfully
 *                 user:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         roles:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 example: customer
 *                         isSocialAccount:
 *                           type: boolean
 *                           example: false
 *       401:
 *         description: Không có quyền truy cập (chưa đăng nhập)
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get('/me', verifyToken, userController.getCurrentUserController)

/**
 * @swagger
 * /users/me:
 *   put:
 *     tags: [Users]
 *     summary: Cập nhật thông tin người dùng hiện tại
 *     description: Cập nhật thông tin cá nhân của người dùng đã đăng nhập.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: Nguyễn
 *               lastname:
 *                 type: string
 *                 example: Văn A
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-01-01"
 *                 nullable: true
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *                 example: male
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: User info updated successfully
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.put('/me', verifyToken, userController.updateCurrentUserController)

/**
 * @swagger
 * /users/me/password:
 *   put:
 *     tags: [Users]
 *     summary: Đổi mật khẩu
 *     description: Đổi mật khẩu cho người dùng đã đăng nhập. Yêu cầu nhập mật khẩu cũ và mật khẩu mới.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *                 example: oldpassword123
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Password changed successfully!
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Mật khẩu cũ không đúng
 */
router.put('/me/password', verifyToken, userController.changePasswordController)

/**
 * @swagger
 * /users/forgot-password:
 *   post:
 *     tags: [Users]
 *     summary: Quên mật khẩu
 *     description: Gửi email với link đặt lại mật khẩu. Luôn trả về thành công để tránh enumerate user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Yêu cầu đã được xử lý
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Link đặt lại mật khẩu đã được gửi đến email của bạn!
 */
router.post('/forgot-password', userController.forgotPasswordController); 

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     tags: [Users]
 *     summary: Đặt lại mật khẩu
 *     description: Đặt lại mật khẩu sử dụng token nhận được từ email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 description: JWT token từ email reset password
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               newPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Password reset successfully!
 *       400:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
router.post('/reset-password', userController.resetPasswordController);

/**
 * @swagger
 * /users/me/addresses:
 *   get:
 *     tags: [Addresses]
 *     summary: Lấy danh sách địa chỉ của người dùng
 *     description: Lấy tất cả địa chỉ giao hàng đã lưu của người dùng hiện tại.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách địa chỉ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Get user addresses successfully!
 *                 response:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Address'
 *                     count:
 *                       type: integer
 *                       example: 3
 */
router.get('/me/addresses', verifyToken, addressController.getUserAddressesController)

/**
 * @swagger
 * /users/me/addresses:
 *   post:
 *     tags: [Addresses]
 *     summary: Thêm địa chỉ giao hàng mới
 *     description: Tạo địa chỉ giao hàng mới cho người dùng hiện tại. Nếu đặt isDefault=true thì các địa chỉ khác sẽ chuyển thành không mặc định.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverName
 *               - phone
 *               - label
 *             properties:
 *               receiverName:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               phone:
 *                 type: string
 *                 example: "0901234567"
 *               addressLine:
 *                 type: string
 *                 example: 123 Đường ABC
 *                 nullable: true
 *               wardId:
 *                 type: integer
 *                 example: 1
 *                 nullable: true
 *               label:
 *                 type: string
 *                 example: Nhà riêng
 *               zipCode:
 *                 type: string
 *                 example: "700000"
 *                 nullable: true
 *               isDefault:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Thêm địa chỉ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Address added successfully
 *                 response:
 *                   $ref: '#/components/schemas/Address'
 */
router.post('/me/addresses', verifyToken, addressController.addUserAddressController);

/**
 * @swagger
 * /users/me/addresses/{addressId}:
 *   put:
 *     tags: [Addresses]
 *     summary: Cập nhật địa chỉ giao hàng
 *     description: Cập nhật thông tin địa chỉ giao hàng đã lưu.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa chỉ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               receiverName:
 *                 type: string
 *                 example: Nguyễn Văn B
 *               phone:
 *                 type: string
 *                 example: "0909876543"
 *               addressLine:
 *                 type: string
 *                 example: 456 Đường XYZ
 *               wardId:
 *                 type: integer
 *                 example: 2
 *               label:
 *                 type: string
 *                 example: Văn phòng
 *               zipCode:
 *                 type: string
 *                 example: "700000"
 *               isDefault:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Cập nhật địa chỉ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Address updated successfully
 *       404:
 *         description: Không tìm thấy địa chỉ hoặc địa chỉ không thuộc về user
 */
router.put('/me/addresses/:addressId', verifyToken, addressController.updateUserAddressController);

/**
 * @swagger
 * /users/me/addresses/{addressId}:
 *   delete:
 *     tags: [Addresses]
 *     summary: Xóa địa chỉ giao hàng
 *     description: Xóa địa chỉ giao hàng đã lưu. Không thể xóa địa chỉ mặc định.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của địa chỉ
 *     responses:
 *       200:
 *         description: Xóa địa chỉ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Address deleted successfully
 *       400:
 *         description: Không thể xóa địa chỉ mặc định
 *       404:
 *         description: Không tìm thấy địa chỉ
 */
router.delete('/me/addresses/:addressId', verifyToken, addressController.deleteUserAddressController);

/**
 * @swagger
 * /users/me/favorites:
 *   get:
 *     tags: [Favorites]
 *     summary: Lấy danh sách sản phẩm yêu thích
 *     description: Lấy tất cả sản phẩm yêu thích của người dùng hiện tại.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Get favorites successfully
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Favorite'
 */
router.get("/me/favorites", verifyToken, favorController.getMyFavoritesController);

/**
 * @swagger
 * /users/me/favorites/{productId}:
 *   post:
 *     tags: [Favorites]
 *     summary: Thêm sản phẩm vào danh sách yêu thích
 *     description: Đánh dấu một sản phẩm là yêu thích.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Thêm vào yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Added to favorites
 *       400:
 *         description: Sản phẩm đã có trong danh sách yêu thích
 */
router.post("/me/favorites/:productId", verifyToken, favorController.addMyFavoriteController);

/**
 * @swagger
 * /users/me/favorites/{productId}:
 *   delete:
 *     tags: [Favorites]
 *     summary: Xóa sản phẩm khỏi danh sách yêu thích
 *     description: Bỏ đánh dấu yêu thích một sản phẩm.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Xóa khỏi yêu thích thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Removed from favorites
 */
router.delete("/me/favorites/:productId", verifyToken, favorController.removeMyFavoriteController);

/**
 * @swagger
 * /users/me/cart:
 *   get:
 *     tags: [Carts]
 *     summary: Lấy giỏ hàng hiện tại
 *     description: Lấy toàn bộ sản phẩm trong giỏ hàng của người dùng hiện tại.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Fetched cart successfully
 *                 response:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     cartItems:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/CartItem'
 */
router.get('/me/cart', verifyToken, cartController.getMyCartController);

/**
 * @swagger
 * /users/me/cart:
 *   post:
 *     tags: [Carts]
 *     summary: Thêm sản phẩm vào giỏ hàng
 *     description: Thêm một biến thể sản phẩm vào giỏ hàng. Nếu đã tồn tại sẽ cập nhật số lượng.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productVariantId
 *               - quantity
 *             properties:
 *               productVariantId:
 *                 type: string
 *                 example: var_abc123
 *               quantity:
 *                 type: integer
 *                 minimum: 1
 *                 example: 2
 *     responses:
 *       200:
 *         description: Thêm vào giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Added to cart
 *                 response:
 *                   $ref: '#/components/schemas/CartItem'
 *       400:
 *         description: Sản phẩm không đủ tồn kho hoặc không tìm thấy
 */
router.post('/me/cart', verifyToken, cartController.addToCartController);

/**
 * @swagger
 * /users/me/cart/{cartItemId}:
 *   put:
 *     tags: [Carts]
 *     summary: Cập nhật số lượng sản phẩm trong giỏ hàng
 *     description: Thay đổi số lượng của một item trong giỏ hàng. Nếu số lượng = 0 sẽ xóa item khỏi giỏ.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cart item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 minimum: 0
 *                 example: 3
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Updated cart item
 *       400:
 *         description: Không đủ tồn kho hoặc số lượng không hợp lệ
 *       404:
 *         description: Không tìm thấy cart item
 */
router.put('/me/cart/:cartItemId', verifyToken, cartController.updateCartItemController);

/**
 * @swagger
 * /users/me/cart/{cartItemId}:
 *   delete:
 *     tags: [Carts]
 *     summary: Xóa sản phẩm khỏi giỏ hàng
 *     description: Xóa một item khỏi giỏ hàng.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của cart item
 *     responses:
 *       200:
 *         description: Xóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Item removed from cart
 *       404:
 *         description: Không tìm thấy cart item
 */
router.delete('/me/cart/:cartItemId', verifyToken, cartController.deleteACartItemController);

/**
 * @swagger
 * /users/me/cart:
 *   delete:
 *     tags: [Carts]
 *     summary: Xóa toàn bộ giỏ hàng
 *     description: Xóa tất cả sản phẩm trong giỏ hàng của người dùng hiện tại.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Xóa giỏ hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Cleared cart successfully
 */
router.delete('/me/cart', verifyToken, cartController.clearCartController);

/**
 * @swagger
 * /users/me/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Tạo đơn hàng mới
 *     description: Tạo đơn hàng từ giỏ hàng hiện tại. Hỗ trợ COD và ZaloPay. Có thể áp dụng mã giảm giá.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - addressId
 *               - paymentMethod
 *             properties:
 *               addressId:
 *                 type: string
 *                 example: addr_123
 *               couponCode:
 *                 type: string
 *                 example: DISCOUNT20
 *                 nullable: true
 *               paymentMethod:
 *                 type: string
 *                 enum: [COD, ZaloPay]
 *                 example: COD
 *     responses:
 *       200:
 *         description: Tạo đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Order created successfully (COD)
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *                 paymentUrl:
 *                   type: string
 *                   description: URL thanh toán ZaloPay (chỉ khi paymentMethod=ZaloPay)
 *                   example: https://zalopay.vn/payment/...
 *       400:
 *         description: Giỏ hàng trống, mã coupon không hợp lệ, hoặc không đủ tồn kho
 *       404:
 *         description: Địa chỉ không tìm thấy hoặc không thuộc về user
 */
router.post('/me/orders', verifyToken, orderController.createOrderController);

/**
 * @swagger
 * /users/me/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Lấy danh sách đơn hàng của tôi
 *     description: Lấy tất cả đơn hàng của người dùng hiện tại. Hỗ trợ lọc theo trạng thái và phân trang.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang (bắt đầu từ 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số lượng đơn hàng trên mỗi trang
 *       - in: query
 *         name: hasPagination
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Bật/tắt phân trang
 *       - in: query
 *         name: orderStatus
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Processing, Shipped, Completed, Cancelled]
 *         description: Lọc theo trạng thái đơn hàng
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Paid, Failed, Refunded]
 *         description: Lọc theo trạng thái thanh toán
 *     responses:
 *       200:
 *         description: Lấy danh sách đơn hàng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Fetch my orders succesfully!
 *                 response:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Order'
 *                     count:
 *                       type: integer
 *                       example: 25
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *                         pageSize:
 *                           type: integer
 *                           example: 10
 */
router.get('/me/orders', verifyToken, orderController.getMyOrdersController);

/**
 * @swagger
 * /users/me/coupons:
 *   get:
 *     tags: [Coupons]
 *     summary: Lấy danh sách mã giảm giá của tôi
 *     description: Lấy tất cả mã giảm giá được gán cho người dùng hiện tại, bao gồm trạng thái sử dụng.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách coupon thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 0
 *                 msg:
 *                   type: string
 *                   example: Get coupons successfully
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserCoupon'
 */
router.get('/me/coupons', verifyToken, couponController.getMyCouponsController);

export default router;