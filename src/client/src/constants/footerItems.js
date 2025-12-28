import { path } from './path';
import cash from '../assets/images/method-payment-images/money.png';
import facebook from "../assets/images/social-logo-images/facebook.png"
import instagram from "../assets/images/social-logo-images/instagram.png"
import ggmap from "../assets/images/social-logo-images/google-maps.png"
import zaloPay from "../assets/images/method-payment-images/Logo-ZaloPay.png"

const footerItems = [
    {
        title: 'Về Perfumora',
        items: [
            { type: 'a', href: path.HOME, label: 'Trang chủ' },
            { type: 'a', href: path.ABOUT, label: 'Giới thiệu' },
            { type: 'a', href: path.BRANDS, label: 'Thương hiệu' },
            { type: 'a', href: `${path.COLLECTIONS}/${path.ALL_PRODUCTS}`, label: 'Bộ sưu tập' },
            { type: 'a', href: path.CONTACT, label: 'Liên hệ' },
        ]
    },
    {
        title: 'Hướng dẫn',
        items: [
            { type: 'a', href: path.PUCHARSE_GUIDE, label: 'Hướng dẫn mua hàng' },
            { type: 'a', href: path.PUCHARSE_GUIDE, label: 'Hướng dẫn thanh toán' },
            { type: 'a', href: path.INSPECTION_GUIDE, label: 'Hướng dẫn kiểm hàng' },
            { type: 'a', href: path.TERM_OF_USE, label: 'Điều khoản sử dụng' },
        ]
    },
    {
        title: 'Chính sách',
        items: [
            { type: 'a', href: path.PURCHASE_POLICY, label: 'Chính sách mua hàng' },
            { type: 'a', href: path.PRIVACY_POLICY, label: 'Chính sách bảo mật thông tin' },
            { type: 'a', href: path.SHIPPING_POLICY, label: 'Chính sách giao hàng' },
            { type: 'a', href: path.RETURN_POLICY, label: 'Chính sách đổi trả - bảo hành' },
            { type: 'a', href: path.PAYMENT_SECURITY_POLICY, label: 'Chính sách bảo mật thanh toán' },
        ]
    },
]

const methodPayment = [
    { img: zaloPay, label: 'ZaloPay' },
    { img: cash, label: 'Thanh toán khi nhận hàng' },
]

const socialMedia = [
    { img: facebook, label: 'Facebook', href: 'https://www.facebook.com/huu.luan.791758/' },
    { img: instagram, label: 'Instagram', href: 'https://www.instagram.com/21.yunglp/' },
    { img: ggmap, label: 'Google Maps', href: 'https://maps.app.goo.gl/LLb4cUsJkc8qJakY6' },
]

const contactItems = [
    { type: 'text', label: 'Hộ Kinh doanh PERFUMORA' },
    { type: 'text', label: 'Số ĐKKD 41H8185878 cấp ngày 24/3/2022 tại UBND phường Trà Vinh, tỉnh Vĩnh Long' },
    { type: 'text', label: 'Địa chỉ: 126 Nguyễn Thiện Thành, phường Trà Vinh, tỉnh Vĩnh Long' },
    { type: 'text', label: 'Hotline: 0123 456 789' },
    { type: 'a', href: 'mailto: luanphamhuu2004@gmail.com', label: 'Email: luanphamhuu2004@gmail.com' },
]

export {footerItems, methodPayment, socialMedia, contactItems};