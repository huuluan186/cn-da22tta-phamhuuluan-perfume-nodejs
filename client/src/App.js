import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { path } from "./constants/path";
import { Homepage, Register, Login, AccountInfo, OrderHistory, ResetPassword } from './pages/index'
import { Callback, ProtectedRoute } from "./components/index";
import { MainLayout, AccountLayout } from "./layouts/index";
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { getCurrentUser } from "./store/actions/user";

function App() {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector(state => state.auth)

    useEffect(() => {
        isLoggedIn && dispatch(getCurrentUser())
    }, [isLoggedIn])

    return (
        <div className="min-h-screen bg-light">
            <Routes>
                <Route path={path.HOME} element={<MainLayout />} >
                    <Route index element={<Homepage/>}/>
                    <Route path="*" element={<Navigate to={path.HOME} replace />} />
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
        </div>
    );
}


export default App;
