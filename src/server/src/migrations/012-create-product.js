'use strict';

export async function up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
        id: {
            type: Sequelize.STRING,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        brandId: {
            type: Sequelize.STRING,
            allowNull: true,
            references: {
                model: 'Brands',
                key: 'id',
            },
            onDelete: 'SET NULL',
        },
        gender: {
            type: Sequelize.ENUM('nam', 'nữ', 'unisex'),
            allowNull: false,
            defaultValue: 'unisex'
        },
        origin: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        releaseYear: { 
            type: Sequelize.INTEGER, 
            allowNull: true, 
            comment: 'Năm phát hành' 
        },
        fragranceGroup: { 
            type: Sequelize.STRING, 
            allowNull: true, 
            comment: 'Nhóm hương chính, ví dụ: Gỗ đàn hương, Olibanum, Cam bergamot' 
        },
        style: { 
            type: Sequelize.STRING, 
            allowNull: true, 
            comment: 'Phong cách: Lịch lãm, Nam tính, Lôi cuốn' 
        },
        scentNotes: { 
            type: Sequelize.TEXT('medium'), 
            allowNull: true, 
            comment: 'Hương đầu, giữa, cuối – có thể là JSON string hoặc text' 
        },
        description:{
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
        deletedAt: {
            type: Sequelize.DATE, 
            allowNull: true,
        },
    });
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Products');
}