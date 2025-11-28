import express from 'express'
import * as locationController from '../controllers/location.controller.js'

const router = express.Router()

router.get('/provinces', locationController.getAllVietNamProvincesController)
router.get('/provinces/:provinceId/wards', locationController.getWardsByProvinceController)

export default router
