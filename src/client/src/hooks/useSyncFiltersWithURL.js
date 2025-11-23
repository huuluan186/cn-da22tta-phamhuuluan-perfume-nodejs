import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useSyncFiltersWithURL = (filters, setFilters, keys = []) => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Khi load URL → set filters
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const newFilters = {};
        keys.forEach(key => {
            const paramKey = key === 'keyword' ? 'query' : key;
            const value = searchParams.get(paramKey);
            if (value) newFilters[key] = value;
        });
        if (Object.keys(newFilters).length) {
            setFilters(prev => ({ ...prev, ...newFilters }));
        }
    }, []); // Chỉ chạy 1 lần khi mount

    // 2. Khi filters thay đổi → update URL, nhưng tránh vòng lặp
    useEffect(() => {
        const searchParams = new URLSearchParams();
        keys.forEach(key => {
            if (filters[key] && !(key === 'page' && filters[key] === 1)) {
                searchParams.set(key === 'keyword' ? 'query' : key, filters[key]);
            }
        });

        const newSearch = searchParams.toString();
        if (newSearch !== location.search.replace(/^\?/, '')) {
            navigate({ search: newSearch }, { replace: true });
        }
    }, [filters, keys, navigate, location.search]);
};
