'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
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
        label: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        receiverName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        addressLine:{
            type: Sequelize.STRING,
            allowNull: false,
        },
        wardId: {
            type: Sequelize.STRING,
            allowNull: true,
            references: {
                model: 'Wards',
                key: 'id'
            },
            onDelete: 'SET NULL'
        },
        zipCode: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        isDefault: {
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
        deletedAt: {
            type: Sequelize.DATE, 
            allowNull: true,
        },
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Addresses');
}
