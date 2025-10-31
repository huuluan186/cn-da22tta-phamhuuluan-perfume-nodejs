import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { path } from '../../constants/path';
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../../store/actions/user';

const Callback = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            const response = await dispatch(getCurrentUser());
            if (response?.err === 0) {
                toast.success('Đăng nhập thành công!');
                navigate(path.HOME, { replace: true });
            } else {
                toast.error('Đăng nhập thất bại!');
                navigate(path.LOGIN, { replace: true });
            }
        };
        fetchUser();
    }, [dispatch, navigate]);

    return (
        <div className="flex justify-center items-center h-screen text-lg font-semibold">
            Đang xử lý đăng nhập...
        </div>
    );
};

export default Callback;
