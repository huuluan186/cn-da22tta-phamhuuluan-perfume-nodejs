import db from '../models/index.js'
import { nanoid } from 'nanoid';

export const getMyAddressesService = async (userId) => {
    try {
        const user = await db.User.findByPk(userId)
        if(!user) return { err: 1, msg: 'User not found!' }
    
        const result = await db.Address.findAndCountAll({
            where: { userId },
            include: [
                {
                    model: db.Ward, 
                    as: 'ward',
                    include: [
                        {
                            model: db.Province,
                            as: 'province'
                        }
                    ]

                }
            ],
            order: [['createdAt', 'ASC']]
        })

        return {
            err: 0,
            msg: 'Get user addresses successfully!',
            response: result
        }
    } catch (error) {
        throw error;
    }
}

export const addUserAddressService = async (addressData) => {
    try {
        const { userId, receiverName, phone, addressLine, wardId, label, isDefault, zipCode } = addressData;
        
        const user = await db.User.findByPk(userId)
        if(!user) return { err: 1, msg: 'User not found!' }
        
        // Kiểm tra ward và lấy thông tin liên quan
        let wardData = null;
        if (wardId) {
            wardData = await db.Ward.findByPk(wardId, {
                include: [
                    {
                        model: db.Province,
                        as: 'province',
                    },
                ],
            });
            if (!wardData) {
                return {
                    err: 1,
                    msg: 'Ward not found!'
                }
            }
        }

        // Nếu isDefault = true, đặt các địa chỉ khác của user thành isDefault = false
        if (isDefault) {
            await db.Address.update(
                { isDefault: false },
                { where: { userId, isDefault: true } }
            );
        }

        // Tạo địa chỉ mới
        const address = await db.Address.create({
            id: nanoid(4),
            userId,
            receiverName,
            phone,
            addressLine,
            wardId: wardData ? wardData.id : null,
            label,
            isDefault: isDefault || false,
            zipCode,
            sortOrder: 0,
        });

        // Chuẩn bị dữ liệu trả về
        const responseData = {
            ...address.get(),
            wardName: wardData ? wardData.name : null,
            province: wardData?.province
                ? {
                    id: wardData.province.id,
                    name: wardData.province.name,
                    slug: wardData.province.slug,
                }
                : null,
            country: wardData?.province?.country
                ? {
                    id: wardData.province.country.id,
                    name: wardData.province.country.name,
                    code: wardData.province.country.code,
                }
                : null,
        };

        return {
            err: 0,
            msg: 'Address added successfully',
            response: responseData
        }

    } catch (error) {
        throw error
    }
}

export const updateUserAddressService = async (addressId, userId, updateData) => {
    try {
        const { receiverName, phone, addressLine, wardId, label, isDefault, zipCode } = updateData;

        const user = await db.User.findByPk(userId);
        if(!user) return {err: 1, msg: "User not found!"};

        // Kiểm tra address thuộc user này không?
        const address = await db.Address.findOne({ where: { id: addressId, userId } });
        if (!address) return { err: 1, msg: 'Address not found or not owned by user!' };

        let wardData = null;
        if (wardId) {
            wardData = await db.Ward.findByPk(wardId, {
                include: [
                    {
                        model: db.Province,
                        as: 'province',
                    },
                ],
            });
            if (!wardData) return { err: 1, msg: 'Ward not found!' };
        }else {
            //Nếu không truyền wardId, lấy ward cũ theo address.wardId
            wardData = await db.Ward.findByPk(address.wardId, {
                include: [
                    {
                        model: db.Province, 
                        as: 'province'
                    },
                ],
            });
        }

        // Nếu isDefault = true, đặt các địa chỉ khác của user thành isDefault = false
        if (isDefault) {
            await db.Address.update(
                { isDefault: false },
                { where: { userId, isDefault: true } }
            );
        }
            
        // Cập nhật địa chỉ
        await address.update({
            receiverName: receiverName ?? address.receiverName,
            phone: phone ?? address.phone,
            addressLine: addressLine ?? address.addressLine,
            wardId: wardData ? wardData.id : address.wardId,
            label: label ?? address.label,
            isDefault: isDefault ?? address.isDefault,
            zipCode: zipCode ?? address.zipCode,
        });

        // Chuẩn bị dữ liệu trả về
        const responseData = {
            ...address.get(),
            wardName: wardData ? wardData.name : null,
            province: wardData?.province
                ? {
                    id: wardData.province.id,
                    name: wardData.province.name,
                    slug: wardData.province.slug,
                }
                : null
        };

        return {
            err: 0,
            msg: 'Address updated successfully',
            response: responseData,
        };

    } catch (error) {
        throw error
    }
}

export const deleteUserAddressService = async (userId, addressId) => {
    try {
        const address = await db.Address.findOne({
            where: { id: addressId, userId }
        });
        if(!address) return { err: 1, msg: 'Address not found!' };

        if (address.isDefault) return { err: 1, msg: 'Cannot delete the default address!' };

        await address.destroy(); //xóa mềm do có định nghĩa paranoid trong model

        return {
            err: 0,
            msg: 'Address deleted successfully',
        };

    } catch (error) {
        throw error;
    }
}