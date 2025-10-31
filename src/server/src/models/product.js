import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
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
        categoryId: {
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
        description: {
            type: DataTypes.TEXT('long'), 
            allowNull: true,
        },
        shortDescription: {
            type: DataTypes.TEXT('tiny'),
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