import {path} from '../constants/path'
import {Footer, Header, Navbar} from '../components/index'
import { Outlet, useLocation} from "react-router-dom";
const Home = () => {
    const location = useLocation();
    const isLoginPage = location.pathname === path.LOGIN;

    return (
        <div className="min-h-screen flex flex-col wrapper">
            {/* Header + Navbar */}
            <div className="sticky top-0 z-50 w-full flex flex-col">
                <div className="container bg-primary text-white w-full border-gray-300">
                    <Header />
                </div>
                <div className="container bg-contentBg w-full border-b border-gray-200">
                    <Navbar />
                </div>
            </div>
            
            {/* Main content */}
            <main className={`flex-grow ${isLoginPage ? "bg-login min-h-screen flex justify-center items-center" : "bg-light container-fluid"}`}>
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="mt-auto bg-primary text-white text-sm">
                <Footer/>
            </footer>
        </div>
    );
};

export default Home;