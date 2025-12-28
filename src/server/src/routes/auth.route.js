import express from "express";
import * as authController from '../controllers/auth.controller.js';
import { googleAuth, facebookAuth } from "../middlewares/passport.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng ký tài khoản mới
 *     description: Đăng ký tài khoản mới với email và mật khẩu. Sau khi đăng ký thành công, JWT token sẽ được lưu trong HttpOnly cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - lastname
 *               - email
 *               - password
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: Nguyễn
 *               lastname:
 *                 type: string
 *                 example: Văn A
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/; Max-Age=172800
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
 *                   example: Đăng ký tài khoản thành công!
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 1
 *                 msg:
 *                   type: string
 *                   example: Validation error message
 *       409:
 *         description: Email đã được sử dụng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 2
 *                 msg:
 *                   type: string
 *                   example: Email đã được sử dụng!
 */
router.post('/register', authController.registerController);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng nhập
 *     description: Đăng nhập bằng email và mật khẩu. JWT token sẽ được lưu trong HttpOnly cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       201:
 *         description: Đăng nhập thành công
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/; Max-Age=172800
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
 *                   example: Đăng nhập thành công!
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 1
 *                 msg:
 *                   type: string
 *                   example: Validation error message
 *       401:
 *         description: Email không tồn tại hoặc mật khẩu không đúng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 1
 *                 msg:
 *                   type: string
 *                   example: Email không tồn tại! / Mật khẩu không đúng!
 *                 token:
 *                   type: string
 *                   nullable: true
 *                   example: null
 */
router.post('/login', authController.loginController);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Authentication]
 *     summary: Đăng xuất
 *     description: Đăng xuất khỏi hệ thống bằng cách xóa HttpOnly cookie chứa JWT token.
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: access_token=; HttpOnly; Path=/; Max-Age=0
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
 *                   example: Logged out successfully
 */
router.post('/logout', authController.logoutController)

/**
 * @swagger
 * /auth/google:
 *   get:
 *     tags: [Authentication]
 *     summary: Đăng nhập bằng Google OAuth
 *     description: Chuyển hướng người dùng đến trang đăng nhập Google OAuth.
 *     responses:
 *       302:
 *         description: Chuyển hướng đến Google OAuth
 */
router.get('/google', googleAuth);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     tags: [Authentication]
 *     summary: Callback sau khi đăng nhập Google thành công
 *     description: Google sẽ redirect về endpoint này sau khi người dùng xác thực. JWT token sẽ được lưu trong HttpOnly cookie và redirect về client.
 *     responses:
 *       302:
 *         description: Redirect về client với cookie đã set
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/
 *           Location:
 *             schema:
 *               type: string
 *               example: http://localhost:3000/auth/callback
 *       401:
 *         description: Xác thực Google thất bại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 1
 *                 msg:
 *                   type: string
 *                   example: Authentication failed
 */
router.get('/google/callback', googleAuth, authController.googleCallbackController);

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     tags: [Authentication]
 *     summary: Đăng nhập bằng Facebook OAuth
 *     description: Chuyển hướng người dùng đến trang đăng nhập Facebook OAuth.
 *     responses:
 *       302:
 *         description: Chuyển hướng đến Facebook OAuth
 */
router.get('/facebook', facebookAuth);

/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     tags: [Authentication]
 *     summary: Callback sau khi đăng nhập Facebook thành công
 *     description: Facebook sẽ redirect về endpoint này sau khi người dùng xác thực. JWT token sẽ được lưu trong HttpOnly cookie và redirect về client.
 *     responses:
 *       302:
 *         description: Redirect về client với cookie đã set
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Path=/
 *           Location:
 *             schema:
 *               type: string
 *               example: http://localhost:3000/auth/callback
 *       401:
 *         description: Xác thực Facebook thất bại hoặc thiếu dữ liệu
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 err:
 *                   type: integer
 *                   example: 1
 *                 msg:
 *                   type: string
 *                   example: No user data from Facebook
 */
router.get('/facebook/callback', facebookAuth, authController.facebookCallbackController);

export default router;