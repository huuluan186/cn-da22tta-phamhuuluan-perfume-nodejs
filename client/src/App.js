import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, Bounce } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { path } from "./constants/path";
import { Homepage, Register, Login } from './pages/index'
import { Callback } from "./components/index";
import { MainLayout } from "./layouts/index";
function App() {
    return (
        <div className="min-h-screen bg-light">
            <Routes>
                <Route path={path.HOME} element={<MainLayout />} >
                    <Route index element={<Homepage/>}/>
                    <Route path="*" element={<Navigate to={path.HOME} replace />} />
                    <Route path={path.REGISTER} element={<Register/>} />
                    <Route path={path.LOGIN} element={<Login/>} />
                    <Route path={path.CALLBACK} element={<Callback/>} />
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
