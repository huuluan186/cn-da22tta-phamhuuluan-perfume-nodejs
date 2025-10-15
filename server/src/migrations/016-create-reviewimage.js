'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReviewImages', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        reviewId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Reviews',
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        url: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        sortOrder: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
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
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReviewImages');
}
