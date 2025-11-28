'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductCategories', {
        productId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Products', 
                key: 'id',
            },
            onDelete: 'CASCADE',
        },
        categoryId: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
                model: 'Categories', 
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

    // Ngăn trùng lặp sản phẩm – danh mục
    await queryInterface.addConstraint('ProductCategories', {
        fields: ['productId', 'categoryId'],
        type: 'primary key',
        name: 'pk_product_category',
    });
}
export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductCategories');
}
