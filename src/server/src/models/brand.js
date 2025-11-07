import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Brand extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 1 Brand có nhiều Product
            Brand.hasMany(models.Product, {
                foreignKey: 'brandId',
                as: 'products',
                onDelete: 'SET NULL',
            });
        }
    }
    Brand.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        logoUrl: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        posterUrl: { 
            type: DataTypes.STRING,
            allowNull: true,
            validate: { isUrl: true },
            comment: 'Ảnh poster hoặc banner thương hiệu'
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
            comment: 'Mô tả chi tiết thương hiệu'
        },

    },
    {
        sequelize,
        modelName: 'Brand',
        paranoid: true,         
        deletedAt: 'deletedAt',
    });
    return Brand;
};