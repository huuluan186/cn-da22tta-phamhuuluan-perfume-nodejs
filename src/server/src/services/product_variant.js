import db from "../models/index.js";
import { nanoid } from 'nanoid';

export const createVariantService = async (productId, payload) => {
    try {
        const variant = await db.ProductVariant.create({
            id: nanoid(4),
            productId,
            sku: payload.sku || `#${Date.now().toString(36).toUpperCase()}${nanoid(4).toUpperCase()}`,
            ...payload,
        });
    
        return { err: 0, msg: 'Variant created', variant };
    } catch (error) {
        throw error;
    }
};

export const updateVariantService = async (variantId, payload) => {
    try {
        const variant = await db.ProductVariant.findByPk(variantId);
        if (!variant) return { err: 1, msg: 'Variant not found!' };

        const cleanPayload = {};

        if (payload.volume) cleanPayload.volume = payload.volume;
        if (payload.price !== "" && payload.price !== undefined)
            cleanPayload.price = Number(payload.price);
        if (payload.stockQuantity !== "" && payload.stockQuantity !== undefined)
            cleanPayload.stockQuantity = Number(payload.stockQuantity);
        if (payload.discountPercent !== "" && payload.discountPercent !== undefined)
            cleanPayload.discountPercent = Number(payload.discountPercent);
        if (payload.isDefault !== undefined)
            cleanPayload.isDefault = payload.isDefault === 'true';

        await variant.update(cleanPayload);

        return { err: 0, msg: 'Variant updated successfully' };
    } catch (error) {
        throw error;
    }
};

export const deleteVariantService = async (variantId) => {
    try {
        const variant = await db.ProductVariant.findByPk(variantId);
        if (!variant) return { err: 1, msg: 'Variant not found!' };

        await variant.destroy();
        return { err: 0, msg: 'Variant deleted successfully' };
    } catch (error) {
        throw error
    }
};
