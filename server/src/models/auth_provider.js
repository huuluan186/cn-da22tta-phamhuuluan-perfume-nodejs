import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class AuthProvider extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    AuthProvider.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       // tự định nghĩa khóa chính
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        provider: {
            type: DataTypes.ENUM('google', 'facebook'),
            allowNull: false,
            unique: 'unique_provider_user', // kết hợp với providerUserId
        },
        providerUserId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: 'unique_provider_user', // cùng constraint với provider
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,           // đảm bảo email không trùng
            validate: {
                isEmail: true,
            },
        },
        accessToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        refreshToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'AuthProvider', 
    });
    return AuthProvider;
};