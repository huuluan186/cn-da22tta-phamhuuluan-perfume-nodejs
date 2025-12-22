import db from "../models/index.js";
import { nanoid } from 'nanoid';

export const addProductImagesService = async (productId, images = []) => {
    try {
        if (!images.length) return { err: 0, msg: 'No images added' };
    
        await db.ProductImage.bulkCreate(
            images.map((url, index) => ({
                id: nanoid(4),
                productId,
                url,
                isThumbnail: index===0,
                sortOrder: index,
            }))
        );
    
        return { err: 0, msg: 'Images added successfully' };
    } catch (error) {
        throw error
    }
};

export const deleteProductImageService = async (imageId) => {
    try {
        const image = await db.ProductImage.findByPk(imageId);
        if (!image) return { err: 1, msg: 'Image not found!' };
    
        await image.destroy();
        return { err: 0, msg: 'Image deleted successfully' };
    } catch (error) {
        throw error;
    }
};

export const setThumbnailService = async (productId, imageId) => {
  try {
    // Kiểm tra ảnh có thuộc product không
    const image = await db.ProductImage.findOne({
      where: { id: imageId, productId }
    });

    if (!image) {
      return { err: 1, msg: "Image not found or does not belong to this product" };
    }

    // Transaction để đảm bảo atomic
    await db.sequelize.transaction(async (t) => {
      // Reset tất cả thumbnail của product này về false
      await db.ProductImage.update(
        { isThumbnail: false },
        { where: { productId }, transaction: t }
      );

      // Set ảnh được chọn làm thumbnail
      await db.ProductImage.update(
        { isThumbnail: true },
        { where: { id: imageId }, transaction: t }
      );
    });

    return { err: 0, msg: "Thumbnail updated successfully" };
  } catch (error) {
    throw error; 
  }
};
