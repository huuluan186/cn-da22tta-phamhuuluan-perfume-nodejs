import db from "../models/index.js";

// Thêm sản phẩm vào favorites của user
export const addFavoriteService = async (userId, productId) => {
    try {
        const product = await db.Product.findByPk(productId);
        if (!product) return { err: 1, msg: "Product does not exist" };

        // Kiểm tra userId có tồn tại không (tùy chọn, nếu cần)
        const user = await db.User.findByPk(userId);
        if (!user) return { err: 1, msg: "User does not exist" };

        const [favorite, created] = await db.Favorite.findOrCreate({
            where: { userId, productId },
            defaults: { userId, productId }
        });

        return created 
            ? { err: 0, msg: "Added to favorites" }
            : { err: 1, msg: "Product already in favorites" };
    } catch (error) {
        throw error
    }
};

// Xóa sản phẩm khỏi favorites của user
export const removeFavoriteService = async (userId, productId) => {
    try {
        const deletedCount = await db.Favorite.destroy({ where: { userId, productId } });

        return deletedCount 
            ? { err: 0, msg: "Removed from favorites" } 
            : { err: 1, msg: "Product not found in favorites" };
    } catch (error) {
        throw error
    }

};

// Lấy danh sách favorites của user hiện tại
export const getMyFavoritesService = async (userId) => {
    try {
        const user = await db.User.findByPk(userId, {
            include:[
                {
                    model: db.Product,
                    as: 'favorites',
                    include: [
                        { model: db.Brand, as: 'brand', attributes: ['id','name'] },
                        { model: db.ProductImage, as: 'images', attributes: ['url'], where: { isThumbnail: true }, required: false },
                        { model: db.ProductVariant, as: 'variants', attributes: ['price'] },
                    ]
                }
            ] 
        });

        if (!user) return { err: 1, msg: "User not found!", response: [] };

        const data = user.favorites.map(prod => {
                const prices = prod.variants.map(v => +v.price).filter(p => !isNaN(p));
                const priceInfo = {};
                if (prices.length === 1) priceInfo.price = prices[0];
                else if (prices.length > 1) {
                    priceInfo.minPrice = Math.min(...prices);
                    priceInfo.maxPrice = Math.max(...prices);
                }

                return {
                    productId: prod.id,
                    productName: prod.name,
                    brand: prod.brand,
                    thumbnail: prod.images[0]?.url || null,
                    ...priceInfo
                };
            });

        return {
            err: 0,
            msg: "Get user's favorites successfully",
            response: data
        };
    } catch (error) {
        throw error;
        
    }
};

// Lấy tất cả favorites của tất cả user
export const getAllFavoritesService = async () => {
    try {
        const favorites = await db.Favorite.findAll({
            include: [
                { model: db.User, as: 'user', attributes: ['id', 'firstname', 'lastname', 'email'] },
                { model: db.Product, as: 'product', include: [
                    { model: db.Brand, as: 'brand', attributes: ['id','name'] },
                    { model: db.ProductImage, as: 'images', attributes: ['url'], limit: 1 }
                ]}
            ]
        });

        return {
            err: 0,
            msg: "Get all favorites successfully",
            response: favorites
        };
    } catch (error) {
        throw error
    }
};
