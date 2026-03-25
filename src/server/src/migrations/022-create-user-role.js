'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserRoles', {
        userId: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Users', 
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        roleId: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
            references: {
                model: 'Roles', 
                key: 'id',
            },
            onDelete: 'CASCADE',
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
    await queryInterface.dropTable('UserRoles');
}
