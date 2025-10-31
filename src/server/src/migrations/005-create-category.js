'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Categories', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        slug: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        parentId: {
            type: Sequelize.STRING,
            allowNull: true,
            references: {
                model: 'Categories',
                key: 'id'
            },
            onDelete: 'SET NULL'
        },
        sortOrder: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
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
    await queryInterface.dropTable('Categories');
}
