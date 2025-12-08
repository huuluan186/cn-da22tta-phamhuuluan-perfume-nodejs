import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
    class Order extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Order.belongsTo(models.User, { 
                foreignKey: 'userId', 
                as: 'user' 
            });

            Order.hasMany(models.OrderItem, { 
                foreignKey: 'orderId', 
                as: 'orderItems', 
                onDelete: 'CASCADE' 
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
        totalAmount: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
        },
        shippingFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        orderStatus: { //trạng thái xử lý đơn hàng
            type: DataTypes.ENUM("Pending", "Processing", "Shipped", "Completed", "Cancelled"),
            defaultValue: "Pending",
        },
        paymentStatus: { //trạng thái thanh toán
            type: DataTypes.ENUM("Pending", "Confirmed", "Completed", "Paid", "Failed", "Refunded"),
            defaultValue: "Pending",
        },
        paymentMethod: { //phương thức thanh toán
            type: DataTypes.ENUM("COD", "ZaloPay"),
            defaultValue: "COD",
        },
        paymentGatewayData: {
            type: DataTypes.JSON,
            defaultValue: {},
            comment: 'Lưu app_trans_id, order_url, zp_trans_id... cho ZaloPay'
        },
        paymentTransactionId: {
            type: DataTypes.STRING(50),
            allowNull: true,
            comment: 'Mã giao dịch chính thức từ ZaloPay (zp_trans_id) để đối soát'
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: true,
            comment: 'Thời gian hết hạn thanh toán ZaloPay (15 phút). Dùng để cron tự hủy'
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