import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Category extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Quan hệ N-N với Product
            Category.belongsToMany(models.Product, {
                through: models.ProductCategory,
                foreignKey: 'categoryId',
                otherKey: 'productId',
                as: 'products',
                onDelete: 'CASCADE',
            });

            // Self-reference: 1 Category có thể có nhiều Category con
            Category.hasMany(models.Category, {
                foreignKey: 'parentId',
                as: 'subcategories',
                onDelete: 'SET NULL',
            });

            // Mỗi Category con thuộc 1 Category cha
            Category.belongsTo(models.Category, {
                foreignKey: 'parentId',
                as: 'parent',
                onDelete: 'SET NULL',
            });
        }
    }
    Category.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        parentId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Category',
        paranoid: true,         
        deletedAt: 'deletedAt',
    });
    return Category;
};