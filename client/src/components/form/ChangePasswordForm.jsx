import { InputField, Button } from '../index'
import { useState } from 'react';
import { validateChangePassword } from '../../utils';
import { apiChangePassword } from '../../api/user';
import { toast } from 'react-toastify';

const ChangePasswordForm = () => {

    const [formData, setFormData] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { valid, errors: formErrors } = validateChangePassword(formData);
        if(!valid){
            setErrors(formErrors);
            return;
        }
        setErrors({});
        const { confirmPassword, ...data } = formData;    
        try {
            const res = await apiChangePassword(data);
            if(res?.data.err == 0){
                toast.success("Đổi mật khẩu thành công!");
                setFormData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                })
            } else toast.error("Mật khẩu cũ không chính xác!")
        } catch (error) {
            toast.error("Lỗi khi đổi mật khẩu: "+ error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className='w-2/3'>
                <InputField 
                    label={'Mật khẩu cũ'}
                    type='password'
                    name='oldPassword'
                    required={true}
                    value={formData.oldPassword}
                    onChange={handleChange}
                    error={errors.oldPassword}
                    setError={setErrors}
                />
                <InputField 
                    label={'Mật khẩu mới'}
                    type='password'
                    name='newPassword'
                    required={true}
                    value={formData.newPassword}
                    onChange={handleChange}
                    error={errors.newPassword}
                    setError={setErrors}
                />
                <InputField 
                    label={'Xác nhận lại mật khẩu'}
                    type='password'
                    name='confirmPassword'
                    required={true}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={errors.confirmPassword}
                    setError={setErrors}
                />
            </div>
            <div className='flex flex-col items-start mt-5'>
                <Button
                    text={'Đặt lại mật khẩu'}
                    width='w-40'
                    hoverBg='hover:bg-green-800'
                    hoverText='hover:none'
                    rounded='rounded-sm'
                    onClick={handleSubmit}
                />
            </div>
        </form>
    )
}

export default ChangePasswordForm
