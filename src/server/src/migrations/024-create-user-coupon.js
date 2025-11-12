'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserCoupons', {
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
            onDelete: 'CASCADE',
        },
        couponId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Coupons', 
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        usedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        status: {
            type: Sequelize.ENUM('unused', 'used', 'expired'),
            defaultValue: 'unused',
        },
        validFrom: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        validUntil: {
            type: Sequelize.DATE,
            allowNull: true,
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
    });

    // Ngăn trùng lặp sản phẩm – danh mục
    await queryInterface.addConstraint('UserCoupons', {
        fields: ['userId', 'couponId'],
        type: 'unique',
        name: 'unique_user_coupon',
    });
}
export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserCoupons');
}
