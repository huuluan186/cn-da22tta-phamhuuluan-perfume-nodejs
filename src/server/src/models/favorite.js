import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Favorite extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Favorite.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
            Favorite.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
        }
    }
    Favorite.init({
        productId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
        },
    },
    {
        sequelize,
        modelName: 'Favorite',
        timestamps: true
    });
    return Favorite;
};