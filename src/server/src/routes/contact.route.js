import * as controller from '../controllers/contact.controller.js';
import { verifyToken } from '../middlewares/verifyToken.middleware.js';
import { isAdmin } from '../middlewares/userAuthentication.js';

import express from 'express';

const router = express.Router();

router.post('/', controller.createContactController);
router.get('/', verifyToken, isAdmin, controller.getAllContactsController);
router.patch('/:id/status', verifyToken, isAdmin, controller.updateContactStatusController)

export default router;