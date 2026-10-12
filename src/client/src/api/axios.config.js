import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_SERVER_URL || 'http://localhost:5000',
    timeout: 60000, // Render free có thể cold-start ~50s và CPU yếu (bcrypt chậm)
    withCredentials: true, // cookie HttpOnly sẽ gửi tự động
});

instance.interceptors.request.use(
    function (config) {
        if (config.data instanceof FormData) 
            config.headers['Content-Type'] = 'multipart/form-data';
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn("⚠️ Phiên đăng nhập hết hạn. Cần đăng nhập lại.");
        }
        return Promise.reject(error);
    }
);

export default instance;
