import axiosConfig from "./axios.config";

// Public: Gửi tin nhắn liên hệ
export const apiSentContactMessage = async (payload) => {
    try {
        const response = await axiosConfig.post('/api/contacts', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Admin: Lấy danh sách contacts
export const apiGetAllContacts = async (query = {}) => {
    try {
        const { page, limit, status, hasPagination } = query;
        const params = new URLSearchParams();
        
        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (status) params.append('status', status);
        if (hasPagination !== undefined) params.append('hasPagination', hasPagination);

        const response = await axiosConfig.get(`/api/admin/contacts?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Admin: Lấy chi tiết contact
export const apiGetContactDetail = async (contactId) => {
    try {
        const response = await axiosConfig.get(`/api/admin/contacts/${contactId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Admin: Cập nhật trạng thái contact
export const apiUpdateContactStatus = async (contactId, status) => {
    try {
        const response = await axiosConfig.patch(`/api/admin/contacts/${contactId}/status`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Admin: Xóa contact
export const apiDeleteContact = async (contactId) => {
    try {
        const response = await axiosConfig.delete(`/api/admin/contacts/${contactId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};