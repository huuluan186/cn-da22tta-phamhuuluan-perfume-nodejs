import express from 'express'
import * as locationController from '../controllers/location.controller.js'

const router = express.Router()

/**
 * @swagger
 * /locations/provinces:
 *   get:
 *     tags: [Addresses]
 *     summary: Lấy danh sách tỉnh/thành phố Việt Nam
 *     description: Lấy tất cả các tỉnh/thành phố ở Việt Nam.
 *     responses:
 *       200:
 *         description: Lấy danh sách tỉnh/thành phố thành công
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
 *                   example: Get provinces successfully
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Province'
 */
router.get('/provinces', locationController.getAllVietNamProvincesController)

/**
 * @swagger
 * /locations/provinces/{provinceId}/wards:
 *   get:
 *     tags: [Addresses]
 *     summary: Lấy danh sách phường/xã theo tỉnh
 *     description: Lấy tất cả các phường/xã thuộc một tỉnh/thành phố cụ thể.
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tỉnh/thành phố
 *     responses:
 *       200:
 *         description: Lấy danh sách phường/xã thành công
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
 *                   example: Get wards successfully
 *                 response:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Ward'
 *       404:
 *         description: Không tìm thấy tỉnh/thành phố
 */
router.get('/provinces/:provinceId/wards', locationController.getWardsByProvinceController)

export default router
