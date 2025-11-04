'use strict';
import fs from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

export async function up(queryInterface, Sequelize) {
    const filePath = path.resolve('./data/brands.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const now = new Date();

    const brands = data.map(item => ({
        id: nanoid(10), 
        name: item.name,
        country: item.country,
        logoUrl: item.logoUrl,
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
