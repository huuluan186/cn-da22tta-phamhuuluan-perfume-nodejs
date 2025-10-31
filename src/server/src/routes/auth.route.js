import express from "express";
import * as authController from '../controllers/auth.controller.js';
import { googleAuth, facebookAuth } from "../middlewares/passport.middleware.js";

const router = express.Router();

router.post('/register', authController.registerController);
router.post('/login', authController.loginController);
router.post('/logout', authController.logoutController)
router.get('/google', googleAuth);
router.get('/google/callback', googleAuth, authController.googleCallbackController);
router.get('/facebook', facebookAuth);
router.get('/facebook/callback', facebookAuth, authController.facebookCallbackController);

export default router;