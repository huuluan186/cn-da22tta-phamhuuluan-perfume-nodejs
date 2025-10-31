import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Brand extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
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
        }

    },
    {
        sequelize,
        modelName: 'Brand',
        paranoid: true,         
        deletedAt: 'deletedAt',
    });
    return Brand;
};