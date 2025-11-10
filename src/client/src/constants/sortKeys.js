export const SORT_KEYS = {
    LATEST: 'latest',
    OLDEST: 'oldest',
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
    NAME_ASC: 'name_asc',
    NAME_DESC: 'name_desc',
    BESTSELLER: 'bestseller'
};

// Dùng để hiển thị dropdown với label + key
export const SORT_OPTIONS = [
    { label: 'Mới nhất', value: SORT_KEYS.LATEST },
    { label: 'Cũ nhất', value: SORT_KEYS.OLDEST },
    { label: 'Giá tăng dần', value: SORT_KEYS.PRICE_ASC },
    { label: 'Giá giảm dần', value: SORT_KEYS.PRICE_DESC },
    { label: 'Tên A → Z', value: SORT_KEYS.NAME_ASC },
    { label: 'Tên Z → A', value: SORT_KEYS.NAME_DESC },
    { label: 'Bán chạy', value: SORT_KEYS.BESTSELLER }
];
