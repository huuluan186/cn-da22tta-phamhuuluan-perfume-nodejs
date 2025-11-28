import * as service from '../services/location.js'

export const getAllVietNamProvincesController = async (req, res) => {
    try {
        const response = await service.getAllVietNamProvincesService();
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at get all provinces controller: ' + error.message
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
