'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Coupons', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
        },
        code: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        discountType: {
            type: Sequelize.ENUM('percentage', 'fixed'),
            allowNull: false,
            defaultValue: 'percentage',
        },
        discountValue: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
        },
        expiredAt: {
            type: Sequelize.DATE,
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
    await queryInterface.dropTable('Coupons');
}
