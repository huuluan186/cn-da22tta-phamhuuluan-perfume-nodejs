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

export const toSlug = (str) => {
    return str
      .toLowerCase()
      .normalize("NFD") // Tách dấu khỏi ký tự gốc
      .replace(/[\u0300-\u036f]/g, "") // Xóa dấu
      .replace(/đ/g, "d") // Chuyển đ -> d
      .replace(/[^a-z0-9 -]/g, "") // Xóa ký tự đặc biệt
      .replace(/\s+/g, "-") // Thay dấu cách bằng dấu -
      .replace(/-+/g, "-") // Xóa dấu - thừa
      .trim(); // Xóa khoảng trắng đầu & cuối
};