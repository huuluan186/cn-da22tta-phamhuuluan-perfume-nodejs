import db from '../models/index.js'

// Lấy tất cả quốc gia
export const getAllCountriesService = async () => {
    try {
        const countries = await db.Country.findAll();
        return {
            err: 0,
            msg: 'Get all countries successfully!',
            response: countries
        };
    } catch (error) {
        throw error
    }
}

// Lấy tất cả tỉnh/thành theo quốc gia
export const getProvincesByCountryService  = async (countryId) => {
    try {
        const country = await db.Country.findByPk(countryId);
        if (!country) return { err: 1, msg: 'Country not found!' }

        const provinces = await db.Province.findAll({
            where: { countryId }
        })

        return {
            err: 0,
            msg: 'Get provinces by country successfully!',
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
