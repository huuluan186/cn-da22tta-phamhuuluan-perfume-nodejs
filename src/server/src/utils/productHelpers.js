import db from "../models/index.js";
import { Op } from "sequelize";
/**
     * Tạo điều kiện filter cho product
     * @param {Object} filters - categoryId, brandId, priceRange, rating, keyword
 */

//bộ lọc
export const buildProductFilters = ({ categoryId, brandIds, priceRange, keyword }) => {
    const include = [
        { model: db.Brand, as: 'brand', attributes: ['id', 'name', 'logoUrl'] },
        { model: db.ProductImage, as: 'images', where: { isThumbnail: true }, required: false, attributes: ['url'] },
        { model: db.ProductVariant, as: 'variants', attributes: ['price', 'discountPercent'] },
    ];

    const where = {};
    if (keyword) where.name = { [Op.like]: `%${keyword}%` };
    if (brandIds && brandIds.length) where.brandId = { [Op.in]: brandIds };
    //if (rating) where.rating = { [Op.gte]: +rating };

    if (categoryId) {
        include.push({
            model: db.Category,
            as: "categories",
            where: { id: categoryId },
            attributes: [],
        });
    }

    // Xử lý khoảng giá (min-max)
    if (priceRange && Array.isArray(priceRange)) {
        const variantInclude = include.find(i => i.as === 'variants');
        if (variantInclude) {
            variantInclude.where = {
                price: {
                    ...(priceRange[0] && { [Op.gte]: +priceRange[0] }),
                    ...(priceRange[1] && { [Op.lte]: +priceRange[1] }),
                }
            };
        }
    }

    return { where, include };
};

/**
 * Trả về order cho sequelize dựa theo sort key
 */
export const buildProductSort = (sortKey) => {
    switch (sortKey) {
        case 'latest': return [['createdAt', 'DESC']];
        case 'oldest': return [['createdAt', 'ASC']];
        case 'price_asc': return [['variants', 'price', 'ASC']];
        case 'price_desc': return [['variants', 'price', 'DESC']];
        case 'name_asc': return [['name', 'ASC']];
        case 'name_desc': return [['name', 'DESC']];
        case 'bestseller': return [['sold', 'DESC']];
        default: return [['createdAt', 'DESC']];
    }
};

export const updateProductStock = async (items, transaction) => {
    try {
        for (let item of items) {
            const variant = await db.ProductVariant.findByPk(
                item.productVariantId,
                { transaction }
            );

            if (!variant)
                return { err: 1, msg: `Variant not found (${item.productVariantId})` };

            if (variant.stockQuantity < item.quantity)
                return { err: 1, msg: `Variant out of stock (${variant.sku})` };

            await variant.update({
                stockQuantity: variant.stockQuantity - item.quantity,
                soldQuantity: variant.soldQuantity + item.quantity
            }, { transaction });
        }

        return { err: 0 };

    } catch (error) {
        throw error;
    }
};
