import db from '../models/index.js';
import { nanoid } from 'nanoid';
import { getPagination, formatPaginatedResponse } from '../utils/index.js';

export const createContactService = async ({ name, email, message }) => {
    try {
        const newContact = await db.Contact.create({
            id: nanoid(4),
            name,
            email,
            message,
            status: 'new'
        });

        return {
            err: 0,
            msg: 'Contact message sent successfully!',
            contact: newContact
        };
    } catch (error) {
        throw error;
    }
};

// Lấy danh sách contacts với phân trang (Admin)
export const getAllContactsService = async (query = {}) => {
    try {
        const { page, limit, status } = query;
        const { offset, limitNum, pageNum, hasPagination } = getPagination(page, limit);

        const where = {};
        if (status) where.status = status;

        const { rows, count } = await db.Contact.findAndCountAll({
            where,
            paranoid: false,
            order: [['createdAt', 'DESC']],
            offset: hasPagination ? offset : undefined,
            limit: hasPagination ? limitNum : undefined
        });

        return {
            err: 0,
            msg: 'Fetch contacts successfully!',
            response: formatPaginatedResponse(rows, count, hasPagination ? pageNum : null, hasPagination ? limitNum : null)
        };
    } catch (error) {
        throw error;
    }
};

// Cập nhật trạng thái contact
export const updateContactStatusService = async (contactId, status) => {
    try {
        const contact = await db.Contact.findByPk(contactId);
        if (!contact) {
            return { err: 1, msg: 'Contact not found' };
        }

        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ['new', 'replied', 'ignored'];
        if (!validStatuses.includes(status)) {
            return { err: 1, msg: 'Invalid status value' };
        }

        await contact.update({ status });
        return { err: 0, msg: 'Contact status updated successfully', contact };
    } catch (error) {
        throw error;
    }
};

// Lấy chi tiết một contact (Admin)
export const getContactDetailService = async (contactId) => {
    try {
        const contact = await db.Contact.findByPk(contactId, {
            paranoid: false // lấy cả contact đã xóa
        });

        if (!contact) {
            return { err: 1, msg: 'Contact not found' };
        }

        return {
            err: 0,
            msg: 'Get contact detail successfully',
            response: contact
        };
    } catch (error) {
        throw error;
    }
};

// Xóa mềm contact (Admin)
export const deleteContactService = async (contactId) => {
    try {
        const contact = await db.Contact.findByPk(contactId);
        
        if (!contact) {
            return { err: 1, msg: 'Contact not found' };
        }

        await contact.destroy();
        
        return {
            err: 0,
            msg: 'Contact deleted successfully'
        };
    } catch (error) {
        throw error;
    }
};
