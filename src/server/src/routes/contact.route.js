import * as controller from '../controllers/contact.controller.js';

import express from 'express';

const router = express.Router();

router.post('/', controller.createContactController);


export default router;