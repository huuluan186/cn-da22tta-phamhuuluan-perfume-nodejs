import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { path } from "./constants/path";
import { Homepage, Register, Login, AccountInfo, OrderHistory, ResetPassword, ChangePassword, AddressBook, ProductList, ProductDetail, Wishlist, MyVoucher, BrandsListPage, BrandDetailPage, Cart, Checkout, Contact, Introduce, PurchaseGuide, InspectionGuide, TermOfUse, PurchasePolicy, PrivacyPolicy, ReturnPolicy, ShippingPolicy, PaymentSecurityPolicy, UserLayout, UserEditRole, UserList, RoleLayout, RoleList, RoleUpdate, RoleCreate, BrandLayout, BrandList, BrandCreate, BrandUpdate, CategoryLayout, CategoryList, CategoryCreate, CategoryUpdate, ProductLayout, AdminProductList, ProductCreate, ProductUpdate, OrderLayout, OrderList, CouponLayout, CouponList, CouponCreate, CouponAssign, ReviewLayout, ReviewList, StatisticLayout, StatisticDashboard} from './pages/index'
import { Callback, ProtectedRoute, QuickViewModal } from "./components/index";
import { MainLayout, AccountLayout, CollectionLayout, AdminLayout } from "./layouts/index";
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
                    <Route path={path.BRANDS} element={<BrandsListPage/>} />
                    <Route path={path.BRAND_DETAIL} element={<BrandDetailPage/>} />
                    <Route path={path.PRODUCT_DETAIL} element={<ProductDetail/>} />
                    <Route path={path.CONTACT} element={<Contact/>} />
                    <Route path={path.INTRODUCE} element={<Introduce/>} />
                    <Route path={path.PUCHARSE_GUIDE} element={<PurchaseGuide/>} />
                    <Route path={path.INSPECTION_GUIDE} element={<InspectionGuide/>} />
                    <Route path={path.TERM_OF_USE} element={<TermOfUse/>} />
                    <Route path={path.PURCHASE_POLICY} element={<PurchasePolicy/>} />
                    <Route path={path.PRIVACY_POLICY} element={<PrivacyPolicy/>} />
                    <Route path={path.RETURN_POLICY} element={<ReturnPolicy/>} />
                    <Route path={path.SHIPPING_POLICY} element={<ShippingPolicy/>} />
                    <Route path={path.PAYMENT_SECURITY_POLICY} element={<PaymentSecurityPolicy/>} />
                    <Route path="*" element={<Navigate to={path.HOME} replace />} />
                </Route>
                <Route path={path.CHECKOUT} element={<Checkout/>} />
                {/* Admin routes */}
                <Route
                    path={path.ADMIN}
                    element={
                        <ProtectedRoute requireAdmin>
                            <AdminLayout />
                        </ProtectedRoute>
                    }
                >   
                <Route index element={<Navigate to={path.ADMIN_DASHBOARD} replace />} />
                    <Route path={path.ADMIN_DASHBOARD} element={<StatisticLayout />}>
                        <Route index element={<StatisticDashboard />} />
                    </Route>
                    <Route path={path.USER_MANAGER} element={<UserLayout />}>
                        <Route index element={<UserList />} />
                        <Route path={path.UPDATE} element={<UserEditRole />} />
                    </Route>
                    <Route path={path.ROLE_MANAGER} element={<RoleLayout />}>
                        <Route index element={<RoleList />} />
                        <Route path={path.ADD} element={<RoleCreate />} />
                        <Route path={path.UPDATE} element={<RoleUpdate />} />
                    </Route>
                    <Route path={path.BRAND_MANAGER} element={<BrandLayout />}>
                        <Route index element={<BrandList />} />
                        <Route path={path.ADD} element={<BrandCreate />} />
                        <Route path={path.UPDATE} element={<BrandUpdate />} />
                    </Route>
                    <Route path={path.CATEGORY_MANAGER} element={<CategoryLayout />}>
                        <Route index element={<CategoryList />} />
                        <Route path={path.ADD} element={<CategoryCreate />} />
                        <Route path={path.UPDATE} element={<CategoryUpdate />} />
                    </Route>
                    <Route path={path.PRODUCT_MANAGER} element={<ProductLayout />}>
                        <Route index element={<AdminProductList />} />
                        <Route path={path.ADD} element={<ProductCreate />} />
                        <Route path={path.UPDATE} element={<ProductUpdate />} />
                    </Route>
                    <Route path={path.ORDER_MANAGER} element={<OrderLayout />}>
                        <Route index element={<OrderList />} />
                    </Route>
                    <Route path={path.COUPON_MANAGER} element={<CouponLayout />}>
                        <Route index element={<CouponList />} />
                        <Route path={path.ADD} element={<CouponCreate />} />
                        <Route path={path.ASSIGN} element={<CouponAssign />} />
                    </Route>
                    <Route path={path.REVIEW_MANAGER} element={<ReviewLayout />}>
                        <Route index element={<ReviewList />} />
                        {/* <Route path={path.UPDATE} element={<ProductUpdate />} /> */}
                    </Route>
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
