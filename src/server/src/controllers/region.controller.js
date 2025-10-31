import * as service from '../services/region.js'

export const getAllCountriesController = async (req, res) => {
    try {
        const response = await service.getAllCountriesService()
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at get all countries controller: ' + error.message
        })
    }
}

export const getProvincesByCountryController = async (req, res) => {
    try {
        const { countryId } = req.params
        const response = await service.getProvincesByCountryService(countryId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at get provinces by country controller: ' + error.message
        })
    }
}

export const getWardsByProvinceController = async (req, res) => {
    try {
        const { provinceId } = req.params
        const response = await service.getWardsByProvinceService(provinceId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at get wards by province controller: ' + error.message
        })
    }
}
