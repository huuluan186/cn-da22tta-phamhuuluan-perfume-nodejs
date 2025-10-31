import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Ward extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 1 Ward thuộc về 1 Province
            Ward.belongsTo(models.Province, {
                foreignKey: 'provinceId',
                as: 'province',
            });

            // 1 Ward có nhiều Address
            Ward.hasMany(models.Address, {
                foreignKey: 'wardId',
                as: 'addresses',
                onDelete: 'SET NULL',
            });
        }
    }
    Ward.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,       
        },
        provinceId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'Ward',
    });
    return Ward;
};