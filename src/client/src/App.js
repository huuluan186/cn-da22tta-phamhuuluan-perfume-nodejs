import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { path } from "./constants/path";
import { Homepage, Register, Login, AccountInfo, OrderHistory, ResetPassword, ChangePassword, AddressBook, ProductList, ProductDetail, Wishlist, MyVoucher, Cart } from './pages/index'
import { Callback, ProtectedRoute, QuickViewModal } from "./components/index";
import { MainLayout, AccountLayout, CollectionLayout } from "./layouts/index";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getCurrentUser } from "./store/actions/user";
import { getProductDetail } from "./store/actions/product";

function App() {
    const dispatch = useDispatch();
    const [quickViewId, setQuickViewId] = useState(null); // chỉ lưu productId
    const {product} = useSelector(state => state.product); // product chi tiết từ redux

    // Khi App mount, luôn fetch user từ cookie HttpOnly
    useEffect(() => {
        // Chỉ gọi /me nếu không đang ở trang callback
        if (window.location.pathname !== path.CALLBACK) {
            dispatch(getCurrentUser());
        }
    }, [dispatch]);

    useEffect(() => {
        const open = (e) => {
            const id = e.detail; // chỉ gửi productId
            setQuickViewId(id);
            dispatch(getProductDetail(id)); // fetch chi tiết sản phẩm
        };
        const close = () => setQuickViewId(null);

        window.addEventListener('openQuickView', open);
        window.addEventListener('closeQuickView', close);

        return () => {
            window.removeEventListener('openQuickView', open);
            window.removeEventListener('closeQuickView', close);
        };
    }, [dispatch]);

    return (
        <div className="min-h-screen bg-light">
            <Routes>
                <Route path={path.HOME} element={<MainLayout />} >
                    <Route index element={<Homepage/>}/>
                    <Route path={path.REGISTER} element={<Register/>} />
                    <Route path={path.LOGIN} element={<Login/>} />
                    <Route path={path.CALLBACK} element={<Callback/>} />
                    <Route path={path.RESET_PASSWORD} element={<ResetPassword/>} />
                    <Route path={path.ACCOUNT} 
                        element={
                            <ProtectedRoute>
                                <AccountLayout/>
                            </ProtectedRoute>
                        } 
                    >
                        <Route index element={<AccountInfo />} />
                        <Route path={path.ACCOUNT} element={<AccountInfo/>} />
                        <Route path={path.ORDERS_HISTORY} element={<OrderHistory/>} />
                        <Route path={path.CHANGE_PASSWORD} element={<ChangePassword/>} />
                        <Route path={path.ADDRESSES} element={<AddressBook/>} />
                        <Route path={path.MY_VOUCHER} element={<MyVoucher/>} />
                    </Route>
                    <Route element={<CollectionLayout />}>
                        <Route path={path.COLLECTIONS}>
                            <Route path={path.ALL_PRODUCTS} element={<ProductList />} />
                            <Route path={path.PRODUCTS_FILTERED_BY_CATEGORY} element={<ProductList />} />
                        </Route>

                        <Route path={path.SEARCH} element={<ProductList />} />
                    </Route>

                    <Route 
                        path={path.WISHLIST} 
                        element={
                            <ProtectedRoute>
                                <Wishlist/>
                            </ProtectedRoute>
                        }  
                    />
                    <Route 
                        path={path.CART} 
                        element={
                            <ProtectedRoute>
                                <Cart/>
                            </ProtectedRoute>
                        }  
                    />
                    <Route path={path.PRODUCT_DETAIL} element={<ProductDetail/>} />
                    <Route path="*" element={<Navigate to={path.HOME} replace />} />
                </Route>
            </Routes>

            <ToastContainer
                position="top-right"
                autoClose={1500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
                className="custom-toast-container"
            />

            {/* Modal Quick View toàn cục */}
            <QuickViewModal
                product={product} // product chi tiết từ redux
                isOpen={!!quickViewId}
                onClose={() => setQuickViewId(null)}
            />
        </div>
    );
}


export default App;
