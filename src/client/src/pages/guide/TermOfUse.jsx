import React from "react";

const TermsOfUse = () => {
  return (
    <div className="container bg-contentBg py-8 space-y-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Điều khoản sử dụng</h1>
        <p className="text-gray-600">
          Khi truy cập trang web Perfumora, quý khách đồng ý tuân thủ các điều khoản sử dụng dưới đây.
        </p>
      </header>

      {/* Chấp nhận điều khoản */}
      <section>
        <h2 className="text-xl font-semibold mb-2">1. Chấp nhận điều khoản</h2>
        <p>
          Khi truy cập Perfumora, quý khách đồng ý với các điều khoản này. Trang web có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào mà không cần thông báo trước. Việc tiếp tục sử dụng trang web sau khi các thay đổi được đăng tải đồng nghĩa quý khách chấp nhận các thay đổi đó.
        </p>
      </section>

      {/* Hướng dẫn sử dụng web */}
      <section>
        <h2 className="text-xl font-semibold mb-2">2. Hướng dẫn sử dụng web</h2>
        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
          <li>Người sử dụng phải đủ 15 tuổi hoặc truy cập dưới sự giám sát của người giám hộ hợp pháp.</li>
          <li>Người dùng phải có đủ năng lực pháp lý để thực hiện giao dịch mua bán theo pháp luật Việt Nam.</li>
          <li>Quý khách cần đăng ký tài khoản với thông tin xác thực và cập nhật khi có thay đổi.</li>
          <li>Mỗi người chịu trách nhiệm về mật khẩu, tài khoản và hoạt động trên web.</li>
          <li>Trang web cung cấp thông tin sản phẩm; mọi nhận xét hiển thị là ý kiến cá nhân của khách hàng.</li>
          <li>Nghiêm cấm sử dụng nội dung web cho mục đích thương mại hoặc nhân danh bên thứ ba nếu không được phép.</li>
          <li>Trong quá trình đăng ký, khách đồng ý nhận email quảng cáo, có thể từ chối sau thông qua link ở cuối email.</li>
        </ul>
      </section>

      {/* Chấp nhận đơn hàng và giá cả */}
      <section>
        <h2 className="text-xl font-semibold mb-2">3. Chấp nhận đơn hàng và giá cả</h2>
        <p>
          Perfumora có quyền từ chối hoặc hủy đơn hàng do lỗi kỹ thuật, hệ thống hoặc thông tin chưa xác thực. Chúng tôi cam kết cung cấp giá cả chính xác, nhưng nếu xảy ra sai sót về giá, Perfumora sẽ liên hệ hướng dẫn hoặc hủy đơn hàng. Chúng tôi cũng có quyền từ chối bất kỳ đơn hàng nào dù đã xác nhận hoặc thanh toán.
        </p>
      </section>

      {/* Thương hiệu và bản quyền */}
      <section>
        <h2 className="text-xl font-semibold mb-2">4. Thương hiệu và bản quyền</h2>
        <p>
          Mọi quyền sở hữu trí tuệ, nội dung, thiết kế, hình ảnh, video, âm nhạc, mã nguồn và phần mềm trên trang web đều là tài sản của Perfumora. Nội dung được bảo vệ bởi luật bản quyền Việt Nam và các công ước quốc tế.
        </p>
      </section>

      {/* Quyền pháp lý */}
      <section>
        <h2 className="text-xl font-semibold mb-2">5. Quyền pháp lý</h2>
        <p>
          Các điều khoản và nội dung của trang web được điều chỉnh bởi pháp luật Việt Nam. Tòa án có thẩm quyền tại Việt Nam sẽ giải quyết mọi tranh chấp phát sinh từ việc sử dụng trang web.
        </p>
      </section>

      {/* Quy định về bảo mật */}
      <section>
        <h2 className="text-xl font-semibold mb-2">6. Quy định về bảo mật</h2>
        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
          <li>Thông tin và thanh toán của khách hàng được mã hóa và bảo mật.</li>
          <li>Khách không được can thiệp vào hệ thống, thay đổi cấu trúc dữ liệu hoặc phát tán phần mềm phá hoại.</li>
          <li>Perfumora có quyền cung cấp thông tin khách hàng theo yêu cầu của cơ quan pháp luật.</li>
        </ul>
      </section>

      {/* Thay đổi, hủy bỏ giao dịch */}
      <section>
        <h2 className="text-xl font-semibold mb-2">7. Thay đổi, hủy bỏ giao dịch</h2>
        <p>
          Quý khách có quyền chấm dứt giao dịch bằng cách:
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
          <li>Thông báo hủy giao dịch qua hotline: <span className="font-semibold">0123 456 789</span>.</li>
          <li>Trả lại hàng hóa chưa sử dụng và chưa hưởng lợi ích từ sản phẩm theo chính sách đổi trả của Perfumora.</li>
        </ul>
      </section>
    </div>
  );
};

export default TermsOfUse;
