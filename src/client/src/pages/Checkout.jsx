import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { InputField, Button, CheckRadioField, SelectField, InfoModal } from '../components/index';
import { path } from '../constants/path';
import icons from '../assets/react-icons/icon'
import { logout } from '../store/actions/auth'
import { getAllProvinces, getWardsByProvince } from '../store/actions/location'
import { getMyAddresses } from '../store/actions/address'
import { getMyCart } from '../store/actions/cart';
import { getMyCoupons } from '../store/actions/coupon';
import { getImageUrl, formatPrice, capitalizeSentence } from '../utils/index';
import { validateCheckout } from '../utils/index';
import { apiCreateOrder } from '../api/order';
import { apiAddAddress, apiUpdateAddress } from '../api/user';

const { FiLogOut, FaRegCheckCircle, MdCancel } = icons

const paymentMethods = [
    { value: 'ZaloPay', label: 'Thanh toán qua ZaloPay-QR' },
    { value: 'COD', label: 'Thanh toán khi giao hàng (COD)' },
];

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cart } = useSelector(state => state.cart);
    const { coupons } = useSelector(state => state.coupon);
    const { provinces, wards } = useSelector(state => state.location);
    const { addresses } = useSelector(state => state.address);
    const { user } = useSelector(state => state.user);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState(null)
    const [discountDisplay, setDiscountDisplay] = useState('') //state hiển thị
    const [discountAmount, setDiscountAmount] = useState(0)   //state tính toán
    const [agreePolicies, setAgreePolicies] = useState(true);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [errors, setErrors] = useState({})
    const [couponError, setCouponError] = useState('')
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [infoModal, setInfoModal] = useState({
        show: false,
        message: "",
        icon: null,
        autoClose: 1500,
        onClose: null
    });

    const [formData, setFormData] = useState({
        email: user?.email,
        receiverName: '',
        phone: '',
        addressLine: '',
        provinceId: '',
        wardId: '',
        paymentMethod: 'COD',
        voucher: '',
    });

    useEffect(() => {
        if (user?.email) {
            setFormData(prev => ({
                ...prev,
                email: user.email
            }));
        }
    }, [user?.email]);

    useEffect(() => {
        dispatch(getAllProvinces());
        dispatch(getMyAddresses());
        dispatch(getMyCart());
        formData.provinceId && dispatch(getWardsByProvince(Number(formData.provinceId)));
    }, [dispatch, formData.provinceId]);

    useEffect(() => {
        if (!addresses?.rows?.length || selectedAddressId !== null) return;

        const defaultAddress = addresses.rows.find(addr => addr.isDefault);
        if (!defaultAddress) return;

        setSelectedAddressId(defaultAddress.id.toString());

        const provinceId = defaultAddress.ward?.province?.id;
        const wardId = defaultAddress.ward?.id;

        setFormData(prev => ({
            ...prev,
            receiverName: defaultAddress.receiverName || '',
            phone: defaultAddress.phone || '',
            addressLine: defaultAddress.addressLine || '',
            provinceId: provinceId ? provinceId.toString() : '',
            wardId: wardId ? wardId.toString() : '',
        }));

        if (provinceId) {
            dispatch(getWardsByProvince(Number(provinceId)));
        }
    }, [addresses, selectedAddressId, dispatch]);

    useEffect(() => {
        if (cart && cart.cartItems) {
            const calcSubtotal = cart.cartItems.reduce((acc, item) => acc + parseFloat(item.priceAtTime) * item.quantity, 0);
            setSubtotal(calcSubtotal);
            setTotal(calcSubtotal);
        }
    }, [cart]);

    useEffect(() => {
        if (!coupons?.data?.length) return;
        if (!couponCode) return;

        const now = new Date();

        // Chuyển về chỉ ngày (bỏ giờ phút giây)
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const foundCoupon = coupons?.data?.find(c => {
            const codeMatch = c.code.toUpperCase() === couponCode.toUpperCase(); // không phân biệt hoa thường
            if (!codeMatch) return false;

            if (c.status !== 'unused') return false;

            // So sánh chỉ theo ngày
            const validFromDate = new Date(c.validFrom);
            const validFromDay = new Date(validFromDate.getFullYear(), validFromDate.getMonth(), validFromDate.getDate());

            const validUntilDate = c.validUntil ? new Date(c.validUntil) : null;
            const validUntilDay = validUntilDate
                ? new Date(validUntilDate.getFullYear(), validUntilDate.getMonth(), validUntilDate.getDate())
                : null;

            const isFromValid = validFromDay <= today;
            const isUntilValid = !validUntilDay || validUntilDay >= today;

            return isFromValid && isUntilValid;
        });

        if (!foundCoupon) {
            setAppliedCoupon(null);
            setDiscountAmount(0);
            setDiscountDisplay('');
            setTotal(subtotal);
            setCouponError('Mã giảm giá không hợp lệ hoặc đã hết hạn');
            return;
        }
        // hợp lệ
        setCouponError('')

        let discount = 0
        let display = ''

        if (foundCoupon.discountType === 'fixed') {
            discount = Number(foundCoupon.discountValue)
            display = `-${formatPrice(discount)}đ`
        }

        else if (foundCoupon.discountType === 'percentage') {
            const percent = Number(foundCoupon.discountValue)
            discount = subtotal * (percent / 100)
            display = `-${percent}%`
        }

        // không cho âm tiền
        discount = Math.min(discount, subtotal)
        discount = Math.round(discount)

        setAppliedCoupon(foundCoupon)
        setDiscountAmount(discount)
        setDiscountDisplay(display)
        setTotal(subtotal - discount)
    }, [coupons, couponCode, subtotal])

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            setCouponError('')
            return
        }
        setCouponError('')
        // gọi API lấy coupon của user
        await dispatch(getMyCoupons())
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => {
            const newData = {
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            };
            if (name === 'provinceId') {
                newData.wardId = '';
            }
            return newData;
        });
    };

    const handleSelectAddress = (e) => {
        const addressId = e.target.value;
        setSelectedAddressId(addressId);

        if (!addressId) { // Nếu k chọn địa chỉ nào
            setFormData(prev => ({
                ...prev,
                receiverName: '',
                phone: '',
                addressLine: '',
                provinceId: '',
                wardId: '',
            }));

            setErrors({});
            return;
        }

        const selected = addresses?.rows?.find(addr => addr.id.toString() === addressId);
        if (!selected) return;

        setFormData(prev => ({
            ...prev,
            receiverName: selected.receiverName || '',
            phone: selected.phone || '',
            addressLine: selected.addressLine || '',
            provinceId: selected.ward?.province?.id?.toString() || '',
            wardId: selected.ward?.id.toString() || '',
        }));

        // Xóa lỗi khi chọn địa chỉ
        setErrors({});

        if (selected.province?.id) {
            dispatch(getWardsByProvince(Number(selected.province.id)));
        }
    };

    const handlePaymentChange = (e) => {
        setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }));
    };

    const handleCreateOrder = async () => {
        try {
            let addressId = selectedAddressId;

            // 1. Thêm địa chỉ mới nếu danh sách rỗng hoặc chọn "Địa chỉ khác"
            if (!addressId || addressId === '') {
                const addressData = {
                    receiverName: formData.receiverName,
                    phone: formData.phone,
                    addressLine: formData.addressLine,
                    wardId: Number(formData.wardId),
                    label: '',
                    isDefault: addresses?.rows?.length ? false : true
                };
                const res = await apiAddAddress(addressData);
                addressId = res?.data?.response?.id;
            }
            // 2. Cập nhật địa chỉ cũ nếu có thay đổi
            else {
                const selected = addresses?.rows?.find(addr => addr.id === addressId);
                if (
                    selected.receiverName !== formData.receiverName ||
                    selected.phone !== formData.phone ||
                    selected.addressLine !== formData.addressLine ||
                    selected.ward?.id !== Number(formData.wardId) ||
                    selected.ward?.province?.id !== Number(formData.provinceId)
                ) {
                    const updatedData = {
                        receiverName: formData.receiverName,
                        phone: formData.phone,
                        addressLine: formData.addressLine,
                        provinceId: Number(formData.provinceId),
                        wardId: Number(formData.wardId),
                    };
                    await apiUpdateAddress(addressId, updatedData);
                }
            }

            // 3. Tạo đơn hàng COD
            const res = await apiCreateOrder(addressId, appliedCoupon?.code || null, formData.paymentMethod);

            // 4. Hiển thị modal thành công
            if (res?.err === 0) {
                if (formData.paymentMethod === 'ZaloPay' && res?.order?.paymentGatewayData?.order_url) {
                    // Nếu chọn ZaloPay, chuyển hướng thẳng đến ZaloPay
                    window.location.href = res.order.paymentGatewayData.order_url;
                } else {
                    setInfoModal({
                        show: true,
                        message: "Đặt hàng thành công!",
                        icon: <FaRegCheckCircle className="text-green-500 text-5xl" />,
                        autoClose: 1500,
                        onClose: () => {
                            navigate(`${path.ACCOUNT}/${path.MY_ORDER}`)
                            setInfoModal(prev => ({ ...prev, show: false }))
                        }
                    });
                }
            } else {
                setInfoModal({
                    show: true,
                    message: res?.msg,
                    icon: <MdCancel className="text-red-500 text-5xl" />,
                    autoClose: 1500,
                    onClose: () => setInfoModal(prev => ({ ...prev, show: false }))
                });
            }
        } catch (error) {
            console.error(error);
            setInfoModal({
                show: true,
                message: "Có lỗi xảy ra, vui lòng thử lại.",
                icon: <MdCancel className="text-red-500 text-5xl" />,
                autoClose: 1500,
                onClose: () => setInfoModal(prev => ({ ...prev, show: false }))
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        const { valid, errors: formErrors } = validateCheckout(formData)

        if (!valid) {
            setErrors(formErrors)
            return
        }

        setErrors({})

        // Validate chính sách
        if (!agreePolicies) {
            alert('Bạn cần đồng ý với chính sách trước khi đặt hàng')
            return
        }

        // // Validate địa chỉ đã chọn
        // if (!selectedAddressId) {
        //     alert('Vui lòng chọn địa chỉ giao hàng')
        //     return
        // }
        await handleCreateOrder();
    }

    const addressOptions = (addresses?.rows || []).map(addr => ({
        id: addr.id.toString(),
        name: [
            addr.receiverName,
            addr.addressLine,
            addr.ward?.name,
            addr.ward?.province?.name
        ].filter(Boolean).join(', ')
    }));

    const subItems = cart?.cartItems?.reduce((sum, item) => sum + item.quantity, 0) || 0;

    return (
        <div className="bg-white container grid grid-cols-1 lg:grid-cols-3">
            {/* ==================== Cột 1 (span 2) ==================== */}
            <div className="lg:col-span-2">
                {/* Dòng 1: Tên web + Breadcrumb */}
                <div className="flex flex-col justify-center items-center text-green-700 py-8">
                    <h1 className="text-3xl font-bold">PERFUMORA</h1>
                    <p className="text-sm text-gray-600 mt-1">The Art of Timeless Fragrance</p>
                </div>

                {/* Dòng 2: Chia 2 cột con */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cột con 1: Thông tin giao hàng */}
                    <div className="space-y-4 pr-4">
                        <div>
                            <div className='flex justify-between items-center mb-4'>
                                <h2 className="text-xl font-bold">Thông tin nhận hàng</h2>
                                <div
                                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 cursor-pointer transition"
                                    onClick={() => {
                                        dispatch(logout());
                                        navigate(path.HOME);
                                    }}
                                >
                                    <FiLogOut className="text-base" />
                                    <span>Đăng xuất</span>
                                </div>
                            </div>
                            <SelectField
                                label="Sổ địa chỉ"
                                name="addressBook"
                                placeholder="Địa chỉ khác..."
                                value={selectedAddressId}
                                options={addressOptions}
                                className="mb-4"
                                onChange={handleSelectAddress}
                                required
                            />
                            <InputField
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mb-4"
                                isDisable={true}
                            />
                            <InputField
                                label="Họ và tên"
                                name="receiverName"
                                value={formData.receiverName}
                                onChange={handleChange}
                                className="mb-4"
                                required
                                error={errors.receiverName}
                                setError={setErrors}
                            />
                            <InputField
                                label="Số điện thoại"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mb-4"
                                required
                                error={errors.phone}
                                setError={setErrors}
                            />
                            <InputField
                                label="Địa chỉ"
                                name="addressLine"
                                value={formData.addressLine}
                                onChange={handleChange}
                                className="mb-4"
                                required
                                error={errors.addressLine}
                                setError={setErrors}
                            />
                            <SelectField
                                label="Tỉnh thành"
                                name="provinceId"
                                value={formData.provinceId}
                                options={provinces}
                                onChange={handleChange}
                                className="mb-4"
                                required
                                error={errors.provinceId}
                                setError={setErrors}
                            />
                            <SelectField
                                label="Phường xã"
                                name="wardId"
                                value={formData.wardId}
                                options={wards}
                                onChange={handleChange}
                                className="mb-4"
                                disabled={!formData.provinceId}
                                required
                                error={errors.wardId}
                                setError={setErrors}
                            />
                        </div>
                    </div>

                    {/* Cột con 2: Vận chuyển & Thanh toán */}
                    <div className="space-y-8 pr-8">
                        <div>
                            <h2 className="text-xl font-bold mb-5">Vận chuyển</h2>
                            <div className="flex items-center gap-3 text-gray-600 border border-black p-2 rounded-lg">
                                <CheckRadioField
                                    label={'Phí vận chuyển'}
                                    type="radio"
                                    name="shippingFee"
                                    checked={true}
                                    labelTxtSize='text-lg'
                                />
                                <span className="ml-auto">Miễn phí</span>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold mb-5">Thanh toán</h2>
                            <div className="space-y-4">
                                {paymentMethods.map((method) => (
                                    <div className='border border-black p-2 rounded-lg'>
                                        <CheckRadioField
                                            key={method.value}
                                            type="radio"
                                            name="paymentMethod"
                                            value={method.value}
                                            label={method.label}
                                            checked={formData.paymentMethod === method.value}
                                            onChange={handlePaymentChange}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dòng 3: Checkbox đồng ý chính sách */}
                <div className="py-6 pr-5 text-justify border-t">
                    <CheckRadioField
                        type="checkbox"
                        label={
                            <span className="text-sm text-blue-600">
                                Tôi đã đọc và đồng ý với chính sách bảo mật thông tin, bảo mật thông tin thanh toán và các chính sách bán hàng trên website này
                            </span>
                        }
                        checked={agreePolicies}
                        onChange={(e) => setAgreePolicies(e.target.checked)}
                    />
                </div>
            </div>

            {/* ==================== Cột 2: Đơn hàng ==================== */}
            <div className="lg:col-span-1 bg-light border-l-2">
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-3">
                        Đơn hàng ({subItems || 0} sản phẩm)
                    </h2>
                    {/* ===== DANH SÁCH SẢN PHẨM ===== */}
                    <div className="space-y-4 mb-6 max-h-[11rem] overflow-y-auto pr-2 pt-2">
                        {cart?.cartItems?.map((item) => (
                            <div key={item.id} className="flex gap-4">
                                <div className="relative">
                                    <img
                                        src={getImageUrl(item.productVariant.product.images[0]?.url) || '/placeholder.jpg'}
                                        alt={item.productVariant.product.name}
                                        className="w-20 h-20 object-cover rounded border"
                                    />
                                    <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                                        {item.quantity}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <p className="font-medium text-sm">
                                        {item.productVariant.product.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {capitalizeSentence(item.productVariant?.product?.gender)} / {capitalizeSentence(item.productVariant?.product?.origin)} / {item.productVariant?.volume}ml
                                    </p>
                                </div>

                                <p className="text-right font-medium text-sm">
                                    {formatPrice(item.priceAtTime * item.quantity)}₫
                                </p>
                            </div>
                        ))}
                    </div>
                    {/* ===== MÃ GIẢM GIÁ ===== */}
                    <div className="flex gap-3 mb-6">
                        <input
                            type="text"
                            placeholder="Nhập mã giảm giá"
                            className={`flex-1 border rounded px-3 py-2 text-sm 
                                ${couponError ? 'border-red-500' : ''}`}
                            value={couponCode}
                            onChange={(e) => {
                                setCouponCode(e.target.value)
                                setCouponError('') // gõ lại là xoá lỗi
                                if (!e.target.value.trim()) {
                                    setAppliedCoupon(null);
                                    setDiscountAmount(0);
                                    setDiscountDisplay('');
                                    setTotal(subtotal);
                                }
                            }}
                        />
                        <Button
                            text={'Áp dụng'}
                            hoverBg='hover:bg-primary/70'
                            hoverText='hover:text-white'
                            outline='rounded-md'
                            className='px-5'
                            onClick={handleApplyCoupon}
                        />
                    </div>
                    {couponError && (
                        <p className="text-red-500 text-sm mt-1">{couponError}</p>
                    )}
                    {/* ===== TỔNG TIỀN ===== */}
                    <div className="border-t pt-4 space-y-3 text-sm">
                        <div className="flex justify-between text-gray-700">
                            <span>Tạm tính</span>
                            <span>{formatPrice(subtotal)}₫</span>
                        </div>

                        {appliedCoupon && (
                            <div className="flex justify-between text-green-700">
                                <span>Giảm giá ({appliedCoupon.code})</span>
                                <span>{discountDisplay}</span>
                            </div>
                        )}

                        <div className="flex justify-between text-gray-700">
                            <span>Phí vận chuyển</span>
                            <span>{formatPrice(0)}₫</span>
                        </div>

                        <div className="flex justify-between text-lg font-bold pt-3 border-t">
                            <span>Tổng cộng</span>
                            <span className="text-primary">{formatPrice(total)}₫</span>
                        </div>
                    </div>

                    {/* ===== HÀNH ĐỘNG ===== */}
                    <div className="mt-6 space-y-3">
                        <Button
                            text="ĐẶT HÀNG"
                            bgColor="bg-primary"
                            hoverBg="hover:bg-green-800"
                            hoverText='text-white'
                            textColor="text-white"
                            className="w-full py-3 text-lg font-bold"
                            rounded='rounded-sm'
                            onClick={handleSubmit}
                        />

                        <div onClick={() => navigate(path.CART)}>
                            <p className="text-center text-gray-600 cursor-pointer hover:underline">
                                ← Quay về giỏ hàng
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {infoModal.show && (
                <InfoModal
                    icon={infoModal.icon}
                    message={infoModal.message}
                    autoClose={infoModal.autoClose}
                    onClose={() => {
                        if (infoModal.onClose) infoModal.onClose();
                        setInfoModal(prev => ({ ...prev, show: false, onClose: null }));
                    }}
                />
            )}
        </div>
    );
};

export default Checkout;