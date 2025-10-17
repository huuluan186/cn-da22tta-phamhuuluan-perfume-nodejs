import { Routes, Route, Navigate } from "react-router-dom";
import { path } from "./constants/path";
import { Homepage, Register, Login } from './pages/index'
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
                </Route>
            </Routes>
        </div>
    );
}


export default App;
