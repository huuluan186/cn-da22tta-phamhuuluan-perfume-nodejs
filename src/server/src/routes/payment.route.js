import express from 'express';
import * as controller from '../controllers/payment.controller.js';

const router = express.Router();

router.post('/zalopay/callback', controller.zaloPayCallbackController);

export default router;