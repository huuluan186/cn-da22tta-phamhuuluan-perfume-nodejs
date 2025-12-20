import axiosConfig from './axios.config';

/* ================= ROLE APIs ================= */

// GET ALL ROLES (dùng cho Redux)
export const apiGetAllRoles = async () => {
    try {
        const response = await axiosConfig.get('/api/admin/roles');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// CREATE ROLE
export const apiCreateRole = async (payload) => {
    try {
        const response = await axiosConfig.post('/api/roles', payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// UPDATE ROLE
export const apiUpdateRole = async (roleId, payload) => {
    try {
        const response = await axiosConfig.put(`/api/roles/${roleId}`, payload);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// DELETE ROLE (soft delete)
export const apiDeleteRole = async (roleId) => {
    try {
        const response = await axiosConfig.delete(`/api/roles/${roleId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
