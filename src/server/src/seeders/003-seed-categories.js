'use strict';
import fs from 'fs';
import path from 'path';

export async function up(queryInterface, Sequelize) {
    //const filePath = path.resolve('./data/categories.json');
    const filePath = path.join(process.cwd(), 'data', 'categories.json'); 
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const now = new Date();

    const categories = data.map(item => ({
        id: item.id, 
        name: item.name,
        slug: item.slug,
        parentId: item.parentId,
        sortOrder: item.sortOrder || 0,
        createdAt: now,
        updatedAt: now,
        deletedAt: null
    }));

    await queryInterface.bulkInsert('Categories', categories);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Categories', null, {});
}
