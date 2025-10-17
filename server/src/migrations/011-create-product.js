'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        brandId: {
            type: Sequelize.STRING,
            allowNull: true,
            references: {
                model: 'Brands',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        categoryId: {
            type: Sequelize.STRING,
            allowNull: true,
            references: {
                model: 'Categories',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        gender: {
            type: Sequelize.ENUM('nam', 'nữ', 'unisex'),
            allowNull: false,
        },
        origin: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        description:{
            type: Sequelize.TEXT('long'),
            allowNull: true,
        },
        shortDescription: {
            type: Sequelize.TEXT('tiny'),
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
        deletedAt: {
            type: Sequelize.DATE, 
            allowNull: true,
        },
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
}