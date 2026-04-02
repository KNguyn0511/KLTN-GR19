# NetTech Project — Hướng Dẫn Cài Đặt & Chạy Dự Án

> **Đồ án tốt nghiệp — Nhóm 19**
> Stack: **NestJS** (Backend) · **Next.js** (Frontend) · **MongoDB Atlas** (Database)

---

## Mục lục

1. [Yêu cầu môi trường](#1-yêu-cầu-môi-trường)
2. [Cấu trúc thư mục](#2-cấu-trúc-thư-mục)
3. [Clone dự án](#3-clone-dự-án)
4. [Cài đặt Backend (NestJS)](#4-cài-đặt-backend-nestjs)
5. [Cài đặt Frontend (Next.js)](#5-cài-đặt-frontend-nextjs)
6. [Chạy dự án](#6-chạy-dự-án)
7. [Kiểm tra API với Swagger](#7-kiểm-tra-api-với-swagger)
8. [Tóm tắt nhanh](#8-tóm-tắt-nhanh)

---

## 1. Yêu cầu môi trường

Trước khi bắt đầu, hãy đảm bảo máy tính đã cài đặt đủ các công cụ sau:

| Công cụ | Phiên bản tối thiểu | Kiểm tra |
|---------|---------------------|----------|
| **Node.js** | >= 20.x LTS (Nếu dưới 20.x sẽ ko chạy được FE vì bị lệch Ver-) | `node -v` |
| **npm** | >= 9.x (đi kèm Node.js) | `npm -v` |
| **pnpm** | >= 8.x | `pnpm -v` |

### Cài pnpm nếu chưa có (Cài đặt bằng terminal ở window nha)

```bash
npm install -g pnpm
```

---

## 2. Cấu trúc thư mục

```
NetTech_Project/
├── backend-nettech/      # NestJS API — chạy ở cổng 3001
├── frontend-nettech/     # Next.js App — chạy ở cổng 3000
├── .gitignore
└── README.md
```

---

## 3. Clone dự án

```bash
git clone <https://github.com/KNguyn0511/KLTN-GR19.git>
cd NetTech_Project
```

---

## 4. Cài đặt Backend (NestJS)

### Bước 4.1 — Di chuyển vào thư mục backend

```bash
cd backend-nettech
```

### Bước 4.2 — Cài đặt thư viện

```bash
npm install
```

> Lệnh này sẽ cài toàn bộ dependencies trong `package.json`, bao gồm: NestJS, Mongoose, Swagger, JWT, class-validator, v.v.

### Bước 4.3 — Tạo file `.env`

Tạo file `.env` ngay trong thư mục `backend-nettech/`:


Sau đó mở file `.env` và dán nội dung sau vào:

```env
MONGODB_URI="mongodb+srv://nettech_db:nettech19@nettechdatabase.z1l7rpg.mongodb.net/my_store_db?retryWrites=true&w=majority"
```

---

## 5. Cài đặt Frontend (Next.js)

### Bước 5.1 — Di chuyển vào thư mục frontend

Mở một terminal mới (giữ nguyên terminal backend), sau đó:

```bash
cd frontend-nettech
```

### Bước 5.2 — Cài đặt thư viện

Frontend sử dụng **pnpm** (không dùng npm để đảm bảo đồng nhất với `pnpm-lock.yaml`):

```bash
pnpm install
```

> Lệnh này sẽ cài toàn bộ dependencies, bao gồm: Next.js, React, Tailwind CSS, shadcn/ui, Axios, Zustand, React Hook Form, Zod, v.v.

### Bước 5.3 — Tạo file `.env.local` (nếu chưa có)

Tạo file `.env.local` ngay trong thư mục `frontend-nettech/`:


Dán nội dung sau vào file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 6. Chạy dự án

Cần **2 terminal riêng biệt** để chạy đồng thời Backend và Frontend.

### Terminal 1 — Chạy Backend (backend-nettech)

```bash
cd backend-nettech
npm run start:dev
```

Kết quả thành công sẽ hiển thị tương tự:

```
[Nest] LOG [NestApplication] Nest application successfully started
```

Backend đang chạy tại: **http://localhost:3001**

### Terminal 2 — Chạy Frontend (frontend-nettech)

```bash
cd frontend-nettech
pnpm dev
```

Kết quả thành công sẽ hiển thị tương tự:

```
  ▲ Next.js 16.x.x
  - Local:        http://localhost:3000
  - Network:      http://0.0.0.0:3000
```

Frontend đang chạy tại: **http://localhost:3000**

### Mở trình duyệt

Truy cập **http://localhost:3000** để xem giao diện của ứng dụng.

---

## 7. Kiểm tra API với Swagger

Backend tích hợp sẵn **Swagger UI** để test API mà không cần Postman.

Truy cập: **http://localhost:3001/api/docs**

Tại đây mấy ae có thể:
- Xem toàn bộ danh sách API endpoint (Products, Users, Sales)
- Gửi request thử trực tiếp trên trình duyệt
- Đăng nhập bằng Bearer Token (nhấn nút **Authorize** ở góc trên phải)

---

## 8. Tóm tắt nhanh

Sau khi đã cài đặt đầy đủ (chỉ cần làm **một lần**), mỗi lần làm việc chỉ cần:

```bash
# Terminal 1 — Backend
cd NetTech_Project/backend-nettech
npm run start:dev

# Terminal 2 — Frontend
cd NetTech_Project/frontend-nettech
pnpm dev
```

| Loại | URL | Ghi chú |
|---------|-----|---------|
| Frontend (Next.js) | http://localhost:3000 | Giao diện người dùng |
| Backend (NestJS) | http://localhost:3001 | REST API |
| Swagger Docs | http://localhost:3001/api/docs | Tài liệu & test API |

---

## Note

- **`npm install` báo lỗi**: Kiểm tra phiên bản Node.js bằng `node -v`, cần >= 18.
- **`pnpm install` báo lỗi**: Chạy `npm install -g pnpm` để cài pnpm trước.
- **Backend không kết nối được database**: Kiểm tra lại chuỗi `MONGODB_URI` trong file `backend-nettech/.env` 
- **Frontend không gọi được API**: Đảm bảo Backend đang chạy ở terminal khác và file `frontend-nettech/.env.local` tồn tại với giá trị `NEXT_PUBLIC_API_URL=http://localhost:3001`.
- **Cổng bị chiếm dụng**: Đổi `PORT=3002` trong `backend-nettech/.env` và cập nhật `NEXT_PUBLIC_API_URL=http://localhost:3002` trong `frontend-nettech/.env.local`.
