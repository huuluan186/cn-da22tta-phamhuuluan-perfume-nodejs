import * as controller from '../controllers/category.controller.js';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Lấy danh sách danh mục sản phẩm
 *     description: Lấy tất cả danh mục sản phẩm có sẵn (dạng cây phân cấp nếu có parent-child relationship).
 *     responses:
 *       200:
 *         description: Lấy danh sách danh mục thành công
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
 *                   example: Get all categories successfully
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/', controller.getAllCategoriesController);

export default router;