'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        orderItemId: { 
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'OrderItems',
                key: 'id',
            },
            onDelete: 'CASCADE',
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
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        content: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        rating: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
        },
    });
}
export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Reviews');
}
