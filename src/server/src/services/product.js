import db from "../models/index.js";
import { fn, col } from 'sequelize'
import { buildProductFilters, buildProductSort } from "../utils/index.js"

//LẤY DANH SÁCH SẢN PHẨM (CÓ HOẶC KHÔNG ĐIỀU KIỆN LỌC)
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

// LẤY THÔNG TIN CHI TIẾT MỘT SẢN PHẨM
export const getProductDetailService = async (productId) => {
    try {
        const product = await db.Product.findOne({
            where: {id: productId},
            attributes: {
                exclude: ['brandId']
            },
            include: [
                {
                    model: db.ProductImage,
                    as: 'images',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt']
                    }
                },
                {
                    model: db.ProductVariant,
                    as: 'variants',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'deletedAt']
                    }
                },
                {
                    model: db.Brand,
                    as: 'brand',
                    attributes: ['id','name']
                },
                {
                    model: db.Category,
                    as: 'categories',
                    attributes: { 
                        exclude: ['createdAt', 'updatedAt', 'deletedAt'] 
                    },
                    through: { attributes: [] } // Không lấy cột productId/categoryId
                }
            ]
        })

        return {
            err: product ? 0 : 1,
            msg: product ? 'Get product detail successfully!' : 'Product not found!',
            response: product ? product : null
        }
    } catch (error) {
        throw error
    }
}

export const getProductReviewsService = async (productId) => {
    try {
        //Kiểm tra product có tồn tại hay không
        const productExists = await db.Product.findByPk(productId);

        if (!productExists) {
            return {
                err: 1, 
                msg: 'Product not found!',
                response: null
            };
        }
        //Lấy avg và toal
        const summary = await db.Review.findOne({
            raw: true,
            attributes: [
                [fn("AVG", col("rating")), "averageRating"],
                [fn("COUNT", col("Review.id")), "totalReviews"]
            ],
            include : [
                {
                    model: db.OrderItem,
                    as: 'orderItem',
                    attributes: [],
                    include: [
                        {
                            model: db.ProductVariant,
                            as: 'variant',
                            attributes: [],
                            where: { productId }
                        }
                    ]
                }
            ]
        })

        //Nếu có thì lấy tất cả reviews
        const reviews = await db.Review.findAll({
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'firstname', 'lastname']
                },
                {
                    model: db.OrderItem,
                    as: 'orderItem',
                    attributes: [],
                    include : {
                        model: db.ProductVariant,
                        as: 'variant',
                        attributes: ['id', 'volume'],
                        where: {productId}
                    }
                }
            ],
            order: [["createdAt", "DESC"]]
        })

        // Nếu không có dữ liệu summary (tức là product chưa từng có review)
        const avg = summary?.avgRating ? Number(summary.avgRating).toFixed(1) : "0.0";
        const total = summary?.totalReviews ? Number(summary.totalReviews) : 0;

        return {
            err: 0,
            msg: "Get product reviews successfully!",
            response: {
                avgRating: avg,
                totalReviews: total,
                reviews
            }
        };
    } catch (error) {
        throw error
    }
}