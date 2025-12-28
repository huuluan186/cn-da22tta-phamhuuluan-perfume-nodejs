# Perfume E-Commerce System  
**Xây dựng hệ thống kinh doanh nước hoa trực tuyến**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## GIỚI THIỆU DỰ ÁN

Hệ thống **kinh doanh nước hoa trực tuyến** là một nền tảng thương mại điện tử đầy đủ tính năng, cho phép người dùng:
- Xem, tìm kiếm, lọc sản phẩm theo **giới tính, thương hiệu, loại (fullbox/chiết), giá, xuất xứ**.
- Đăng ký, đăng nhập, quản lý tài khoản cá nhân, địa chỉ, giỏ hàng, đơn hàng.
- Thanh toán **COD** hoặc **ZaloPay**.
- Đánh giá, bình luận, yêu thích sản phẩm.

Quản trị viên có thể:
- Quản lý **sản phẩm, danh mục, thương hiệu, đơn hàng, khách hàng, bình luận, kho hàng**.
- Theo dõi **doanh thu, thống kê** qua dashboard.
  

> **Đồ án chuyên ngành** – Trường Kỹ thuật và Công nghệ - Khoa Công nghệ Thông tin

> **Thời gian thực hiện:** 03/11/2025 – 28/12/2025

---

## TÍNH NĂNG CHÍNH

### Người dùng
- [ ] Đăng ký / Đăng nhập (có xác thực, phân quyền), quản lý tài khoản
- [ ] Xem danh sách sản phẩm, thương hiệu, danh mục phân loại
- [ ] Tìm kiếm & lọc sản phẩm nâng cao
- [ ] Xem chi tiết sản phẩm
- [ ] Yêu thích sản phẩm
- [ ] Giỏ hàng & thanh toán (COD, ZaloPay)
- [ ] Quản lý đơn hàng cá nhân
- [ ] Đánh giá & bình luận sản phẩm đã mua

### Quản trị viên (Admin Dashboard)
- [ ] Quản lý danh mục, thương hiệu
- [ ] CRUD sản phẩm, kho hàng
- [ ] Xử lý đơn hàng (xác nhận, giao, hủy)
- [ ] Quản lý người dùng & bình luận
- [ ] Thống kê doanh thu (biểu đồ)
- [ ] Phản hồi từ người dùng

---

## CÔNG NGHỆ SỬ DỤNG

| Layer       | Công nghệ |
|-------------|----------|
| **Frontend** | ReactJS, Tailwind CSS, Redux |
| **Backend**  | Node.js, Express.js, Sequelize ORM |
| **Database** | MySQL |
| **Auth**     | JWT, bcrypt, HTTP-only cookies |
| **Deploy**   | Docker, Docker Compose |
| **API Docs** | Swagger UI |
| **Testing**  | Postman |
| **Version**  | Git + GitHub |

---

## CẤU TRÚC THƯ MỤC MÃ NGUỒN DỰ ÁN

```text

📂src/                        # thư mục chứa mã nguồn dự án
├── 📂client/                 # 🖥️ Frontend (React)
│   ├── 📂src/
│   │   ├── 📂api/           # 🔗 Gọi API
│   │   ├── 📂assets/        # 🖼️ Hình ảnh, icon...
│   │   ├── 📂components/    # 🧩 Component tái sử dụng
│   │   ├── 📂constants/     # 📌 Các giá trị cố định, không thay đổi trong suốt ứng dụng
│   │   ├── 📂layouts/       # 🏗️ cấu trúc trang tổng thể (UserLayout, AdminLayout...)
│   │   ├── 📂pages/         # 📄 Các trang 
│   │   ├── 📂store/         # 🗃️ Redux
│   │   ├── 📂utils/         # ⚙️ Các hàm tiện ích (helpers)
│   │   ├── App.js
│   │   ├── index.css
│   │   ├── index.js
│   │   └── redux.js
│   ├── Dockerfile
│   ├── postcss.config.js
│   └── tailwind.config.js
│
├── 📂server/                 # ⚡Backend (Node.js)
│   ├── 📂src/
│   │   ├── 📂config/        # ⚙️ Cấu hình DB; chứa constants, environment variables
│   │   ├── 📂controllers/   # 📝 Logic xử lý request/response của routes
│   │   ├── 📂data/          # 📊 Chứa dữ liệu tĩnh dạng JSON 
│   │   ├── 📂hooks/         # 🔄 Chứa các hook/lifecycle middleware của server (auth, log, validate…) 
│   │   ├── 📂middlewares/   # 🛡️ Middleware xử lý request/response (auth, error handler, logger…)
│   │   ├── 📂migrations/    # 🏗️ Chứa các file migration để tạo/sửa cấu trúc database
│   │   ├── 📂models/        # 📦 Sequelize models
│   │   ├── 📂routes/        # 🌐 Định nghĩa các API endpoint
│   │   ├── 📂seeders/       # 🌱 Chứa dữ liệu mẫu (seed data) để populate database
│   │   ├── 📂services/      # 🌱 Xử lý nghiệp vụ, gọi API, thao tác với DB
│   │   └── 📂utils/         # ⚙️ Các hàm tiện ích dùng chung
│   │   └── 📂validations/   # ✅ Chứa schema hoặc logic validate dữ liệu đầu vào
│   ├── server.js
│   └── Dockerfile
│
├── .env.example           # 🔑 Template environment variables
├── .gitattributes         # 📂 Git attributes
└── .gitignore             # ❌ Các file/folder bị Git bỏ qua

```
---

## CÀI ĐẶT & CHẠY DỰ ÁN

### Yêu cầu
- Node.js ≥ 18 (Local setup)
- MySQL ≥ 8.0 (Local setup)
- Docker (nếu Dockerized setup)

### 1. Clone repository
```bash
git clone [https://github.com/yourusername/perfume-ecommerce.git](https://github.com/huuluan186/cn-da22tta-phamhuuluan-perfume-nodejs)
cd cn-da22tta-phamhuuluan-perfume-nodejs/src
```

### 2. Cài đặt dependencies
```bash 
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```
### 3. Cấu hình môi trường

#### Bước 1: Sao chép file .env.example
**Linux/MacOS:**
```bash
cp src/.env.example src/.env
```

**Windows (PowerShell):**
```powershell
Copy-Item src\.env.example src\.env
```

**Windows (CMD):**
```cmd
copy src\.env.example src\.env
```

#### Bước 2: Cấu hình các biến môi trường

Mở file `src/.env` và điền các giá trị thực tế:

**⚠️ BẮT BUỘC phải cấu hình:**
- `JWT_SECRET` - Tạo bằng lệnh: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- `DB_PASSWORD` - Mật khẩu MySQL của bạn
- `EMAIL_USER` và `EMAIL_PASSWORD` - Thông tin email để gửi mail

**📌 Tùy chọn (nếu sử dụng):**
- `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` - Nếu sử dụng đăng nhập Google
- `ZALOPAY_APP_ID`, `ZALOPAY_KEY1`, `ZALOPAY_KEY2` - Nếu sử dụng thanh toán ZaloPay

> **Lưu ý:** Không commit file `.env` lên Git (đã có trong `.gitignore`)

### 4. Chạy database migration (nếu tự chạy local mà không build Docker)
```bash
cd server/src
npx sequelize db:migrate
npx sequelize-cli db:seed:all
```

### 5. Chạy ứng dụng
#### Phát triển cục bộ:
```bash
# Terminal 1: Backend
cd server && npm run dev

# Terminal 2: Frontend
cd client && npm start
```
#### Dùng Docker:
```bash
docker-compose up --build
```
#### Truy cập:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Swagger Docs: http://localhost:5000/api-docs

## KẾT QUẢ ĐẠT ĐƯỢC 
- Website hoàn chỉnh đầy đủ các chức năng đã đề ra, responsive, bảo mật.
- Triển khai thành công với Docker.
- Tài liệu API rõ ràng (Swagger).
- Mã nguồn sạch, dễ mở rộng.

## LIÊN HỆ
**Tác giả: Phạm Hữu Luân**  

📧 Email: luanphamhuu2004@gmail.com

📞 Điện thoại: 0386291762

💻 GitHub: huuluan186 (https://github.com/huuluan186)
