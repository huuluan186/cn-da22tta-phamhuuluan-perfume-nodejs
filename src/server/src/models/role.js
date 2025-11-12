import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Role extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // Nhiều Role có thể thuộc về nhiều User (qua bảng UserRole)
            Role.belongsToMany(models.User, {
                through: models.UserRole,
                foreignKey: 'roleId',
                otherKey: 'userId',
                as: 'users',
                onDelete: 'CASCADE',
            });
        }
    }
    Role.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            defaultValue: 'customer',
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: 'Role',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return Role;
};