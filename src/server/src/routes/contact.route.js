import * as controller from '../controllers/contact.controller.js';

import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /contacts:
 *   post:
 *     tags: [Contacts]
 *     summary: Gửi form liên hệ
 *     description: Gửi thông tin liên hệ từ khách hàng tới hệ thống. Không yêu cầu đăng nhập.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *               email:
 *                 type: string
 *                 format: email
 *                 example: customer@example.com
 *               message:
 *                 type: string
 *                 example: Tôi muốn hỏi về chính sách đổi trả sản phẩm
 *     responses:
 *       201:
 *         description: Gửi liên hệ thành công
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
 *                   example: Contact created successfully
 *                 response:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', controller.createContactController);


export default router;