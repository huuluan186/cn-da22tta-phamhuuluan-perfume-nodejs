import { path } from './path';
import jcb from '../assets/images/method-payment-images/jcb.png';
import visa from '../assets/images/method-payment-images/visa.png';
import internet_banking from '../assets/images/method-payment-images/internet-banking.png';
import mastercard from '../assets/images/method-payment-images/shopping.png';
import cash from '../assets/images/method-payment-images/money.png';
import facebook from "../assets/images/social-logo-images/facebook.png"
import instagram from "../assets/images/social-logo-images/instagram.png"
import youtube from "../assets/images/social-logo-images/youtube.png"
import ggmap from "../assets/images/social-logo-images/google-maps.png"

const footerItems = [
    {
        title: 'Về Perfumora',
        items: [
            { type: 'a', href: path.HOME, label: 'Trang chủ' },
            { type: 'a', href: path.ABOUT, label: 'Giới thiệu' },
            { type: 'a', href: path.PERFUME, label: 'Sản phẩm' },
            { type: 'a', href: path.CONTACT, label: 'Liên hệ' },
        ]
    },
    {
        title: 'Hướng dẫn',
        items: [
            { type: 'a', href: '/chinh-sach-thanh-toan-va-huong-dan-mua-hang', label: 'Hướng dẫn mua hàng' },
            { type: 'a', href: "/chinh-sach-thanh-toan-va-huong-dan-mua-hang", label: 'Hướng dẫn thanh toán' },
            { type: 'a', href:"/chinh-sach-kiem-hang", label: 'Hướng dẫn kiểm hàng' },
            { type: 'a', href: "/dieu-khoan-su-dung", label: 'Điều khoản sử dụng' },
        ]
    },
    {
        title: 'Chính sách',
        items: [
            { type: 'a', href: '/chinh-sach-mua-hang', label: 'Chính sách mua hàng' },
            { type: 'a', href: "/chinh-sach-bao-mat-thong-tin", label: 'Chính sách bảo mật thông tin' },
            { type: 'a', href:"/chinh-sach-giao-hang", label: 'Chính sách giao hàng' },
            { type: 'a', href: "/chinh-sach-doi-tra-bao-hanh", label: 'Chính sách đổi trả - bảo hành' },
            { type: 'a', href: "/chinh-sach-bao-mat-thanh-toan", label: 'Chính sách bảo mật thanh toán' },
        ]
    },
    {
        title: 'Hỗ trợ',
        items: [
            { type: 'a', href: '/search', label: 'Tìm kiếm' },
            { type: 'a', href: '/login', label: 'Đăng nhập' },
            { type: 'a', href: '/register', label: 'Đăng ký' },
            { type: 'a', href: '/', label: 'Cộng tác viên' },
        ]
    },   
]

const methodPayment = [
    { img: jcb, label: 'JCB' },
    { img: visa, label: 'Visa' },
    { img: internet_banking, label: 'Internet Banking' },
    { img: mastercard, label: 'Mastercard' },
    { img: cash, label: 'Thanh toán khi nhận hàng' },
]

const socialMedia = [
    { img: facebook, label: 'Facebook', href: 'https://www.facebook.com/PerfumeStoreVN' },
    { img: instagram, label: 'Instagram', href: 'https://www.instagram.com/perfumestorevn/' },
    { img: youtube, label: 'Youtube', href: 'https://www.youtube.com/@perfumestorevn' },
    { img: ggmap, label: 'Google Maps', href: 'https://goo.gl/maps/3m3N1g1YwLJ2' },
]

const contactItems = [
    { type: 'text', label: 'Hộ Kinh doanh PERFUMORA' },
    { type: 'text', label: 'Số ĐKKD 41H8185878 cấp ngày 24/3/2022 tại UBND phường Trà Vinh, tỉnh Vĩnh Long' },
    { type: 'text', label: 'Địa chỉ: 123 Nguyễn Thiện Thành, phường Trà Vinh, tỉnh Vĩnh Long' },
    { type: 'text', label: 'Hotline: 0123 456 789' },
    { type: 'a', href: 'mailto:contact@perfumora.vn', label: 'Email: contact@perfumora.vn' },
]

export {footerItems, methodPayment, socialMedia, contactItems};