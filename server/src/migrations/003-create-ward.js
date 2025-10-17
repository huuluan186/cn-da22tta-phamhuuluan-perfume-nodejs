'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Wards', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.INTEGER,
        },
        provinceId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'Provinces',
                key: 'id',
            },
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        slug: {
            type: Sequelize.STRING,
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
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Wards');
}
