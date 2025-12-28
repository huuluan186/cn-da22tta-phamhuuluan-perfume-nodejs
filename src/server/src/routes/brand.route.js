import express from "express";
import * as controller from '../controllers/brand.controller.js';

const router = express.Router();

/**
 * @swagger
 * /brands:
 *   get:
 *     tags: [Brands]
 *     summary: Lấy danh sách thương hiệu công khai
 *     description: Lấy tất cả thương hiệu nước hoa có sẵn để hiển thị công khai.
 *     responses:
 *       200:
 *         description: Lấy danh sách thương hiệu thành công
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
 *                   example: Get public brands successfully
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Brand'
 */
router.get('/', controller.getPublicBrandsController);

/**
 * @swagger
 * /brands/{id}:
 *   get:
 *     tags: [Brands]
 *     summary: Lấy chi tiết thương hiệu
 *     description: Lấy thông tin chi tiết của một thương hiệu theo ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của thương hiệu
 *     responses:
 *       200:
 *         description: Lấy thông tin thương hiệu thành công
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
 *                   example: Get brand successfully
 *                 response:
 *                   $ref: '#/components/schemas/Brand'
 *       404:
 *         description: Không tìm thấy thương hiệu
 */
router.get('/:id', controller.getBrandByIdController);


export default router;