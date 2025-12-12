'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
        },
        userId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Users', 
                key: 'id',
            },
            onDelete: 'CASCADE'
        },
        addressId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Addresses',
                key: 'id'
            },
        },
        totalAmount: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
        },
        shippingFee: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
        },
        orderStatus: {
            type: Sequelize.ENUM('Pending', "Confirmed", 'Processing', 'Shipped', 'Completed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        paymentStatus: {
            type: Sequelize.ENUM('Pending', 'Confirmed', 'Completed', 'Paid', 'Failed', 'Refunded'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        paymentMethod: {
            type: Sequelize.ENUM('COD', 'ZaloPay'),
            allowNull: false,
            defaultValue: 'COD',
        },
        paymentGatewayData: {
            type: Sequelize.JSON,
            defaultValue: {},
            comment: 'Lưu app_trans_id, order_url, zp_trans_id... cho ZaloPay'
        },
        paymentTransactionId: {
            type: Sequelize.STRING(50),
            allowNull: true,
            comment: 'Mã giao dịch chính thức từ ZaloPay (zp_trans_id) để đối soát'
        },
        expiresAt: {
            type: Sequelize.DATE,
            allowNull: true,
            comment: 'Thời gian hết hạn thanh toán ZaloPay (15 phút). Dùng để cron tự hủy'
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        deletedAt: {
            type: Sequelize.DATE, 
            allowNull: true,
        },
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Orders');
}
