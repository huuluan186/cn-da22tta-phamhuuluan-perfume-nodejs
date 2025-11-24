import db from "../models/index.js";
import { fn, col } from 'sequelize'
import { buildProductFilters, buildProductSort } from "../utils/index.js"
import { nanoid } from 'nanoid';

//LẤY DANH SÁCH SẢN PHẨM (CÓ HOẶC KHÔNG ĐIỀU KIỆN LỌC)
export const getAllProductsService = async ( page, limit, filters = {} ) => {
    try {
        // === 1. XỬ LÝ PHÂN TRANG ===
        let hasPagination = false;
        let limitNum;
        const pageNum = Number(page) || 1;

        // Nếu limit được truyền từ query, sử dụng; nếu không dùng default
        if (limit !== undefined) { 
            limitNum = limit && +limit > 0 ? +limit : +process.env.DEFAULT_PAGE_LIMIT || 9;
            hasPagination = page !== undefined && page !== '' && limitNum > 0;
        }
        const offset = hasPagination ? (pageNum - 1) * limitNum : 0; // tính offset cho pagination
        
        // === 2. XÂY DỰNG TRUY VẤN ===
        const { where, include } = buildProductFilters(filters); // Lấy object `where` và `include` từ hàm buildProductFilters
        const order = buildProductSort(filters?.sort); // Lấy mảng order (sort) nếu có

        // Nếu filter theo rating được truyền, join thêm các review để tính avgRating
        if (filters.rating) {
            include.push({
                model: db.ProductVariant,
                as: "variants",
                required: false,
                include: [{
                    model: db.OrderItem,
                    as: "orderItems",
                    required: false,
                    include: [{
                        model: db.Review,
                        as: "reviews",
                        attributes: ["rating"], 
                        required: false
                    }]
                }]
            });
        }

        // Tạo options cho findAndCountAll
        const findOptions = {
            where,
            include,
            distinct: true, // tránh duplicate khi join
            order,
            ...(hasPagination ? { offset, limit: limitNum } : {})
        };
        
        // === 2a. Thực thi query ===
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
        let rows = products.rows.map(prod => {
            // Lấy tất cả giá của variants, lọc NaN
            const prices = prod.variants.map(v => +v.price).filter(p => !isNaN(p));
    
            const priceInfo = {};
            if (prices.length === 1) {
                priceInfo.price = prices[0];
            } else if (prices.length > 1) {
                priceInfo.minPrice = Math.min(...prices);
                priceInfo.maxPrice = Math.max(...prices);
            }

            let avgRating = null;
            // Chỉ tính avgRating khi có filter.rating
            if (filters.rating) {
                const ratings = (prod.variants || []).flatMap(v =>
                    (v.orderItems || []).flatMap(oi =>
                        (oi.reviews || []).map(r => r.rating)
                    )
                );
                avgRating = ratings.length ? ratings.reduce((a,b) => a+b,0) / ratings.length : null;
            }

            return {
                id: prod.id,
                name: prod.name,
                brand: prod.brand,
                thumbnail: prod.images[0]?.url || null,
                ...priceInfo,
                avgRating
            };
        });

        // === 3a. LỌC THEO RATING ===
        if (filters.rating) {
            rows = rows.filter(p => p.avgRating >= +filters.rating);
        }

        // === 4. TRẢ VỀ KẾT QUẢ ===
        return {
            err: 0,
            msg: 'Get product list successfully!',
            response: {
                total: products.count,
                page: hasPagination ? pageNum : null,
                limit: hasPagination ? limitNum : null,
                data: rows
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
        // 1. Kiểm tra product tồn tại
        const productExists = await db.Product.findByPk(productId);
        if (!productExists) {
            return { err: 1, msg: 'Product not found!', response: null };
        }

        // 2. Lấy summary (averageRating, totalReviews) chỉ với productId
        const summary = await db.Review.findOne({
            raw: true,
            attributes: [
                [fn("AVG", col("rating")), "averageRating"],
                [fn("COUNT", fn("DISTINCT", col("Review.id"))), "totalReviews"]
            ],
            include: [
                {
                    model: db.OrderItem,
                    as: 'orderItem',
                    required: true, // bắt buộc phải có OrderItem
                    attributes: [],
                    include: [
                        {
                            model: db.ProductVariant,
                            as: 'variant',
                            required: true, // bắt buộc phải có ProductVariant
                            attributes: [],
                            where: { productId } // filter theo productId
                        }
                    ]
                }
            ]
        });

        // 3. Lấy danh sách Review chi tiết
        const reviews = await db.Review.findAll({
            attributes: { exclude: ['userId'] },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['id', 'firstname', 'lastname']
                },
                {
                    model: db.OrderItem,
                    as: 'orderItem',
                    required: true,
                    attributes: [],
                    include: {
                        model: db.ProductVariant,
                        as: 'variant',
                        required: true,
                        attributes: ['id', 'volume'],
                        where: { productId }
                    }
                },
                {
                    model: db.ReviewImage,
                    as: 'reviewImages',
                }
            ],
            order: [["createdAt", "DESC"]],
        });

        // 4. Xử lý dữ liệu summary nếu chưa có review
        const avg = summary?.averageRating ? Number(summary.averageRating).toFixed(1) : "0.0";
        const total = summary?.totalReviews ? Number(summary.totalReviews) : 0;

        return {
            err: 0,
            msg: "Get product reviews successfully!",
            response: {
                averagaRating: avg,
                totalReviews: total,
                reviews
            }
        };

    } catch (error) {
        throw error;
    }
};

// thêm nhiều ảnh review
export const addReviewImagesService = async (reviewId, images = []) => {
    try {
        if (!images.length) return [];
        const reviewImages = images.map((url, index) => ({
            id: nanoid(4),
            reviewId,
            url,
            sortOrder: index
        }));
        return await db.ReviewImage.bulkCreate(reviewImages);
    } catch (error) {
        throw error
    }
};

// Bình luận sản phẩm đã mua
export const addProductReviewsService = async ({ userId, orderItemId, title, content, rating, images = [] }) => {
    try {
        // 1. Kiểm tra orderItem tồn tại và thuộc về user này
        const orderItem = await db.OrderItem.findOne({
            where: {id: orderItemId},
            include: [
                {
                    model: db.Order,
                    as: 'order',
                    where: {userId}
                },
                {
                    model: db.ProductVariant,
                    as: 'variant',
                    attributes: ['id', 'volume', 'productId']
                }
            ]
        })
        if (!orderItem) return { err: 1, msg: "Order item not found or does not belong to you." };

        // 2. Kiểm tra user đã review chưa
        const existedReview = await db.Review.findOne({ where: { orderItemId, userId } });
        if (existedReview) return { err: 1, mdg: "You have already reviewed this item." }

        // 3. Tạo review với tất cả field của model
        const reviewId = nanoid(4);
        const review = await db.Review.create({
            id: reviewId,
            orderItemId,
            userId,
            title,
            content,
            rating: rating ?? 5
        })

        // 4. Thêm ảnh nếu có
         let reviewImages = [];
        if (images.length) {
            reviewImages = await addReviewImagesService(reviewId, images);
        }

        // 5. Trả về review vừa tạo kèm ảnh
        return {
            err: 0,
            msg: "Review added successfully",
            response: {
                ...review.toJSON(),
                reviewImages
            }
        }
    } catch (error) {
        throw error
    }
}