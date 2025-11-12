import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class UserRole extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    UserRole.init({
        roleId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true
        },
    },
    {
        sequelize,
        modelName: 'UserRole',
    });
    return UserRole;
};