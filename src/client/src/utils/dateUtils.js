export const formatDate = (dateString) => {
    const date = new Date(dateString); // Chuyển đổi chuỗi thành đối tượng Date
    return date.toLocaleDateString('en-GB'); // Định dạng ngày theo kiểu dd/mm/yyyy
};

export const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Trả về định dạng YYYY-MM-DD
};

export const formatDateTime = (date) =>
    date ? new Date(date).toLocaleString("vi-VN") : "—";