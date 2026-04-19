
# # NetTech Project — Hướng Dẫn Cài Đặt & Chạy Dự Án (Version 2.0)

> **Đồ án tốt nghiệp — Nhóm 19**
> Stack: **NestJS** (Backend) · **Next.js 16** (Frontend) · **MongoDB Atlas**
> Quản lý gói: **pnpm** (Bắt buộc dùng pnpm cho cả 2 để đồng bộ Monorepo)

---

<h1> ANH EM LƯU Ý LÀ HÃY CLONE CODE VỀ CHỨ ĐỪNG TẢI FILE NÉN (RAR/Zip) TỪ GITHUB VỀ NHA </h1>

## 1. Yêu cầu môi trường

Để dự án chạy mượt mà, không bị lỗi ae đảm bảo hãy cài đặt đúng:

| Công cụ | Phiên bản | Lệnh kiểm tra |
|---------|-----------|---------------|
| **Node.js** | **>= 20.x** (LTS) | `node -v` |
| **pnpm** | **>= 8.x** (Bắt buộc) | `pnpm -v` |

> **Lưu ý:** Tuyệt đối **KHÔNG** dùng `npm install` hay `yarn` để tránh làm hỏng file `pnpm-lock.yaml`. Nếu chưa có pnpm, chạy: `npm install -g pnpm` trên cmd của window.

---

## 2. Cấu trúc thư mục hiện tại

```
NetTech_Project/
├── backend-nettech/       # NestJS API — Cổng 3001
├── frontend-nettech/      # Next.js 16 (Turbopack) — Cổng 3000
│   ├── components/
│   │   ├── layouts/       # Cấu trúc layouts mới (AuthLayout, StorefrontLayout)
│   │   └── shared/        # Các UI dùng chung (ProductCard, v.v.)
│   ├── features/          # Logic theo module (Cart, Products, Auth)
│   └── lib/               # Cấu hình Axios, API Service
└── README.md
```

---

## 3. Cài đặt nhanh (Dành cho người mới)

### Bước 1: Clone & Cài đặt Backend
```bash
# Mở terminal 1
cd backend-nettech
pnpm install
```
*Tạo file `.env` trong `backend-nettech/` và dán:*
```env
MONGODB_URI=mongodb://nettech_db:nettech19@ac-asb4ixc-shard-00-00.z1l7r…tlas-qv0230-shard-0&authSource=admin&appName=NettechDatabase
```

### Bước 2: Cài đặt Frontend
```bash
# Mở terminal 2
cd frontend-nettech
pnpm install
```
*Tạo file `.env` trong `frontend-nettech/` và dán:*
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## 4. Hướng dẫn chạy dự án

Cần chạy Backend trước để Frontend có dữ liệu "thật":

### Terminal 1: Backend
```bash
cd backend-nettech
pnpm run start:dev
```
👉 API chạy tại: **http://localhost:3001** | Swagger: **http://localhost:3001/api/docs**

### Terminal 2: Frontend
```bash
cd frontend-nettech
pnpm dev
```
👉 Giao diện chạy tại: **http://localhost:3000**

---


## 5. Xử lý sự cố thường gặp (Tips cho Huy)

* **Lỗi 404 trang Web:** Chạy `rd /s /q .next` bên trong `frontend-nettech` rồi chạy lại `pnpm dev`.
* **Lỗi "Module not found" (@/components/...):** Kiểm tra file `frontend-nettech/components/shared/index.ts` xem đã export component đó chưa.
* **Lỗi "Cast to ObjectId failed":** Tránh bấm thanh toán các sản phẩm có giá trị demo (ID=1, 2, 3). Chỉ test với sản phẩm thật được load từ Backend.
* **Lỗi không hiện tên User sau Login:** F5 trang web hoặc kiểm tra xem `localStorage` đã có `access_token` chưa.

---

## 6. Tóm tắt URLs

| Loại | URL | Ghi chú |
|---------|-----|---------|
| **Trang chủ** | http://localhost:3000 | Shopping thôi! |
| **Giỏ hàng** | http://localhost:3000/cart | Quản lý item |
| **Swagger** | http://localhost:3001/api/docs | Soi API của Nguyên |
| **DB Admin** | MongoDB Atlas | Kiểm tra đơn hàng |

---

## 7. Tài liệu API (Swagger UI) — "Vũ khí" của Backend
Dự án tích hợp sẵn Swagger, giúp anh em có thể test toàn bộ logic Backend (Thêm sản phẩm, Đăng nhập, Đặt hàng,...) mà không cần mở Postman.

Đường dẫn: http://localhost:3001/api/docs

Lợi ích:

Tự động cập nhật: Mọi thay đổi code của đều hiển thị ngay tại đây.

Test trực tiếp: Nhấn nút "Try it out" để gửi request thật và xem kết quả trả về ngay lập tức.

Bảo mật: Để test các API cần đăng nhập (như Cart/Order), hãy nhấn nút Authorize ở góc trên bên phải và dán access_token vào.

💡 Mẹo: Nếu FE gọi API bị lỗi, hãy qua Swagger test trước. Nếu Swagger chạy đúng mà FE chạy sai -> Lỗi tại FE. Nếu Swagger cũng lỗi -> Lỗi tại BE. Đây là cách nhanh nhất để "bắt bệnh" và hiệu quả nhất khi tích hợp swagger !
---
*Dự án được bảo trì bởi Nhóm 19 — Chúc ae run server thành công* 🦾🔥

---