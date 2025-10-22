'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductVariants', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        productId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Products',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        sku: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true,
        },
        volume: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        price: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
        },
        originalPrice: {
            type: Sequelize.DECIMAL(12, 2),
            allowNull: false,
        },
        discountPercent: {
            type: Sequelize.FLOAT, 
            allowNull: true,
        },
        stockQuantity: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        soldQuantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        weight: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
        },
        isDefault: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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
    await queryInterface.dropTable('ProductVariants');
}
