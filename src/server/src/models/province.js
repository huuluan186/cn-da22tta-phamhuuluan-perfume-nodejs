import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Province extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 1 Province có nhiều Ward
            Province.hasMany(models.Ward, {
                foreignKey: 'provinceId',
                as: 'wards',
                onDelete: 'CASCADE',
            });
        }
    }
    Province.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,       
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
        modelName: 'Province',
    });
    return Province;
};