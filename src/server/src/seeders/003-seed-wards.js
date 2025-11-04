'use strict';
import fs from 'fs';
import path from 'path';
import { slugify } from '../utils/index.js';

export async function up(queryInterface, Sequelize) {
  // 📂 Đọc file stats.json
  const filePath = path.resolve('./data/stats.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // 🏘️ Chuẩn bị dữ liệu phường/xã
  const wards = (data.wards || []).map((w) => ({
    id: w.id,
    provinceId: w.id_province,
    name: w.name,
    slug: slugify(w.name),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  if (wards.length) {
    // Chia batch 1000 dòng để tránh quá tải
    const BATCH = 1000;
    for (let i = 0; i < wards.length; i += BATCH) {
      const chunk = wards.slice(i, i + BATCH);
      await queryInterface.bulkInsert('Wards', chunk, {});
      console.log(`✅ Inserted wards ${i + 1}–${i + chunk.length}`);
    }
    console.log(`✅ Tổng cộng seeded ${wards.length} wards`);
  } else {
    console.log('⚠️ Không có dữ liệu wards trong stats.json.');
  }
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('Wards', null, {});
}
