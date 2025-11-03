export const slugify = (str) => {
    return String(str || '')
        .toLowerCase()
        .normalize('NFKD') // Chuẩn hóa ký tự có dấu
        .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu tiếng Việt
        .replace(/[^a-z0-9]+/g, '-') // Thay ký tự đặc biệt bằng dấu gạch ngang
        .replace(/(^-|-$)/g, ''); // Bỏ dấu gạch ở đầu/cuối
};
