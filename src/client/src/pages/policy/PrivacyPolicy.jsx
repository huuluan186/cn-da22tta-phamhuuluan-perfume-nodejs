const PrivacyPolicy = () => {
  return (
    <div className="container bg-contentBg py-8 space-y-6">
      {/* Header */}
      <header className="text-center">
        <h1 className="text-3xl font-bold mb-2">Chính sách bảo mật thông tin</h1>
        <p className="text-gray-600">
          Perfumora cam kết bảo vệ quyền riêng tư và thông tin cá nhân của khách hàng.
        </p>
      </header>

      {/* I. Bảo mật thông tin cá nhân */}
      <section>
        <h2 className="text-xl font-semibold mb-2">I. Chính sách bảo mật thông tin cá nhân</h2>

        {/* 1. Mục đích và phạm vi thu thập */}
        <div className="mb-2">
          <h3 className="font-semibold">1. Mục đích và phạm vi thu thập thông tin</h3>
          <p>
            Việc thu thập thông tin trên website Perfumora giúp chúng tôi:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
            <li>Nắm bắt nguyện vọng và mong muốn của khách hàng để nâng cao dịch vụ.</li>
            <li>Cập nhật các chương trình khuyến mãi và ưu đãi sớm nhất cho khách hàng.</li>
            <li>Hỗ trợ khách hàng khi có khiếu nại hoặc yêu cầu phản hồi.</li>
          </ul>
          <p>
            Thông tin thu thập bao gồm: Họ tên, Email, Điện thoại, Quốc gia, Tỉnh/Thành, Địa chỉ.
          </p>
        </div>

        {/* 2. Phạm vi sử dụng */}
        <div className="mb-2">
          <h3 className="font-semibold">2. Phạm vi sử dụng thông tin</h3>
          <p>
            Chúng tôi cam kết không sử dụng thông tin cho mục đích không lợi ích khách hàng, không buôn bán, trao đổi thông tin cho bên thứ ba. Thông tin được sử dụng để:
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
            <li>Cung cấp sản phẩm và dịch vụ cho khách hàng.</li>
            <li>Gửi thông báo trao đổi thông tin giữa khách và website.</li>
            <li>Ngăn chặn các hành vi giả mạo hoặc phá hủy tài khoản.</li>
            <li>Liên hệ và hỗ trợ khách trong trường hợp đặc biệt.</li>
          </ul>
          <p>
            Trong một số trường hợp đặc biệt, thông tin có thể được chia sẻ hợp lý nếu: có sự đồng ý của khách hàng, để bảo vệ quyền lợi công ty hoặc theo yêu cầu của cơ quan pháp luật.
          </p>
        </div>

        {/* 3. Thời gian lưu trữ */}
        <div className="mb-2">
          <h3 className="font-semibold">3. Thời gian lưu trữ thông tin</h3>
          <p>
            Thông tin cá nhân được lưu trữ trong quá trình cung cấp dịch vụ hoặc đến khi hoàn thành mục đích thu thập, hoặc khi khách hàng yêu cầu hủy thông tin. Thông tin nghi ngờ giả mạo sẽ bị xóa.
          </p>
        </div>

        {/* 4. Quyền truy cập và chỉnh sửa */}
        <div className="mb-2">
          <h3 className="font-semibold">4. Quyền truy cập và chỉnh sửa thông tin</h3>
          <p>
            Khách hàng có thể truy cập website hoặc liên hệ để chỉnh sửa thông tin cá nhân. Khiếu nại về rò rỉ thông tin sẽ được xử lý kịp thời.
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
            <li>Điện thoại: <span className="font-semibold">0123 456 789</span></li>
            <li>Email: <span className="font-semibold">luanphamhuu2004@gmail.com</span></li>
          </ul>
        </div>

        {/* 5. Người/đơn vị truy cập */}
        <div className="mb-2">
          <h3 className="font-semibold">5. Những người hoặc tổ chức được phép truy cập dữ liệu</h3>
          <p>
            Thông tin chỉ được sử dụng trong phạm vi hỗ trợ khách hàng, cơ quan nhà nước theo yêu cầu pháp luật, và các đối tác cung cấp dịch vụ như đơn vị vận chuyển theo thỏa thuận hợp đồng.
          </p>
        </div>

        {/* 6. Địa chỉ quản lý thông tin */}
        <div className="mb-2">
          <h3 className="font-semibold">6. Địa chỉ quản lý thông tin cá nhân</h3>
          <p>
            Perfumora
            <br />
            Địa chỉ: 126 Nguyễn Thiện Thành, Phường Trà Vinh, Tỉnh Vĩnh Long
            <br />
            Hotline: <span className="font-semibold">0123 456 789</span>
            <br />
            Email: <span className="font-semibold">luanphamhuu2004@gmail.com</span>
          </p>
        </div>

        {/* 7. Giải quyết khiếu nại */}
        <div>
          <h3 className="font-semibold">7. Cơ chế tiếp nhận và giải quyết khiếu nại</h3>
          <ol className="list-decimal list-inside ml-4 space-y-1 text-gray-700">
            <li>Khách hàng gửi phản hồi qua hotline hoặc email.</li>
            <li>Bộ phận CSKH tiếp nhận và phối hợp các bên liên quan giải quyết trong tối đa 15 ngày làm việc.</li>
            <li>Gửi phản hồi kết quả cho khách hàng và nếu cần, liên hệ cơ quan chức năng để xử lý.</li>
          </ol>
          <p>
            Chúng tôi hoan nghênh mọi ý kiến đóng góp và phản hồi từ khách hàng về chính sách bảo mật.
          </p>
        </div>
      </section>

      {/* II. Bảo mật thông tin thanh toán */}
      <section>
        <h2 className="text-xl font-semibold mb-2">II. Chính sách bảo mật thông tin thanh toán</h2>
        <p className="mb-2">
          Hệ thống thanh toán thẻ do đối tác cổng thanh toán hợp pháp tại Việt Nam cung cấp. Thông tin thanh toán được bảo mật theo tiêu chuẩn ngành.
        </p>
        <ul className="list-disc list-inside ml-4 space-y-1 text-gray-700">
          <li>Thông tin tài chính được bảo vệ bằng giao thức SSL.</li>
          <li>Tuân thủ tiêu chuẩn bảo mật dữ liệu PCI DSS.</li>
          <li>Mật khẩu OTP được gửi qua SMS để xác thực truy cập tài khoản.</li>
          <li>Thông tin thẻ quốc tế và nội địa không được lưu trữ trực tiếp trên website, chỉ lưu mã đơn hàng, mã giao dịch và tên ngân hàng.</li>
          <li>Đảm bảo thực hiện nghiêm túc các biện pháp bảo mật trong mọi giao dịch thanh toán.</li>
        </ul>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
