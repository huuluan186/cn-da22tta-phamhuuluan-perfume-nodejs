import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { path } from "./constants/path";
import { Homepage, Register, Login, AccountInfo, OrderHistory, ResetPassword, ChangePassword, AddressBook, ProductList, ProductDetail, Wishlist } from './pages/index'
import { Callback, ProtectedRoute } from "./components/index";
import { MainLayout, AccountLayout, CollectionLayout } from "./layouts/index";
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getCurrentUser } from "./store/actions/user";

function App() {
    const dispatch = useDispatch();

    // Khi App mount, luôn fetch user từ cookie HttpOnly
    useEffect(() => {
        // Chỉ gọi /me nếu không đang ở trang callback
        if (window.location.pathname !== path.CALLBACK) {
            dispatch(getCurrentUser());
        }
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
        </div>
    );
}


export default App;
