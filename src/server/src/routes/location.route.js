import express from 'express'
import * as locationController from '../controllers/location.controller.js'

const router = express.Router()

router.get('/countries', locationController.getAllCountriesController)
router.get('/countries/:countryId/provinces', locationController.getProvincesByCountryController)
router.get('/provinces/:provinceId/wards', locationController.getWardsByProvinceController)

export default router
