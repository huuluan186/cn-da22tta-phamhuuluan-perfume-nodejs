import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // 1 Order thuộc về 1 User
            Order.belongsTo(models.User, {
                foreignKey: 'userId',
                as: 'user',           
                onDelete: 'CASCADE',
            });
        }
    }
    Order.init({
        id: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,       
        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        addressId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        couponId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        totalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        status: { //trạng thái xử lý đơn hàng
            type: DataTypes.ENUM("Pending", "Processing", "Shipped", "Completed", "Cancelled"),
            defaultValue: "Pending",
        },
        paymentStatus: { //trạng thái thanh toán
            type: DataTypes.ENUM("Pending", "Paid", "Failed", "Refunded"),
            defaultValue: "Pending",
        },
        paymentMethod: { //phương thức thanh toán
            type: DataTypes.ENUM("COD", "CreditCard", "BankTransfer", "Paypal"),
            defaultValue: "COD",
        },
    },
    {
        sequelize,
        modelName: 'Order',
        paranoid: true,
        deletedAt: 'deletedAt',
    });
    return Order;
};