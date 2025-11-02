import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../../components";
import icons from '../../assets/react-icons/icon'
import { getMyAddresses } from "../../store/actions/address"; // API CRUD
import {AddressModal} from "../index";

const { MdAddLocationAlt, FaRegEdit, FaTrashAlt } = icons;

const AddressBook = () => {
    const dispatch = useDispatch();
    const { addresses } = useSelector(state => state.address);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    useEffect(() => {
        dispatch(getMyAddresses());
    }, [dispatch]);

    return (
        <div className="text-gray-600">
            <div className="mb-6"><h2 className="text-xl font-medium">ĐỊA CHỈ CỦA BẠN</h2></div>
            <div className="flex flex-col items-start justify-center">
                <Button
                    text={'Thêm địa chỉ'}
                    IcBefore={MdAddLocationAlt}
                    hoverText="hover:none"
                    hoverBg="hover:bg-green-800"
                    width="w-42"
                    rounded="rounded-sm"
                    onClick={() => {
                        setSelectedAddress(null); // reset khi thêm mới
                        setIsModalOpen(true);
                    }}
                />
            </div>
            <div className="my-5 h-px bg-gray-300"></div>
            
            {/* Danh sách địa chỉ */}
            <div className="space-y-4">
                {addresses?.count > 0 ? (
                addresses.rows?.map((addr) => (
                    <div
                        key={addr.id}
                        className="border rounded-md px-4 py-3 shadow-sm bg-white flex justify-between items-center"
                    >
                        {/* Thông tin bên trái */}
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-20">
                                <p>
                                    <span className="font-bold">Họ tên:</span> {addr.receiverName}
                                </p>
                                {addr.isDefault && (
                                    <span className="text-green-600 text-xs font-medium">
                                        Địa chỉ mặc định
                                    </span>
                                )}
                            </div>
                            <p>
                                <span className="font-bold">Địa chỉ:</span>{' '}
                                {[
                                    addr.addressLine,
                                    addr.ward?.name,
                                    addr.ward?.province?.name,
                                    addr.ward?.province?.country?.name,
                                ].filter(Boolean).join(', ')}
                            </p>
                            <p>
                                <span className="font-bold">Số điện thoại:</span> {addr.phone}
                            </p>
                            {addr.label && (
                                <p>
                                    <span className="font-bold">Công ty:</span> {addr.label}
                                </p>
                            )}
                        </div>
                        {/* Nút chỉnh sửa bên phải */}
                        <div 
                            className="flex items-center text-2xl cursor-pointer space-x-6"
                        >
                            <span 
                                className="text-primary hover:text-yellow-600" 
                                onClick={() => {
                                    setSelectedAddress(addr); // truyền địa chỉ cần edit
                                    setIsModalOpen(true);      // mở modal
                                }}
                            >
                                    <FaRegEdit />
                            </span>
                            {!addr?.isDefault && 
                                <span className="text-red-500 hover:text-red-700"><FaTrashAlt /></span>
                            }
                            
                        </div>
                    </div>
                ))
                ) : (
                    <p>Bạn chưa có địa chỉ nào.</p>
                )}
            </div>

            {/* Modal thêm địa chỉ */}
            {isModalOpen && (
                <AddressModal
                    mode={selectedAddress ? "edit" : "add"}
                    addressToEdit={selectedAddress}
                    onClose={(reload) => {
                        setSelectedAddress(null); // reset khi thêm mới
                        setIsModalOpen(false);
                        if (reload) dispatch(getMyAddresses()); //Gọi lại API reload danh sách
                    }}
                />
            )}
        </div>
    );
};

export default AddressBook;
