'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Brands', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        country: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        logoUrl: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        posterUrl: {
            type: Sequelize.STRING,
            allowNull: true,
            validate: { isUrl: true },
        },
        description: {
            type: Sequelize.TEXT,
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
    await queryInterface.dropTable('Brands');
}
