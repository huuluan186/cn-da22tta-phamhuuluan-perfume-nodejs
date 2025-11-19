import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllBrands } from "../store/actions/brand";
import { useEffect, useState } from "react";
import { FiltersSidebar } from "../components";
import { ITEMS_PER_PAGE } from "../constants/pagination";

const CollectionLayout = () => {

    const dispatch = useDispatch();
    const { brands } = useSelector(state => state.brand);

    const [filters, setFilters] = useState({
        selectedBrands: [],
        price: [0, 1000000],
        rating: null,
        categoryId: undefined,
        keyword: '',
        sort: '',
        page: 1,  
        imit: ITEMS_PER_PAGE,
    });

    useEffect(() => {
        dispatch(getAllBrands());
    }, []);

    return (
        <div className="container bg-contentBg py-8 flex flex-col md:flex-row gap-6">

            {/* Bên trái: Sidebar */}
            <aside className="w-full md:w-1/4 space-y-6">
                <FiltersSidebar 
                    brands={brands}
                    filters={filters}
                    setFilters={setFilters}
                />
                {/* <CategorySidebar />  */}
            </aside>

            {/* Bên phải: Danh sách sản phẩm */}
            <main className="flex-1 border shadow-sm px-4">
                <Outlet context={{ filters, setFilters }}/>
            </main>
        </div>
    );
};

export default CollectionLayout;
