'use strict';
import fs from 'fs';
import path from 'path';
import { v4 } from 'uuid';
import { nanoid } from 'nanoid';

export async function up(queryInterface, Sequelize) {
    const dataPath = path.resolve('./data/products.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const products = JSON.parse(rawData);

    const now = new Date();
    const productRecords = [];
    const imageRecords = [];
    const variantRecords = [];
    const productCategoryRecords = [];

    for (const product of products) {
        const productId = v4();
        // Bảng Products
        productRecords.push({
            id: productId,
            name: product.name || '',
            brandId: product.brandId || null,
            gender: product.gender || 'unisex',
            origin: product.origin || '',
            releaseYear: product.releaseYear ?? null,
            fragranceGroup: product.fragranceGroup || '',
            style: product.style || '',
            scentNotes: product.scentNotes || '',
            description: product.description || '',
            createdAt: now,
            updatedAt: now
        });

        // Bảng ProductImages
        const images = product.images ?? [];
        for (const img of images) {
            imageRecords.push({
                id: nanoid(4),
                productId,
                url: img.url || '',
                isThumbnail: img.isThumbnail ?? false,
                sortOrder: img.sortOrder ?? 0,
                createdAt: now,
                updatedAt: now
            });
        }

        // Bảng ProductVariants
        const variants = product.variants ?? [];
        for (const v of variants) {
            const discount = v.discountPercent ?? 0;
            const price = v.originalPrice != null 
                            ? v.originalPrice * (1 - discount / 100)
                            : 0;

            variantRecords.push({
                id: nanoid(4),
                productId,
                sku: `#${Date.now().toString(36).toUpperCase()}${nanoid(4).toUpperCase()}`,
                volume: v.volume ?? 0,
                originalPrice: v.originalPrice ?? 0,
                discountPercent: discount,
                price,
                stockQuantity: v.stockQuantity ?? 0,
                soldQuantity: v.soldQuantity ?? 0,
                weight: v.weight ?? 1,
                isDefault: v.isDefault ?? false,
                createdAt: now,
                updatedAt: now
            });
        }

        const categoryIds = Array.isArray(product.categoryId)
            ? [...new Set(product.categoryId.filter(Boolean))]  // loại bỏ null/undefined, tránh trùng
            : (product.categoryId ? [product.categoryId] : []);

        for (const categoryId of categoryIds) {
            productCategoryRecords.push({
                productId,
                categoryId, // giờ là string, không phải mảng
                createdAt: now,
                updatedAt: now
            });
        }
    }

    // Thêm dữ liệu vào DB
    if (productRecords.length) await queryInterface.bulkInsert('Products', productRecords);
    if (imageRecords.length) await queryInterface.bulkInsert('ProductImages', imageRecords);
    if (variantRecords.length) await queryInterface.bulkInsert('ProductVariants', variantRecords);
    if (productCategoryRecords.length) await queryInterface.bulkInsert('ProductCategories', productCategoryRecords); 
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductImages', null, {});
    await queryInterface.bulkDelete('ProductVariants', null, {});
    await queryInterface.bulkDelete('ProductCategories', null, {});
    await queryInterface.bulkDelete('Products', null, {});
}
