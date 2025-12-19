import { useEffect, useState } from "react";
import { apiGetProductsList } from "../api/product";

export const useProducts = (params) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await apiGetProductsList(params);

                if (isMounted && res?.err === 0) {
                    setProducts(res.response?.data || []);
                }
            } catch (error) {
                console.error(error);
            } finally {
                isMounted && setLoading(false);
            }
        };

        fetchProducts();

        return () => {
            isMounted = false;
        };
    }, [JSON.stringify(params)]);

    return { products, loading };
};
