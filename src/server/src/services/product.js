import { response } from "express";
import db from "../models/index.js";
import { buildProductFilters, buildProductSort } from "../utils/index.js"

export const getAllProductsService = async ( page, limit, filters = {} ) => {
    try {
        // === 1. XỬ LÝ PHÂN TRANG ===
        let hasPagination = false;
        let limitNum;
        const pageNum = Number(page) || 1;
        if (limit !== undefined) { // nếu limit được truyền trong query
            limitNum = limit && +limit > 0 ? +limit : +process.env.DEFAULT_PAGE_LIMIT || 9;
            hasPagination = page !== undefined && page !== '' && limitNum > 0;
        }
        const offset = hasPagination ? (pageNum - 1) * limitNum : 0;
        
        // === 2. XÂY DỰNG TRUY VẤN ===
        const { where, include } = buildProductFilters(filters);
        const order = buildProductSort(filters?.sort);

        const findOptions = {
            where,
            include,
            distinct: true,
            order,
            ...(hasPagination ? { offset, limit: limitNum } : {})
        };
        
        const products = await db.Product.findAndCountAll(findOptions);
        if (!products || products.rows.length === 0) {
            return {
                err: 1,
                msg: 'No products found',
                response: null
            };
        }

        // === 3. XỬ LÝ FORMAT DỮ LIỆU ===
        // Map ra format card: giá từ thấp → cao
        const data = products.rows.map(prod => {
            const prices = prod.variants.map(v => +v.price).filter(p => !isNaN(p));
    
            const priceInfo = {};
            if (prices.length === 1) {
                priceInfo.price = prices[0];
            } else if (prices.length > 1) {
                priceInfo.minPrice = Math.min(...prices);
                priceInfo.maxPrice = Math.max(...prices);
            }
            return {
                id: prod.id,
                name: prod.name,
                brand: prod.brand,
                thumbnail: prod.images[0]?.url || null,
                ...priceInfo
            };
        });

        // === 4. TRẢ VỀ KẾT QUẢ ===
        return {
            err: 0,
            msg: 'Get product list successfully!',
            response: {
                total: products.count,
                page: hasPagination ? pageNum : null,
                limit: hasPagination ? limitNum : null,
                data
            }
        };
    } catch (error) {
        throw error
    }
};
