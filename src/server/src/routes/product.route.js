import * as controller from '../controllers/product.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { uploadMultipleImages } from '../middlewares/upload.middleware.js'
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Lấy danh sách sản phẩm
 *     description: Lấy danh sách tất cả sản phẩm với filter, search, sort và phân trang.
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
 *           example: 12
 *         description: Số lượng sản phẩm trên mỗi trang
 *       - in: query
 *         name: hasPagination
 *         schema:
 *           type: boolean
 *           example: true
 *         description: Bật/tắt phân trang
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: Dior
 *         description: Tìm kiếm theo tên sản phẩm
 *       - in: query
 *         name: brandId
 *         schema:
 *           type: string
 *         description: Lọc theo thương hiệu
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         description: Lọc theo danh mục
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [nam, nữ, unisex]
 *         description: Lọc theo giới tính
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Giá tối thiểu
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Giá tối đa
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, createdAt, soldQuantity]
 *           example: price
 *         description: Sắp xếp theo trường
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           example: ASC
 *         description: Thứ tự sắp xếp
 *     responses:
 *       200:
 *         description: Lấy danh sách sản phẩm thành công
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
 *                   example: Get all products successfully
 *                 response:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     count:
 *                       type: integer
 *                       example: 50
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 5
 *                         pageSize:
 *                           type: integer
 *                           example: 12
 */
router.get('/', controller.getAllProductsController);

/**
 * @swagger
 * /products/{productId}:
 *   get:
 *     tags: [Products]
 *     summary: Lấy chi tiết sản phẩm
 *     description: Lấy thông tin chi tiết của một sản phẩm bao gồm hình ảnh, biến thể, danh mục, và thương hiệu.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     responses:
 *       200:
 *         description: Lấy chi tiết sản phẩm thành công
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
 *                   example: Get product detail successfully
 *                 response:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Product'
 *                     - type: object
 *                       properties:
 *                         images:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/ProductImage'
 *                         variants:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/ProductVariant'
 *                         brand:
 *                           $ref: '#/components/schemas/Brand'
 *                         categories:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Category'
 *       404:
 *         description: Không tìm thấy sản phẩm
 */
router.get('/:productId', controller.getProductDetailController);

/**
 * @swagger
 * /products/{productId}/reviews:
 *   get:
 *     tags: [Reviews]
 *     summary: Lấy danh sách đánh giá của sản phẩm
 *     description: Lấy tất cả đánh giá đã được duyệt của một sản phẩm. Hỗ trợ phân trang.
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Số lượng đánh giá trên mỗi trang
 *     responses:
 *       200:
 *         description: Lấy đánh giá thành công
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
 *                   example: Get product reviews successfully
 *                 response:
 *                   type: object
 *                   properties:
 *                     rows:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Review'
 *                     count:
 *                       type: integer
 *                       example: 15
 */
router.get('/:productId/reviews', controller.getProductReviewsController);

/**
 * @swagger
 * /products/{productId}/reviews:
 *   post:
 *     tags: [Reviews]
 *     summary: Thêm đánh giá sản phẩm
 *     description: Thêm đánh giá cho sản phẩm đã mua. Có thể upload tối đa 5 hình ảnh. Yêu cầu xác thực.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sản phẩm
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - orderItemId
 *               - title
 *               - content
 *             properties:
 *               orderItemId:
 *                 type: string
 *                 description: ID của order item (để xác minh đã mua)
 *                 example: oi_abc123
 *               title:
 *                 type: string
 *                 example: Sản phẩm tuyệt vời!
 *               content:
 *                 type: string
 *                 example: Mùi hương rất sang trọng và lưu hương lâu
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *                 description: Tối đa 5 hình ảnh
 *     responses:
 *       201:
 *         description: Thêm đánh giá thành công
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
 *                   example: Review added successfully
 *                 response:
 *                   $ref: '#/components/schemas/Review'
 *       400:
 *         description: Sản phẩm chưa được mua hoặc dữ liệu không hợp lệ
 *       401:
 *         description: Chưa đăng nhập
 */
router.post(
    '/:productId/reviews', 
    verifyToken,
    uploadMultipleImages('review', 5), // max 5 ảnh, lưu trong /uploads/review
    controller.addProductReviewsController
);

export default router;