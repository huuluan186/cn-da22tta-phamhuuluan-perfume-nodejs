import db from '../models/index.js';

// Check địa chỉ có thuộc user không
export const checkUserAddress = async (userId, addressId, transaction = null) => {
    try {
        const address = await db.Address.findOne({
            where: {
                id: addressId, 
                userId,
            },
            transaction
        });
        
        if (!address) return { err: 1, msg: 'Address not found or not owned by user!' };
        return { err: 0, msg: 'Address is valid', address };
    } catch (error) {
        throw error;
    }
}

// check stock trước khi tạo đơn hàng
export const checkStock = async (items, transaction = null) => {
    try {
        for (let item of items) {
            const variant = await db.ProductVariant.findByPk(item.productVariantId, {transaction});
            if (!variant) 
                return { err: 1, msg: `Variant not found (${item.productVariantId})` };
            if (variant.stockQuantity < item.quantity) 
                return { err: 1, msg: `Variant out of stock (${variant.sku})` };
        }
        return { err: 0, msg: 'All items are in stock' };
    } catch (error) {
        throw error;
    }
};

// Hàm sinh mã đẹp + đúng chuẩn ZaloPay 
export const generateOrderId = () => {
    const date = new Date();
    const yyMMdd = date.toISOString().slice(2, 10).replace(/-/g, '').slice(0, 6); // 250407
    const random = Math.floor(10000 + Math.random() * 90000); // 5 số ngẫu nhiên
    return `${yyMMdd}${random}`; // ví dụ: 25040763821
};

export const orderIncludes = [
    {
        model: db.OrderItem,
        as: 'orderItems',
        attributes: { exclude: ['orderId', 'createdAt', 'updatedAt', 'deletedAt'] },
        include: [
            {
                model: db.ProductVariant,
                as: 'variant',
                attributes: { 
                    exclude: [
                        'stockQuantity', 'soldQuantity', 
                        'createdAt', 'updatedAt', 'deletedAt', 
                        'isDefault'
                    ] 
                },
                include: [
                    {
                        model: db.Product,
                        as: 'product',
                        attributes: ['id', 'name'] // chỉ cần name là đủ
                    }
                ]
            }
        ]
    },
    {
        model: db.Address,
        as: 'address',
        attributes: { 
            exclude: [
                'userId', 'sortOrder', 'isDefault', 
                'createdAt', 'updatedAt', 'deletedAt', 
                'wardId'
            ] 
        },
        paranoid: false,
        include: [
            {
                model: db.Ward,
                as: 'ward',
                attributes: { 
                    exclude: [
                        'provinceId', 'slug',
                        'createdAt', 'updatedAt', 'deletedAt'
                    ] 
                },
                include: [
                    {
                        model: db.Province,
                        as: 'province',
                        attributes: { 
                            exclude: [
                                'code', 'countryCode', 'slug',
                                'createdAt', 'updatedAt', 'deletedAt'
                            ] 
                        }
                    }
                ]
            }
        ]
    }
];
