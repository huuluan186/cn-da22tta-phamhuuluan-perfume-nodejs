'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('CartItems', {
        id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.STRING,
        },
        cartId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Carts',     
                key: 'id',
            },
            onDelete: 'CASCADE', 
        },
        productVariantId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'ProductVariants',     
                key: 'id',
            },
            onDelete: 'CASCADE', 
        },
        quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValues: 1,
        },
        priceAtTime: {
            type: Sequelize.DECIMAL(12,2),
            allowNull: false,
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

    await queryInterface.addConstraint('CartItems', {
        fields: ['cartId', 'productVariantId'],
        type: 'unique',
        name: 'unique_cart_product_variant',
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CartItems');
}
