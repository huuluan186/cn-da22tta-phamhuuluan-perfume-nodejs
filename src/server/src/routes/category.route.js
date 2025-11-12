import * as controller from '../controllers/category.controller.js';
import express from 'express';

const router = express.Router();

router.get('/', controller.getAllCategoriesController);

export default router;