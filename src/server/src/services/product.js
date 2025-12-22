import db from "../models/index.js";
import { fn, col, Op } from 'sequelize'
import { buildProductFilters, buildProductSort, sortProducts, getPagination, formatPaginatedResponse, slugify, filterEmptyFields } from "../utils/index.js"
import { nanoid } from 'nanoid';
import { v4 } from 'uuid';

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
        
        // === 2. XÂY DỰNG TRUY VẤN ===
        const { where, include } = buildProductFilters(filters); // Lấy object `where` và `include` từ hàm buildProductFilters

        const isJsSort = ["price_asc", "price_desc", "bestseller"].includes(filters.sort);
        const order = !isJsSort ? buildProductSort(filters.sort) : undefined;

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
            ...(order ? { order } : {})
        };
        
        // === 3. Thực thi query ===
        const products = await db.Product.findAndCountAll(findOptions);
        if (!products || products.rows.length === 0) {
            return {
                err: 1,
                msg: 'No products found',
                response: null
            };
        }

        // === 4. XỬ LÝ FORMAT DỮ LIỆU ===
        // Map ra format card: giá từ thấp → cao
        let rows = products.rows.map(prod => {
            // Lấy tất cả giá của variants, lọc NaN
            const prices = prod.variants.map(v => +v.price).filter(p => !isNaN(p));
            const discounts = [];
            prod.variants.forEach(v => {
                if (!isNaN(+v.discountPercent)) {
                    discounts.push(+v.discountPercent);
                }
            });
    
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

            // LẤY KHUYẾN MÃI CAO NHẤT
            const maxDiscount = discounts.length ? Math.max(...discounts) : 0;
            const totalSold = prod.variants.reduce(
                (sum, v) => sum + (+v.soldQuantity || 0), 0
            );

            return {
                id: prod.id,
                name: prod.name,
                brand: prod.brand,
                thumbnail: prod.images[0]?.url || null,
                maxDiscount,
                totalSold,
                ...priceInfo,
                avgRating
            };
        });

        // === 5. LỌC THEO RATING ===
        if (filters.rating) {
            rows = rows.filter(p => p.avgRating >= +filters.rating);
        }

        // == 6. SORT JS cho các field không có trong Product
        rows = sortProducts(rows, filters.sort);

        // =========================
        // 7. PHÂN TRANG SAU KHI SORT
        // =========================
        const total = rows.length;

        if (hasPagination) {
            const start = (pageNum - 1) * limitNum;
            rows = rows.slice(start, start + limitNum);
        }

        // === 8. TRẢ VỀ KẾT QUẢ ===
        return {
            err: 0,
            msg: 'Get product list successfully!',
            response: {
                total,
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
        const product = await db.Product.findByPk(productId, {
            paranoid: false,
            attributes: {
                exclude: ['brandId']
            },
            include: [
                {
                    model: db.Brand,
                    as: 'brand',
                },
                {
                    model: db.Category,
                    as: 'categories',
                    through: { attributes: [] },
                },
                {
                    model: db.ProductVariant,
                    as: 'variants',
                    where: { deletedAt: null },
                    paranoid: false,
                    required: false
                },
                {
                    model: db.ProductImage,
                    as: 'images',
                },
            ],
        });

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
        if (existedReview) return { err: 1, msg: "You have already reviewed this item." }

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

export const getAllProductsAdminService = async (query = {}) => {
    try {
        const { page, limit, hasPagination } = query;

        const { offset, limitNum, pageNum } = getPagination(
            page,
            limit,
            process.env.DEFAULT_PAGE_LIMIT
        );

        const { rows, count } = await db.Product.findAndCountAll({
            paranoid: false,
            distinct: true,
            include: [
                {
                    model: db.Brand,
                    as: 'brand',
                    attributes: ['id', 'name'],
                },
                {
                    model: db.Category,
                    as: 'categories',
                    attributes: ['id', 'name'],
                    through: { attributes: [] },
                },
                {
                    model: db.ProductVariant,
                    as: 'variants',
                    paranoid: false,
                },
                {
                    model: db.ProductImage,
                    as: 'images',
                },
            ],
            order: [['createdAt', 'DESC']],
            ...(hasPagination ? { offset, limit: limitNum } : {}),
        });

        return {
            err: 0,
            msg: 'Fetched products successfully',
            products: formatPaginatedResponse(
                rows,
                count,
                hasPagination ? pageNum : null,
                hasPagination ? limitNum : null
            ),
        };
    } catch (error) {
        throw error;
    }
};


export const createProductService = async (payload) => {
    const transaction = await db.sequelize.transaction();
    try {
        const inputSlug = slugify(payload.name);

        const existedProducts = await db.Product.findAll({
            attributes: ["name"],
            transaction
        });

        const isDuplicate = existedProducts.some(
            p => slugify(p.name) === inputSlug
        );

        if (isDuplicate) {
            await transaction.rollback();
            return { err: 1, msg: "Product name already exists" };
        }

        const productId = v4()
        const data = await db.Product.create(
            {
                id: productId,
                name: payload.name,
                brandId: payload.brandId || null,
                gender: payload.gender,
                origin: payload.origin,
                releaseYear: payload.releaseYear,
                fragranceGroup: payload.fragranceGroup,
                style: payload.style,
                scentNotes: payload.scentNotes,
                description: payload.description
            },
            { transaction }
        );

        if (Array.isArray(payload.categoryIds) && payload.categoryIds.length > 0) {
            await db.ProductCategory.bulkCreate(
                payload.categoryIds.map(cid => ({
                    productId,
                    categoryId: cid
                })),
                { transaction }
            );
        }

        await transaction.commit();
        return { err: 0, msg: "Product created successfully", data};
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProductService = async (productId, payload) => {
    const transaction = await db.sequelize.transaction();
    try {
        const product = await db.Product.findByPk(productId, { transaction });
        if (!product) return { err: 1, msg: "Product not found!" };

        // Check trùng tên nếu có thay đổi name
        if (payload.name) {
            const inputSlug = slugify(payload.name);

            const existedProducts = await db.Product.findAll({
                attributes: ["id", "name"],
                where: { id: { [Op.ne]: productId } },
                transaction
            });

            const isDuplicate = existedProducts.some(
                p => slugify(p.name) === inputSlug
            );

            if (isDuplicate) {
                await transaction.rollback();
                return { err: 1, msg: "Product name already exists" };
            }
        }

        // Update các field cơ bản
        const cleanPayload = filterEmptyFields(payload);
        await product.update(cleanPayload, { transaction });

        // === THÊM PHẦN XỬ LÝ DANH MỤC ===
        if (Array.isArray(payload.categoryIds)) {
            // Xóa hết danh mục cũ
            await db.ProductCategory.destroy({
                where: { productId },
                transaction
            });

            // Thêm danh mục mới
            if (payload.categoryIds.length > 0) {
                await db.ProductCategory.bulkCreate(
                    payload.categoryIds.map(cid => ({
                        productId,
                        categoryId: cid
                    })),
                    { transaction }
                );
            }
        }
        // === KẾT THÚC ===

        await transaction.commit();
        return { err: 0, msg: "Product updated successfully" };
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

export const deleteProductService = async (productId) => {
    try {
        const product = await db.Product.findByPk(productId);
        if (!product) return { err: 1, msg: 'Product not found!' };

        await product.destroy();

        return { err: 0, msg: 'Product deleted successfully' };
    } catch (error) {
        throw error;
    }
};
