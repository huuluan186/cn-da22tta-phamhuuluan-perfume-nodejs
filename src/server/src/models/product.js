import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Nhiều Product thuộc 1 Brand
            Product.belongsTo(models.Brand, {
                foreignKey: 'brandId',
                as: 'brand',
                onDelete: 'SET NULL',
            });

            // Nhiều Product có thể thuộc nhiều Category (qua bảng trung gian)
            Product.belongsToMany(models.Category, {
                through: models.ProductCategory,
                foreignKey: 'productId',
                otherKey: 'categoryId',
                as: 'categories',
                onDelete: 'SET NULL',
            });

            // 1 sản phẩm có nhiều biến thể
            Product.hasMany(models.ProductVariant, {
                foreignKey: 'productId',
                as: 'variants',
                onDelete: 'CASCADE',
            });

            // 1 sản phẩm có nhiều ảnh
            Product.hasMany(models.ProductImage, {
                foreignKey: 'productId',
                as: 'images',
                onDelete: 'CASCADE',
            });

            Product.belongsToMany(models.User, {
                through: models.Favorite,
                foreignKey: 'productId',
                otherKey: 'userId',
                as: 'favoritedBy'
            });
        }
    }
    Product.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        brandId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        gender: {
            type: DataTypes.ENUM('nam', 'nữ', 'unisex'),
            allowNull: false,
        },
        origin: {
            type: DataTypes.STRING,
            allowNull: true,            
        },
        releaseYear: { 
            type: DataTypes.INTEGER, 
            allowNull: true, 
            comment: 'Năm phát hành' 
        },
        fragranceGroup: { 
            type: DataTypes.STRING, 
            allowNull: true, 
            comment: 'Nhóm hương chính, ví dụ: Gỗ đàn hương, Olibanum, Cam bergamot' 
        },
        style: { 
            type: DataTypes.STRING, 
            allowNull: true, 
            comment: 'Phong cách: Lịch lãm, Nam tính, Lôi cuốn' 
        },
        scentNotes: { 
            type: DataTypes.TEXT('medium'), 
            allowNull: true, 
            comment: 'Hương đầu, giữa, cuối – có thể là JSON string hoặc text' 
        },
        description: {
            type: DataTypes.TEXT('long'), 
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Product',
        paranoid: true,         
        deletedAt: 'deletedAt',
    });
    return Product;
};