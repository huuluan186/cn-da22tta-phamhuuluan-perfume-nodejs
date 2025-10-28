import express from 'express'
import * as regionController from '../controllers/region.controller.js'

const router = express.Router()

router.get('/countries', regionController.getAllCountriesController)
router.get('/countries/:countryId/provinces', regionController.getProvincesByCountryController)
router.get('/provinces/:provinceId/wards', regionController.getWardsByProvinceController)

export default router
