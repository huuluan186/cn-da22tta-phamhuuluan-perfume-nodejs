'use strict';
import fs from 'fs';

export async function up(queryInterface, Sequelize) {
  const countries = JSON.parse(fs.readFileSync('./data/countries.json', 'utf8'));
  const records = countries.map(item => ({
    id: item.id,
    name: item.name,
    code: item.code,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await queryInterface.bulkInsert('Countries', records);
  console.log(`✅ Seeded ${records.length} countries`);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Countries', null, {});
}
