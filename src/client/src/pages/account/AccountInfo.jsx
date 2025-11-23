import { useState } from "react";
import { useSelector } from "react-redux";
import { capitalizeWords, formatDate } from "../../utils"
import { Button } from "../../components";
import { AccountEditModal } from "../../components/index";
import { genderMap } from "../../constants/translationMap";

const AccountInfo = () => {
    const { user } =  useSelector(state => state.user)
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <div className='text-gray-600'>
            <div className="mb-6"><h2 className="text-xl font-medium">ĐỔI MẬT KHẨU</h2></div>
            <div className="space-y-4">
                <p>
                    <span className='font-bold'>Họ tên: </span>
                    {user?.firstname} {user?.lastname}
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
            {isModalOpen && <AccountEditModal onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default AccountInfo;