import React from "react";

const PurchaseGuide = () => {
    return (
        <div className="container bg-contentBg py-8 space-y-6">
            {/* Header */}
            <header className="text-center">
                <h1 className="text-3xl font-bold mb-2">Chính sách thanh toán & Hướng dẫn mua hàng</h1>
                <p className="text-gray-600">
                    Hướng dẫn chi tiết cách thanh toán và đặt hàng tại website Perfumora.Zalo
                </p>
            </header>

            {/* Chính sách thanh toán */}
            <section>
                <h2 className="text-xl font-semibold mb-2">I. Chính sách thanh toán</h2>

                {/* COD */}
                <div className="mb-4">
                    <h3 className="font-semibold">1. Thanh toán khi nhận hàng (COD)</h3>
                    <p>Bước 1: Chọn hình thức Thanh toán khi giao hàng (COD) và bấm "Đặt hàng".</p>
                    <p>Bước 2: Nhân viên CSKH của Perfumora sẽ liên hệ để xác nhận và xử lý đơn hàng.</p>
                    <p>Bước 3: Thanh toán khi nhận hàng.</p>
                </div>

                {/* Chuyển khoản ngân hàng */}
                <div className="mb-4">
                    <h3 className="font-semibold">2. Chuyển khoản ngân hàng</h3>
                    <p>Bước 1: Chọn hình thức Chuyển khoản và bấm "Đặt hàng".</p>
                    <p>Bước 2: Thanh toán theo thông tin sau:</p>
                    <p>
                        Tên: Pham Huu Luan <br />
                        STK: 342426463422 <br />
                        Ngân hàng Sacombank <br />
                        Nội dung: Tên Quý Khách Hàng + Số điện thoại
                    </p>
                    <p>Bước 3: Nhân viên CSKH sẽ liên hệ xác nhận thanh toán và xử lý đơn hàng.</p>
                </div>

                {/* ZaloPay */}
                <div className="mb-4">
                    <h3 className="font-semibold">3. Thanh toán qua ZaloPay</h3>
                    <p>
                        Chọn phương thức ZaloPay tại bước đặt hàng, xác nhận "Hoàn tất đơn hàng". Hệ thống sẽ chuyển sang giao diện ZaloPay để nhập thông tin thanh toán. 
                        Sau khi thanh toán hoàn tất, Perfumora sẽ tiến hành xử lý và giao hàng.
                    </p>
                </div>
            </section>

            {/* Hướng dẫn mua hàng */}
            <section>
                <h2 className="text-xl font-semibold mb-2">II. Hướng dẫn mua hàng</h2>

                <p>Quý khách có thể đặt hàng tại website <a href="https://perfumora.Zalo" className="">https://perfumora.vn</a> theo các bước sau:</p>

                <div className="ml-4 space-y-2">
                    <p><strong>Bước 1:</strong> Truy cập website và lựa chọn sản phẩm muốn mua.</p>

                    <p><strong>Bước 2:</strong> Click vào sản phẩm, màn hình sẽ hiển thị các lựa chọn:</p>
                    <ul className="list-disc list-inside text-gray-700 ml-4">
                        <li>Nhấn "MUA NGAY" để tiến hành đặt hàng.</li>
                        <li>Nhấn "Chọn sản phẩm khác" để chọn thêm sản phẩm.</li>
                        <li>Nhấn vào icon "Giỏ hàng" để xem sản phẩm đã chọn.</li>
                        <li>Nhấn "THANH TOÁN NGAY" hoặc "TIẾP TỤC MUA HÀNG" để hoàn tất hoặc chọn thêm sản phẩm.</li>
                    </ul>

                    <p><strong>Bước 3:</strong> Lựa chọn thông tin tài khoản thanh toán.</p>
                    <ul className="list-disc list-inside text-gray-700 ml-4">
                        <li>Nếu chưa có tài khoản: thực hiện "ĐĂNG KÝ TÀI KHOẢN" để theo dõi đơn hàng.</li>
                        <li>Nếu không cần tài khoản: cung cấp thông tin mua hàng, địa chỉ giao hàng và hình thức thanh toán.</li>
                    </ul>

                    <p><strong>Bước 4:</strong> Kiểm tra lại thông tin, điền chú thích nếu có và bấm "ĐẶT HÀNG" để hoàn tất đơn hàng.</p>

                    <p>Perfumora sẽ gửi xác nhận đơn hàng qua email hoặc gọi điện để xác nhận lại đơn hàng và địa chỉ giao hàng.</p>

                    <p>Chúc Quý Khách có trải nghiệm mua sắm tuyệt vời tại Perfumora.Zalo!</p>
                </div>
            </section>
        </div>
    );
};

export default PurchaseGuide;
