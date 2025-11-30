import db from '../models/index.js'

// Lấy tất cả tỉnh/thành theo quốc gia
export const getAllVietNamProvincesService = async () => {
    try {
        const provinces = await db.Province.findAll();
        return {
            err: 0,
            msg: "Get all Vietnam's provinces successfully!",
            response: provinces
        };
    } catch (error) {
        throw error
    }
}

// Lấy tất cả phường/xã theo tỉnh
export const getWardsByProvinceService = async (provinceId) => {
    try {
        const province = await db.Province.findByPk(provinceId)
        if (!province) return { err: 1, msg: 'Province not found!' }

        const wards = await db.Ward.findAll({
            where: { provinceId }
        })

        return {
            err: 0,
            msg: 'Get wards by province successfully!',
            response: wards
        }
    } catch (error) {
        throw error
    }
}
