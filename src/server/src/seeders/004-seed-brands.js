'use strict';
import fs from 'fs';
import path from 'path';

export async function up(queryInterface, Sequelize) {
    //const filePath = path.resolve('./data/brands.json');
    const filePath = path.join(process.cwd(), 'data', 'brands.json'); 
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const now = new Date();

    const brands = data.map(item => ({
        id: item.id, 
        name: item.name,
        country: item.country,
        logoUrl: item.logoUrl,
        description: item.description || '',
        posterUrl: item.posterUrl || '',
        createdAt: now,
        updatedAt: now,
        deletedAt: null
    }));

    await queryInterface.bulkInsert('Brands', brands, {});
    console.log(`✅ Seeded ${brands.length} brands successfully`);
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Brands', null, {});
}
