import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { capitalizeWords, formatDate, formatDateForInput } from "../../utils"
import { Button, InputField } from "../../components";
import { updateUserProfile } from "../../store/actions/user";
import { toast } from "react-toastify";
import icons from '../../assets/react-icons/icon'

const { MdCancel } = icons

const genderMap = {
    male: "nam",
    female: "nữ",
    other: "khác",
};

const AccountInfo = () => {
    const dispatch = useDispatch();
    const { user } =  useSelector(state => state.user)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstname: user?.firstname || "",
        lastname: user?.lastname || "",
        email: user?.email || "",
        phone: user?.phone || "",
        dateOfBirth: user?.dateOfBirth ? formatDate(user.dateOfBirth) : "",
        gender: user?.gender || "",
    });

    // Đồng bộ formData với user từ Redux store
    useEffect(() => {
        setFormData({
            firstname: user?.firstname || "",
            lastname: user?.lastname || "",
            email: user?.email || "",
            phone: user?.phone || "",
            dateOfBirth: user?.dateOfBirth ? formatDateForInput(user.dateOfBirth) : "",
            gender: user?.gender || "",
        });
    }, [user]); // Chạy lại mỗi khi user thay đổi

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateUserProfile(formData)); 
            setIsModalOpen(false); 
            toast.success("Cập nhật thông tin thành công!");
        } catch (error) {
            toast.error("Lỗi khi cập nhật thông tin: "+ error)
        }
        
    };

    const handleCancel = () => setIsModalOpen(false); 

    return (
        <div className='text-gray-600'>
            <div className="mb-6"><h2 className="text-xl font-medium">ĐỔI MẬT KHẨU</h2></div>
            <div className="space-y-4">
                <p>
                    <span className='font-bold'>Họ tên: </span>
                    {user?.firstname || 'khách'} {user?.lastname || 'hàng'}
                </p>
                <p>
                    <span className='font-bold'>Email: </span> 
                    {user?.email}
                </p>
    
                {user?.dateOfBirth && 
                    <p>
                        <span className='font-bold'>Ngày sinh: </span> 
                        {formatDate(user?.dateOfBirth)}
                    </p>
                }
                {user?.gender && 
                    <p>
                        <span className='font-bold '>Giới tính: </span> 
                        {capitalizeWords(genderMap[user.gender]) || "Không xác định"}
                    </p>
                }
                
            </div>

            <div className="mt-10 flex flex-col items-start justify-center">
                <Button 
                    text={"Chỉnh sửa"}
                    textSize="text-sm"
                    hoverBg="hover:bg-green-800"
                    hoverText="hover:none"
                    width="w-28"
                    rounded="rounded-sm"
                    onClick={() => setIsModalOpen(true)}
                />
            </div>

            {/* Modal chỉnh sửa */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-contentBg px-6 py-4 rounded-lg shadow-lg w-full max-w-xl">
                        {/* Header: Tiêu đề + Nút X + Đường line */}
                        <div className="relative mb-6">
                            <div className="flex justify-between items-center">
                                <h3 className="px-4 text-lg font-semibold">CẬP NHẬT THÔNG TIN</h3>
                                <Button 
                                    text={<MdCancel/>}
                                    textSize="text-2xl"
                                    bgColor="bg:transparent"
                                    textColor="text-red-700"
                                    hoverText="hover:none"
                                    onClick={handleCancel}
                                />
                            </div>
                            <div className="mt-1 h-px bg-gray-300"></div>
                        </div>
                        <form className="space-y-4">
                            <div className="flex space-x-4">
                                <InputField
                                    label="Họ"
                                    name="firstname"
                                    value={formData.firstname}
                                    onChange={handleInputChange}
                                    type="select-box"
                                />
                                <InputField
                                    label="Tên"
                                    name="lastname"
                                    value={formData.lastname}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <InputField
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                isDisable={true} // Email có thể không cho chỉnh sửa
                            />
                            <InputField
                                label="Ngày sinh"
                                name="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                            />
                            <div>
                                <label className="block text-sm font-medium">Giới tính:</label>
                                <div className="flex space-x-4 mt-1">
                                    {Object.keys(genderMap).map((gender) => (
                                        <label key={gender} className="flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={gender}
                                                checked={formData.gender === gender}
                                                onChange={handleInputChange}
                                                className="mr-1"
                                            />
                                            {capitalizeWords(genderMap[gender])}
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 h-10">
                                <Button
                                    text={"Cập nhật thông tin"}
                                    textSize="text-sm"
                                    width="w-44"
                                    rounded="rounded-sm"
                                    //bgColor="bg-red-600"
                                    hoverBg="hover:bg-green-700"
                                    hoverText="hover:none"
                                    onClick={handleSubmit}
                                />
                                <Button
                                    text={"Hủy bỏ"}
                                    textSize="text-sm"
                                    width="w-28"
                                    rounded="rounded-sm"
                                    bgColor="bg-gray-300"
                                    hoverBg="hover:bg-gray-400"
                                    textColor="text-black"
                                    hoverText="hover:none"
                                    onClick={handleCancel}
                                />
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountInfo;