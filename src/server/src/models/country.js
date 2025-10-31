import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Country extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 1 Country có nhiều Province
            Country.hasMany(models.Province, {
                foreignKey: 'countryId',
                as: 'provinces',
                onDelete: 'CASCADE',
            });
        }
    }
    Country.init({
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,       
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Country',
    });
    return Country;
};