import express from "express";
import * as controller from '../controllers/brand.controller.js';

const router = express.Router();

router.get('/', controller.getPublicBrandsController);
router.get('/:id', controller.getBrandByIdController);


export default router;