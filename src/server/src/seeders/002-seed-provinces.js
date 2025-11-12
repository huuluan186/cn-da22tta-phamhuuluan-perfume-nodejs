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
    try {
        // 📂 Đọc file stats.json
        const filePath = path.resolve('./data/stats.json'); // hoặc './src/data/stats.json'
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);

        const [countryRows] = await queryInterface.sequelize.query(
            `SELECT id FROM Countries WHERE code = 'VN'`
        );
        if (!countryRows.length) {
            throw new Error('❌ Không tìm thấy quốc gia Việt Nam (code="VN") trong bảng Countries.');
        }

        const vnId = countryRows[0].id;

        // 📍 Chuẩn bị dữ liệu provinces
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
        } else console.log('⚠️ Không có dữ liệu provinces trong stats.json.');
        
    } catch (err) {
        console.error('❌ Lỗi khi seed Provinces:', err);
        throw err;
    }
}

export async function down(queryInterface, Sequelize) {
    try {
        await queryInterface.bulkDelete('Provinces', null, {});
        console.log('✅ Xóa dữ liệu Provinces thành công');
    } catch (err) {
        console.error('❌ Lỗi khi xóa dữ liệu Provinces:', err);
        throw err;
    }
}
