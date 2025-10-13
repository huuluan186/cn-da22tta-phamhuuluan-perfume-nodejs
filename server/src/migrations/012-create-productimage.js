'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductImages', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
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
        url: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isThumbnail: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductImages');
}
