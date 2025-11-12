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
                key: 'id',
            },
            onDelete: 'CASCADE',
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
        status: {
            type: Sequelize.ENUM('Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        paymentStatus: {
            type: Sequelize.ENUM('Pending', 'Paid', 'Failed', 'Refunded'),
            allowNull: false,
            defaultValue: 'Pending',
        },
        paymentMethod: {
            type: Sequelize.ENUM('COD', 'CreditCard', 'BankTransfer', 'Paypal'),
            allowNull: false,
            defaultValue: 'COD',
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
