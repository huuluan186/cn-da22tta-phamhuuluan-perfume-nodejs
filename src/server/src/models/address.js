import { Model } from 'sequelize';
import { validateAddressByCountry } from '../validations/addressValidation.js'; 

export default (sequelize, DataTypes) => {
    class Address extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 1 Address thuộc về 1 User
            Address.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',
            });

            // 1 Address thuộc về 1 Ward
            Address.belongsTo(models.Ward, {
                foreignKey: 'wardId',
                as: 'ward',
            });

        }
    }
    Address.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        receiverName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        addressLine: {
            type: DataTypes.STRING,
            allowNull: false, // số nhà, tên đường
        },
        wardId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isDefault: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        sortOrder: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
    },
    {
        sequelize,
        modelName: 'Address',
        paranoid: true,       
        deletedAt: 'deletedAt', 
        validate: {
            validateByCountry() {
                validateAddressByCountry(this);
            }
        }
    });
    return Address;
};