import React from "react";

const ReturnPolicy = () => {
  return (
    <div className="container bg-contentBg py-8 space-y-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Chính sách đổi trả - bảo hành</h1>
        <p className="text-gray-600">
          Perfumora cam kết mang đến sản phẩm chính hãng 100% và trải nghiệm mua sắm an tâm cho khách hàng.
        </p>
      </header>

      {/* Nội dung chính */}
      <section className="space-y-3 text-gray-700">
        <p>
          Với mong muốn mang lại sự tin tưởng và hài lòng, Perfumora phục vụ nhu cầu mua hàng trên toàn quốc với chính sách cụ thể như sau:
        </p>

        <ol className="list-decimal list-inside ml-4 space-y-2">
          <li>Quý khách vui lòng kiểm tra kỹ thông tin và dung tích sản phẩm trước khi mua hàng.</li>
          <li>Thời hạn đổi sản phẩm trong vòng 03 ngày kể từ khi nhận sản phẩm tại cửa hàng hoặc từ đơn vị giao hàng.</li>
          <li>Chỉ áp dụng đổi sản phẩm nước hoa Fullbox bị lỗi kỹ thuật, không áp dụng cho nước hoa chiết.</li>
          <li>
            Việc đổi hàng chỉ áp dụng với những sản phẩm bị lỗi kỹ thuật do nhà sản xuất.
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Thông báo ngay khi kiểm tra hàng lúc nhận, lập biên bản xác nhận với nhân viên giao hàng nếu sản phẩm bị đổ, vỡ, rò rỉ hoặc lỗi vật lý bên ngoài.</li>
              <li>Cung cấp hình ảnh & video rõ lỗi kỹ thuật từ lúc khui seal và hộp còn nguyên TEM của Perfumora.</li>
              <li>Sản phẩm được xác minh lỗi kỹ thuật sẽ được đổi sản phẩm mới cùng loại trong thời gian sớm nhất.</li>
            </ul>
          </li>
          <li>Sản phẩm đã mua sẽ không được trả nếu không phải lỗi của sản phẩm.</li>
          <li>Bảo hành: Nước hoa là sản phẩm đặc thù, không áp dụng chính sách bảo hành.</li>
          <li>
            Các trường hợp từ chối đổi trả - bảo hành:
            <ul className="list-disc list-inside ml-6 space-y-1">
              <li>Quá thời hạn quy định.</li>
              <li>Không có video từ lúc khui seal hoặc TEM Perfumora không còn nguyên vẹn.</li>
              <li>Video bị cắt ghép hoặc chỉnh sửa.</li>
              <li>Không phải lỗi kỹ thuật của sản phẩm.</li>
              <li>Không xác minh được do Perfumora cung cấp.</li>
              <li>Sản phẩm không còn nguyên vẹn, bị biến dạng hoặc hư hỏng nặng.</li>
              <li>Sản phẩm giảm giá từ 30% trở lên.</li>
            </ul>
          </li>
          <li>Chính sách hoàn tiền: Không áp dụng. Sản phẩm chỉ được áp dụng đổi trả theo chính sách đổi trả nêu trên.</li>
        </ol>
      </section>

      {/* Liên hệ */}
      <section className="text-gray-700">
        <p>
          Mọi thắc mắc xin liên hệ:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>Hotline: <span className="font-semibold">0123 456 789</span></li>
          <li>Email: <span className="font-semibold">luanphamhuu2004@gmail.com</span></li>
        </ul>
      </section>
    </div>
  );
};

export default ReturnPolicy;
