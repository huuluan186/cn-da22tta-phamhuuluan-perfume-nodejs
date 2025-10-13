'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('OrderItems', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
        },
        orderId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Orders',
                key: 'id'
            },
            onDelete: 'CASCADE'
        },
        productVariantId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'ProductVariants',
                    key: 'id'
            },
            onDelete: 'CASCADE'
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValues: 1
        },
        priceAtOrder: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
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
    await queryInterface.dropTable('OrderItems');
}
