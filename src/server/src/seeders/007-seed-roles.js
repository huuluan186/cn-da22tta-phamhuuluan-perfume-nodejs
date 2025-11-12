'use strict';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export async function up(queryInterface, Sequelize) {
    const roles = JSON.parse(fs.readFileSync('./data/roles.json', 'utf8'));

    // Tạo dữ liệu với UUID động
    const rolesData = roles.map(role => ({
        id: uuidv4(),
        name: role.name,
        description: role.description,
        createdAt: new Date(),
        updatedAt: new Date(),
    }));

    //Insert batch (ở đây ít nên chỉ insert 1 lần)
    await queryInterface.bulkInsert('Roles', rolesData, {});
}

export async function down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', null, {});
}
