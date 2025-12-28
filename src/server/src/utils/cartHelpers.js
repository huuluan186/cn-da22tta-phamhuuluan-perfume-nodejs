import db from '../models/index.js';
import { nanoid } from 'nanoid';

export const getOrCreateCart = async (userId) => {
    let cart = await db.Cart.findOne({ where: { userId } });

    if (!cart) {
        cart = await db.Cart.create({
            id: nanoid(4),
            userId
        });
    }

    return cart;
};
