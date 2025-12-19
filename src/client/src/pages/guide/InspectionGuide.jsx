const InspectionGuide = () => {
  return (
    <div className="container bg-contentBg py-8 space-y-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Hướng dẫn kiểm hàng</h1>
        <p className="text-gray-600">
          Kiểm hàng giúp quý khách đối chiếu sản phẩm nhận được với đơn hàng đã đặt tại Perfumora.
        </p>
      </header>

      {/* Thời gian kiểm hàng */}
      <section>
        <h2 className="text-xl font-semibold mb-2">1. Thời gian kiểm hàng</h2>
        <p>Quý khách có thể đồng kiểm với nhân viên giao hàng ngay khi nhận sản phẩm.</p>
        <p>
          Nếu sau khi ký nhận phát hiện vấn đề, vui lòng liên hệ bộ phận chăm sóc khách hàng của Perfumora để được hỗ trợ đổi trả.
        </p>
      </section>

      {/* Phạm vi kiểm hàng */}
      <section>
        <h2 className="text-xl font-semibold mb-2">2. Phạm vi kiểm hàng</h2>
        <p>Kiểm hàng bao gồm kiểm tra ngoại quan sản phẩm, không dùng thử. Cụ thể:</p>
        <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
          <li>Kiểm tra tên sản phẩm, số lượng, chủng loại và thông tin khách hàng.</li>
          <li>Kiểm tra mẫu mã, màu sắc.</li>
          <li>Kiểm tra tình trạng bóp méo, hư hỏng, đổ vỡ.</li>
        </ul>
        <p className="font-semibold mt-2">Lưu ý:</p>
        <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
          <li>Không bóc mở hộp có tem niêm phong.</li>
          <li>Không cào mã tích điểm hoặc đổi quà.</li>
          <li>Tránh dùng vật sắc nhọn khi mở hàng.</li>
          <li>Không sử dụng sản phẩm khi phát hiện vấn đề trong quá trình kiểm hàng.</li>
          <li>Quay video quá trình mở thùng để đối chiếu khi cần.</li>
        </ul>
      </section>

      {/* Các bước xử lý */}
      <section>
        <h2 className="text-xl font-semibold mb-2">3. Các bước xử lý sau khi kiểm hàng</h2>
        <ul className="list-decimal list-inside ml-4 text-gray-700 space-y-2">
          <li>
            Nếu sản phẩm không có vấn đề, xác nhận với nhân viên giao hàng và thanh toán (nếu chọn COD).
          </li>
          <li>
            Nếu sản phẩm không đúng đơn, liên hệ Hotline: <span className="font-semibold">0123 456 789</span> để được hỗ trợ.
          </li>
          <li>
            Nếu Perfumora xác nhận sai sót từ chúng tôi, quý khách có thể:
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
              <li>Không nhận hàng, không thanh toán và gửi lại cho nhân viên giao nhận.</li>
              <li>Yêu cầu gửi lại đơn mới trong thời gian sớm nhất.</li>
            </ul>
          </li>
        </ul>
      </section>

      {/* Thông tin liên hệ */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Thông tin liên hệ</h2>
        <p>Điện thoại: <span className="font-semibold">0123 456 789</span></p>
        <p>Email: <span className="font-semibold">luanphamhuu2004@gmail.com</span></p>
      </section>
    </div>
  );
};

export default InspectionGuide;
