'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Provinces', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        slug: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        countryId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Countries', 
                key: 'id',
            },
            onDelete: 'CASCADE', 
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
    await queryInterface.dropTable('Provinces');
}