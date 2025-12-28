'use strict';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export async function up(queryInterface, Sequelize) {
    const usersFile = path.join(process.cwd(), 'data', 'userAdmin.json');
    const admins = JSON.parse(fs.readFileSync(usersFile, 'utf8'));

    // 1️⃣ Lấy tất cả roles từ DB
    const rolesInDB = await queryInterface.sequelize.query(
        'SELECT * FROM `Roles`;',
        { type: Sequelize.QueryTypes.SELECT }
    );

    const roleMap = {};
    rolesInDB.forEach(r => { roleMap[r.name] = r.id; });
    
    // 2️⃣ Tạo Users với UUID động
    const usersData = await Promise.all(admins.map(async admin => ({
        id: uuidv4(),               // UUID động
        firstname: admin.firstname,
        lastname: admin.lastname,
        email: admin.email,
        gender: admin.gender || null,
        password: await bcrypt.hashSync(admin.password, bcrypt.genSaltSync(12)),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null
    })));

    await queryInterface.bulkInsert('Users', usersData, {});

    // 3️⃣ Tạo UserRoles
    const userRolesData = usersData.map(user => {
        const adminJSON = admins.find(a => a.email === user.email);
        return {
            userId: user.id,
            roleId: roleMap[adminJSON.role],
            createdAt: new Date(),
            updatedAt: new Date()
        };
    });

    await queryInterface.bulkInsert('UserRoles', userRolesData, {});
}

export async function down(queryInterface, Sequelize) {
    const admins = JSON.parse(fs.readFileSync('./data/userAdmin.json', 'utf8'));
    const emails = admins.map(a => a.email);

    if (!emails.length) return;

    const users = await queryInterface.sequelize.query(
        `
        SELECT id 
        FROM \`Users\` 
        WHERE email IN (${emails.map(e => `'${e}'`).join(",")})
        `,
        { type: Sequelize.QueryTypes.SELECT }
    );

    const userIds = users.map(u => u.id);

    if (userIds.length) {
        await queryInterface.bulkDelete('UserRoles', {
            userId: userIds
        });

        await queryInterface.bulkDelete('Users', {
            id: userIds
        });
    }
}
