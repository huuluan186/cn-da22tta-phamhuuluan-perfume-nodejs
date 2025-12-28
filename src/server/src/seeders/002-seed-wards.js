'use strict';
import fs from 'fs';
import path from 'path';

const slugify = (str) => {
    return String(str || '')
        .toLowerCase()
        .normalize('NFKD')             // chuẩn hóa ký tự có dấu
        .replace(/[\u0300-\u036f]/g, '') // bỏ dấu tiếng Việt
        .replace(/[^a-z0-9]+/g, '-')     // thay ký tự đặc biệt bằng dấu gạch ngang
        .replace(/(^-|-$)/g, '');        // bỏ dấu gạch đầu/cuối
};

export async function up(queryInterface, Sequelize) {
    // 📂 Đọc file stats.json
    const filePath = path.join(process.cwd(), 'data', 'stats.json'); 
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
