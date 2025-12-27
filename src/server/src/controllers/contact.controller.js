import * as contactService from '../services/contact.js';

// 1. POST /contacts - client gửi liên hệ
export const createContactController = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validate các trường bắt buộc
        if (!name || !email || !message) {
            return res.status(400).json({ err: 1, msg: 'Name, email, and message are required' });
        }

        const result = await contactService.createContactService({ name, email, message });
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed to create contact: ' + error.message });
    }
};

// 2. GET /admin/contacts - admin lấy danh sách contact
export const getAllContactsController = async (req, res) => {
    try {
        const query = req.query; // có thể chứa page, limit, status
        const result = await contactService.getAllContactsService(query);
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed to fetch contacts: ' + error.message });
    }
};

// 3. PATCH /admin/contacts/:id/status - admin cập nhật trạng thái
export const updateContactStatusController = async (req, res) => {
    try {
        const contactId = req.params.id;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ err: 1, msg: 'Status is required' });
        }

        const result = await contactService.updateContactStatusService(contactId, status);
        if (result.err) return res.status(400).json(result);

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed to update contact status: ' + error.message });
    }
};

// 4. GET /admin/contacts/:id - admin lấy chi tiết contact
export const getContactDetailController = async (req, res) => {
    try {
        const contactId = req.params.id;
        const result = await contactService.getContactDetailService(contactId);
        
        if (result.err) {
            return res.status(404).json(result);
        }
        
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed to get contact detail: ' + error.message });
    }
};

// 5. DELETE /admin/contacts/:id - admin xóa mềm contact
export const deleteContactController = async (req, res) => {
    try {
        const contactId = req.params.id;
        const result = await contactService.deleteContactService(contactId);
        
        if (result.err) {
            return res.status(404).json(result);
        }
        
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Failed to delete contact: ' + error.message });
    }
};
