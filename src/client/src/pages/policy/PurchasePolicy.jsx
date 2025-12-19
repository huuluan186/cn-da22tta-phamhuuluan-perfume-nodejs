import React from "react";

const PurchasePolicy = () => {
  return (
    <div className="container bg-contentBg py-8 space-y-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Chính sách mua hàng</h1>
        <p className="text-gray-600">
          Perfumora luôn mong muốn mang đến cho Quý Khách những trải nghiệm mua sắm tốt nhất trên toàn quốc.
        </p>
      </header>

      {/* Sản phẩm nước hoa chiết */}
      <section>
        <h2 className="text-xl font-semibold mb-2">1. Sản phẩm nước hoa chiết</h2>

        {/* Đặc điểm */}
        <div className="mb-2">
          <h3 className="font-semibold">1.1. Đặc điểm nước hoa chiết</h3>
          <p>
            Nước hoa chiết là nước hoa rút từ các chai fullsize chính hãng (100ml - 200ml). Chai chiết thường bằng thủy tinh có vòi xịt, dung tích 10ml - 20ml - 30ml... để Quý Khách trải nghiệm.
          </p>
          <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
            <li>Nhỏ gọn, tiện mang theo đi làm, đi chơi hay du lịch.</li>
            <li>Chất lượng y như nước hoa fullsize chính hãng.</li>
            <li>Lựa chọn phù hợp cho khách muốn trải nghiệm nhiều mùi hương mà không chi tiêu lớn.</li>
          </ul>
        </div>

        {/* Chính sách mua */}
        <div>
          <h3 className="font-semibold">1.2. Chính sách mua nước hoa chiết</h3>
          <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
            <li>Yêu cầu đặt cọc phí vận chuyển và bảo hiểm hàng hóa theo chính sách từng thời điểm. Nếu không nhận hàng, số tiền đặt cọc sẽ thanh toán phí vận chuyển và bảo hiểm.</li>
            <li>Được thử mùi và test sản phẩm tại hệ thống cửa hàng Perfumora.</li>
            <li>Áp dụng chính sách thanh toán, vận chuyển, đổi trả trên website Perfumora.vn.</li>
            <li>Hotline chăm sóc khách hàng 24/7: <span className="font-semibold">0123 456 789</span>.</li>
          </ul>
        </div>
      </section>

      {/* Sản phẩm nước hoa Fullbox */}
      <section>
        <h2 className="text-xl font-semibold mb-2">2. Sản phẩm nước hoa Fullbox</h2>

        {/* Đặc điểm */}
        <div className="mb-2">
          <h3 className="font-semibold">2.1. Đặc điểm nước hoa Fullbox</h3>
          <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
            <li>Perfumora đảm bảo nguồn cung cấp chính hãng, chất lượng, chi phí hợp lý.</li>
            <li>100% nói KHÔNG với hàng giả, hàng nhái.</li>
            <li>Không bán hàng bất chấp hay cạnh tranh không lành mạnh với các đơn vị khác.</li>
          </ul>
        </div>

        {/* Chính sách mua */}
        <div>
          <h3 className="font-semibold">2.2. Chính sách mua nước hoa Fullbox</h3>
          <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
            <li>Yêu cầu đặt cọc phí vận chuyển và bảo hiểm đối với sản phẩm giá từ 1.000.000đ hoặc theo chính sách từng thời điểm. Nếu không nhận hàng, số tiền đặt cọc dùng thanh toán phí vận chuyển và bảo hiểm.</li>
            <li>Được thử mùi và test sản phẩm tại hệ thống cửa hàng Perfumora.</li>
            <li>Áp dụng chính sách thanh toán, vận chuyển, đổi trả trên website Perfumora.vn.</li>
            <li>Hotline chăm sóc khách hàng 24/7: <span className="font-semibold">0123 456 789</span>.</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default PurchasePolicy;
