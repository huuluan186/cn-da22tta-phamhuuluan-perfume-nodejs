import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, InputField, SelectField, CheckRadioField } from "../../../components";
import icons from "../../../assets/react-icons/icon";
import { toast } from "react-toastify";
import {
    getCountries,
    getProvincesByCountry,
    getWardsByProvince,
} from "../../../store/actions/location";
import { apiAddAddress, apiUpdateAddress } from "../../../api/user";
import { validateAddress } from "../../../utils";
const { MdCancel } = icons;

const AddressModal = ({ onClose, mode = "add", addressToEdit = null }) => {
    const dispatch = useDispatch();
    const { countries, provinces, wards } = useSelector(state => state.location);

    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        receiverName: "",
        phone: "",
        label: "",
        addressLine: "",
        countryId: 236, // mặc định Việt Nam
        provinceId: "",
        wardId: "",
        zipCode: "",
        isDefault: false,
    });

    // Gán dữ liệu nếu là chế độ sửa
    useEffect(() => {
        if (addressToEdit) {
            setFormData({
                id: addressToEdit.id,
                receiverName: addressToEdit.receiverName || "",
                phone: addressToEdit.phone || "",
                label: addressToEdit.label || "",
                addressLine: addressToEdit.addressLine || "",
                countryId: addressToEdit.ward?.province?.countryId || 236,
                provinceId: addressToEdit.ward?.provinceId || "",
                wardId: addressToEdit.wardId || "",
                zipCode: addressToEdit.zipCode || "",
                isDefault: !!addressToEdit.isDefault,
            });
        }
    }, [addressToEdit]);

    // Lấy danh sách quốc gia + tỉnh + xã
    useEffect(() => {
        dispatch(getCountries());
    }, [dispatch]);

    useEffect(() => {
        if (formData.countryId) dispatch(getProvincesByCountry(formData.countryId));
        if (formData.provinceId) dispatch(getWardsByProvince(formData.provinceId));
    }, [dispatch, formData.countryId, formData.provinceId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };
            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { valid, errors: formErrors } = validateAddress(formData);
        if (!valid) {
            setErrors(formErrors);
            return;
        }
        // Xóa lỗi cũ (nếu có)
        setErrors({});
        // Loại bỏ các trường không cần gửi
        const { countryId, provinceId, ...finalData } = formData;
        try {
            let res;
            if (mode === "edit") res = await apiUpdateAddress(addressToEdit.id, finalData);
            else res = await apiAddAddress(finalData);

            if (res?.data?.err === 0) {
                toast.success(
                    mode === "edit"
                        ? "Cập nhật địa chỉ thành công!"
                        : "Thêm địa chỉ thành công!"
                );
                onClose(true); // true để cha reload lại danh sách
            } else {
                toast.error(res?.data?.msg || "Lỗi xử lý địa chỉ!");
            }
        } catch (error) {
            toast.error("Lỗi: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div 
                className="bg-contentBg px-6 py-4 rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
            >
                {/* Header */}
                <div className="relative mb-6">
                    <div className="flex justify-between items-center">
                        <h3 className="px-4 text-lg font-semibold">
                            {mode === "edit" ? "CHỈNH SỬA ĐỊA CHỈ" : "THÊM ĐỊA CHỈ MỚI"}
                        </h3>
                        <Button
                            text={<MdCancel />}
                            textSize="text-2xl"
                            bgColor="bg-transparent"
                            textColor="text-red-700"
                            hoverText="hover:none"
                            onClick={() => onClose(false)}
                        />
                    </div>
                    <div className="mt-1 h-px bg-gray-300"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <InputField
                            label="Họ tên người nhận"
                            name="receiverName"
                            value={formData.receiverName}
                            onChange={handleChange}
                            required={true}
                            error={errors.receiverName}
                            setError={setErrors}
                        />
                        <InputField
                            label="Số điện thoại"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required={true}
                            error={errors.phone}
                            setError={setErrors}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <InputField
                            label="Công ty"
                            name="label"
                            value={formData.label}
                            onChange={handleChange}
                        />
                        <InputField
                            label="Địa chỉ"
                            name="addressLine"
                            value={formData.addressLine}
                            onChange={handleChange}
                        />
                    </div>

                    <SelectField
                        label="Quốc gia"
                        name="countryId"
                        value={formData.countryId}
                        onChange={handleChange}
                        options={countries}
                        placeholder="--Chọn quốc gia--"
                        className="mb-3"
                    />

                    {formData.countryId === 236 && (
                        // Quốc gia/Tỉnh/Xã 
                        <div className="grid grid-cols-2 gap-4 mb-3">
                            <SelectField
                                label="Tỉnh/thành"
                                name="provinceId"
                                value={formData.provinceId}
                                onChange={handleChange}
                                options={provinces}
                                disabled={!formData.countryId}
                                placeholder="--Chọn Tỉnh/Thành Phố--"
                                className="mb-3"
                            />
                            <SelectField
                                label="Phường/xã"
                                name="wardId"
                                value={formData.wardId}
                                onChange={handleChange}
                                options={wards}
                                disabled={!formData.provinceId}
                                placeholder="--Chọn Phường/Xã--"
                                className="mb-3"
                            />
                        </div>
                    )}

                    <InputField
                        label="Mã Zip"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="mb-3"
                    />
                    <CheckRadioField
                        type="checkbox"
                        name="isDefault"
                        label="Đặt là địa chỉ mặc định?"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="mb-3"
                    />

                    {/* Nút */}
                    <div className="flex justify-end space-x-4 mt-5">
                        <Button
                            text={mode === "edit" ? "Cập nhật địa chỉ" : "Thêm địa chỉ"}
                            textSize="text-sm"
                            width="w-40"
                            rounded="rounded-sm"
                            hoverBg="hover:bg-green-700"
                            hoverText="hover:none"
                            type="submit"
                        />
                        <Button
                            text="Hủy"
                            textSize="text-sm"
                            width="w-28"
                            rounded="rounded-sm"
                            bgColor="bg-gray-300"
                            hoverBg="hover:bg-gray-400"
                            textColor="text-black"
                            hoverText="hover:none"
                            onClick={() => onClose(false)}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
