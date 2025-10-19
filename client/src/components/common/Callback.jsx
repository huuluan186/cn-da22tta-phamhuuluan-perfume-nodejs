import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/actions/auth';
import { toast } from 'react-toastify';
import { path } from '../../constants/path';

const Callback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            // Dispatch action để lưu token vào Redux
            dispatch(loginSuccess({ token, msg: 'Đăng nhập Google thành công!' }));
            localStorage.setItem('token', token); // Lưu vào localStorage (tùy chọn)
            toast.success('Đăng nhập thành công!');
            navigate(path.HOME);
        } else {
            toast.error('Đăng nhập thất bại!');
            navigate(path.LOGIN);
        }
    }, [location, navigate, dispatch]);

    return <div>Đang xử lý đăng nhập...</div>;
};

export default Callback;