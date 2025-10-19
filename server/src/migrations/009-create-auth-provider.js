'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('AuthProviders', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
        },
        userId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            },
            onDelete: "CASCADE"
        },
        provider: {
            type: Sequelize.ENUM('google', 'facebook'),
            allowNull: false,
        },
        providerUserId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        accessToken: {
            type: Sequelize.TEXT('long'),
            allowNull: true,
        },
        refreshToken: {
            type: Sequelize.TEXT('long'),
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
    });

    // ✅ Tạo unique constraint kết hợp giữa provider và providerUserId
    await queryInterface.addConstraint('AuthProviders', {
        fields: ['provider', 'providerUserId'],
        type: 'unique',
        name: 'unique_provider_user',
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('AuthProviders', 'unique_provider_user');
    await queryInterface.dropTable('AuthProviders');
}
