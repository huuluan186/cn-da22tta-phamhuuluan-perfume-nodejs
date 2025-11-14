export const capitalizeWords = (str) => {
    if (!str) return '';
    return str
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Viết hoa chữ cái đầu câu
export const capitalizeSentence = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Chuẩn hóa chuỗi (trim + xoá khoảng trắng thừa)
export const normalizeString = (str) => {
    if (!str) return "";
    return str.replace(/\s+/g, " ").trim();
};