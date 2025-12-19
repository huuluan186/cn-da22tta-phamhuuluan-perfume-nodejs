import React from "react";

const PaymentSecurityPolicy = () => {
  return (
    <div className="container bg-contentBg py-8 space-y-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Chính sách bảo mật thanh toán</h1>
        <p className="text-gray-600">
          Perfumora cam kết bảo vệ thông tin thanh toán của Quý Khách Hàng khi giao dịch trên website.
        </p>
      </header>

      {/* Nội dung chính */}
      <section className="space-y-3 text-gray-700">
        <h2 className="text-xl font-semibold mb-2">1. Cam kết bảo mật</h2>
        <p>
          Chúng tôi chỉ áp dụng các phương thức thanh toán an toàn: <strong>Thanh toán khi nhận hàng (COD)</strong> và <strong>ZaloPay</strong>. 
          Thông tin giao dịch của Quý Khách Hàng được bảo mật tuyệt đối, không lưu thông tin thẻ hoặc dữ liệu cá nhân ngoài phạm vi cần thiết cho việc thanh toán.
        </p>

        <h2 className="text-xl font-semibold mb-2">2. Quy định bảo mật</h2>
        <p>
          Trong quá trình sử dụng COD hoặc ZaloPay, Perfumora thực hiện các biện pháp sau:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Đối với COD: Quý Khách Hàng chỉ thanh toán khi nhận hàng. Không cần cung cấp thông tin thẻ tín dụng hoặc ngân hàng.</li>
          <li>Đối với ZaloPay: Quý Khách Hàng được chuyển hướng sang hệ thống thanh toán bảo mật của ZaloPay. Tất cả thông tin thanh toán được mã hóa và xử lý trực tiếp bởi ZaloPay, Perfumora không lưu trữ dữ liệu thẻ.</li>
          <li>Thông tin giao dịch như mã đơn hàng, số tiền thanh toán được lưu để xác nhận và xử lý đơn hàng.</li>
          <li>Mọi thông tin thanh toán được bảo vệ bằng các tiêu chuẩn bảo mật của đối tác thanh toán và tuân thủ pháp luật Việt Nam.</li>
        </ul>

        <p>
          Quý Khách Hàng hoàn toàn yên tâm rằng Perfumora không chia sẻ thông tin thanh toán với bên thứ ba ngoài phạm vi cần thiết cho việc xử lý đơn hàng.
        </p>
      </section>

      {/* Liên hệ */}
      <section className="text-gray-700">
        <p>Mọi thắc mắc xin liên hệ:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Hotline: <span className="font-semibold">0123 456 789</span></li>
          <li>Email: <span className="font-semibold">luanphamhuu2004@gmail.com</span></li>
        </ul>
      </section>
    </div>
  );
};

export default PaymentSecurityPolicy;
