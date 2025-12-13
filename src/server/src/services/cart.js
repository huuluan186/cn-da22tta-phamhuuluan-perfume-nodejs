import db from '../models/index.js';
import { nanoid } from 'nanoid';
import { getOrCreateCart } from '../utils/index.js';

// Lấy giỏ hàng của user
export const getMyCartService = async (userId) => {
    try {
        const cart = await getOrCreateCart(userId);
        const cartItems = await db.Cart.findOne({
            where: { id: cart.id },
            include: [
                {
                    model: db.CartItem,
                    as: 'cartItems',
                    include: [
                        {
                            model: db.ProductVariant,
                            as: 'productVariant',
                            include: [
                                {
                                    model: db.Product,
                                    as: 'product',
                                    attributes: ['id', 'name', 'gender', 'origin'],
                                    include: [
                                        {
                                            model: db.Brand,
                                            as: 'brand', 
                                            attributes: ['id', 'name']
                                        },
                                        {
                                            model: db.ProductImage,
                                            as: 'images',
                                            attributes: ['id', 'url'],
                                            where: { isThumbnail: true }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return {
            err: cartItems ? 0 : 1,
            msg: cartItems ? 'Fetched cart successfully' : 'Cart is empty',
            response: cartItems ? cartItems : null
        };
    } catch (error) {
        throw error;
    }
}

// Thêm sản phẩm vào giỏ hàng
export const addToCartService = async (userId, productVariantId, quantity = 1) => {
    try {
        if (quantity < 1) return { err: 1, msg: "Quantity must be at least 1" };

        const cart = await getOrCreateCart(userId);

        const variant = await db.ProductVariant.findByPk(productVariantId, {
            include: [{ model: db.Product, as: "product" }]
        });

        if (!variant) return { err: 1, msg: "Product variant not found" };
    
        if (variant.stockQuantity < quantity) return { err: 1, msg: "Not enough stock" };

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingCartItem = await db.CartItem.findOne({
            where: {
                cartId: cart.id,
                productVariantId
            }
        });

        if (existingCartItem) {
            // Nếu đã có, cập nhật số lượng
            const newQty = (+existingCartItem.quantity) + (+quantity);
            if (variant.stockQuantity < newQty) {
                return { err: 1, msg: "Not enough stock for the requested quantity" };
            }
            existingCartItem.quantity = newQty;
            await existingCartItem.save();
            return { err: 0, msg: "Updated quantity in cart", response: existingCartItem };
        } else {
            // Nếu chưa có, tạo mới cart item
            const newCartItem = await db.CartItem.create({
                id: nanoid(4),
                cartId: cart.id,
                productVariantId,
                quantity,
                priceAtTime: variant.price
            });
            return { err: 0, msg: "Added to cart", response: newCartItem };
        }
    } catch (error) {
        throw error
    }
}

//Cập nhật số lượng sản phẩm trong giỏ hàng
export const updateCartItemService = async (userId, cartItemId, quantity) => {
    try {
        if (quantity < 0) {
            return { err: 1, msg: "Quantity cannot be negative" };
        }
        const cart = await getOrCreateCart(userId);

        // Tìm cart item xem có thuộc giỏ hàng của user không
        const cartItem = await db.CartItem.findOne({
            where: {
                id: cartItemId, 
                cartId: cart.id
            },
            include: [
                { model: db.ProductVariant, as: 'productVariant' }
            ]
        });

        if (!cartItem) { // không tìm thấy cart item
            return { err: 1, msg: "Cart item not found" };
        }

        // Nếu số lượng là 0, xóa sản phẩm khỏi giỏ hàng
        if (quantity === 0) {
            await cartItem.destroy();
            return { err: 0, msg: "Item removed from cart" };
        }

        // Kiểm tra tồn kho
        if (cartItem.productVariant.stockQuantity < quantity) {
            return { err: 1, msg: "Not enough stock for the requested quantity" };
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return { err: 0, msg: "Updated cart item", response: cartItem };
    } catch (error) {
        throw error
    }
}


// xóa 1 sản phẩm khỏi giỏ hàng
export const deleteACartItemService = async (userId, cartItemId) => {
    try {
        const cart = await getOrCreateCart(userId);
        const cartItem = await db.CartItem.findOne({
            where: {
                id: cartItemId,
                cartId: cart.id
            }
        });

        if (!cartItem) {
            return { err: 1, msg: "Cart item not found" };
        }
        await cartItem.destroy();
        return { err: 0, msg: "Item removed from cart" };
    } catch (error) {
        throw error;
    }
}

// xóa toàn bộ giỏ hàng
export const clearCartService = async (userId) => {
    try {
        const cart = await getOrCreateCart(userId);
        await db.CartItem.destroy({
            where: { cartId: cart.id }
        });
        return { err: 0, msg: "Cleared cart successfully" };
    } catch (error) {
        throw error;
    }
}