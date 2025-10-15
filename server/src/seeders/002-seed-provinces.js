'use strict';
import fs from 'fs';
import path from 'path';

function slugify(str) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function up(queryInterface, Sequelize) {
  // 📂 Đọc file stats.json
  const filePath = path.resolve('./data/stats.json'); // em có thể đổi thành src/data/stats.json nếu để trong src
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // 🇻🇳 Lấy id của Việt Nam trong bảng Countries
  const [countryRows] = await queryInterface.sequelize.query(
    `SELECT id FROM Countries WHERE code = 'VN'`
  );
  if (!countryRows.length) {
    throw new Error('❌ Không tìm thấy quốc gia Việt Nam (code="VN") trong bảng Countries.');
  }

  const vnId = countryRows[0].id;

  // 📍 Chuẩn bị dữ liệu tỉnh
  const provinces = (data.provinces || []).map((p) => ({
    id: p.id,
    name: p.name,
    slug: slugify(p.name),
    countryId: vnId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  if (provinces.length) {
    await queryInterface.bulkInsert('Provinces', provinces, {});
    console.log(`✅ Seeded ${provinces.length} provinces (countryId=${vnId})`);
  } else {
    console.log('⚠️ Không có dữ liệu provinces trong stats.json.');
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Provinces', null, {});
}
