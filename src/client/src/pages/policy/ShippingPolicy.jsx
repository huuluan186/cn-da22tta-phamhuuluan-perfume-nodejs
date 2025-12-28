import React from "react";

const ShippingPolicy = () => {
  return (
    <div className="container bg-contentBg py-8 space-y-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Chính sách giao hàng</h1>
        <p className="text-gray-600">
          Perfumora luôn hướng đến việc cung cấp dịch vụ vận chuyển tốt nhất cùng mức phí hợp lý cho tất cả các đơn hàng.
        </p>
      </header>

      {/* Nội dung chính */}
      <section className="space-y-3 text-gray-700">
        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li>
            <strong>Phạm vi giao hàng:</strong> Toàn quốc. Chúng tôi sử dụng dịch vụ của các đối tác vận chuyển và có thể gửi tận nhà khách hàng.
          </li>
          <li>
            <strong>Chi phí giao hàng:</strong>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Miễn phí giao hàng cho đơn trên 1.000.000 VNĐ.</li>
              <li>Đơn dưới 1.000.000 VNĐ: phí giao hàng tùy theo cước phí đơn vị vận chuyển, dựa trên kích thước sản phẩm và địa điểm giao hàng. Phí sẽ được thông báo tại bước đặt hàng để khách xác nhận.</li>
            </ul>
          </li>
          <li>
            <strong>Thời gian giao hàng:</strong> Tùy khu vực địa lý, tính từ lúc hệ thống báo đơn hàng thành công (không tính Thứ Bảy, Chủ Nhật, Lễ, Tết):
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Nội thành TP. Hồ Chí Minh: 1-2 ngày.</li>
              <li>Ngoại thành TP. Hồ Chí Minh: 2-3 ngày.</li>
              <li>Các tỉnh/thành khác: 3-5 ngày.</li>
            </ul>
            <p className="text-sm text-gray-500 mt-1">
              Đây là thời gian dự kiến, có thể thay đổi do các lý do ngoài ý muốn. Phân vùng nội/ngoại thành tùy theo đối tác vận chuyển.
            </p>
          </li>
          <li>
            <strong>Đơn hàng không nhận:</strong> Nếu khách không nhận hàng sau khi đơn được xác nhận, vui lòng:
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Thanh toán trực tiếp phí vận chuyển & bảo hiểm hàng hóa cho nhân viên giao hàng.</li>
              <li>Hoặc phí vận chuyển & bảo hiểm sẽ cấn trừ vào khoản tiền đã thanh toán/đặt cọc theo chính sách mua hàng của Perfumora.</li>
            </ul>
          </li>
          <li>
            <strong>Trách nhiệm cung cấp chứng từ hàng hóa:</strong>
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Perfumora cung cấp phiếu mua hàng, hóa đơn và các chứng từ liên quan khi gửi hàng cho đối tác vận chuyển.</li>
              <li>Đối tác vận chuyển chịu trách nhiệm tiếp nhận, giao hàng và chứng từ đầy đủ, an toàn đến khách hàng.</li>
              <li>Đối tác vận chuyển phải thực hiện đúng tiêu chuẩn dịch vụ, bồi thường nếu lỗi do họ gây ra.</li>
              <li>Đối tác vận chuyển có quyền từ chối hàng cấm, hàng nguy hiểm hoặc hàng không đúng loại đã thỏa thuận.</li>
              <li>Trong trường hợp giao hàng chậm, đối tác vận chuyển sẽ thông báo kịp thời để khách lựa chọn tiếp tục chờ hoặc hủy đơn.</li>
            </ul>
          </li>
        </ol>
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

export default ShippingPolicy;
