export const BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

export const getImageUrl = (relativePath) => {
    if (!relativePath) return null;
    // Nếu đường dẫn không bắt đầu bằng '/', thêm '/'
    const path = relativePath.startsWith('/') ? relativePath : '/' + relativePath;
    return `${BASE_URL}${path}`;
};
