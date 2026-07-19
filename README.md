<div align="center">

# 🖥️ NetTech — Hệ Thống Thương Mại Điện Tử Linh Kiện & Thiết Bị Công Nghệ

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000?logo=vercel)](https://net-tech-six.vercel.app)
[![Swagger](https://img.shields.io/badge/API%20Docs-Swagger-85EA2D?logo=swagger)](http://localhost:3001/api/docs)

> **Đồ án tốt nghiệp (KLTN) — Nhóm 19**  
> Hệ thống thương mại điện tử chuyên biệt dành cho lĩnh vực linh kiện máy tính & thiết bị công nghệ, được xây dựng theo mô hình Fullstack hiện đại với đầy đủ tính năng vận hành từ mua sắm trực tuyến đến quản trị doanh nghiệp nội bộ.

</div>

---

## 📋 Mục Lục

- [Tổng Quan Hệ Thống](#-tổng-quan-hệ-thống)
- [Tech Stack](#-tech-stack)
- [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
- [Kiến Trúc Hệ Thống](#-kiến-trúc-hệ-thống)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Hướng Dẫn Cài Đặt & Chạy Dự Án](#-hướng-dẫn-cài-đặt--chạy-dự-án)
- [Biến Môi Trường](#-biến-môi-trường)
- [API Documentation](#-api-documentation)
- [Lời Kết](#-lời-kết)

---

## 🌐 Tổng Quan Hệ Thống

**NetTech** là một nền tảng thương mại điện tử (E-commerce) Fullstack được xây dựng hoàn chỉnh, phục vụ việc kinh doanh linh kiện máy tính và thiết bị công nghệ. Hệ thống được thiết kế để phục vụ đồng thời hai nhóm đối tượng:

- **Khách hàng (Storefront):** Trải nghiệm mua sắm trực tuyến hiện đại — duyệt sản phẩm, build PC cấu hình, thanh toán QR, theo dõi đơn hàng, tra cứu bảo hành.
- **Quản trị viên (Admin Panel):** Hệ thống Back-office đa vai trò — quản lý đơn hàng, kho hàng, sản phẩm, khuyến mãi, nhân sự, báo cáo doanh thu theo thời gian thực.

Dự án được triển khai theo mô hình **monorepo hai thư mục**, gồm:

| Thư mục | Vai trò | Framework |
|---|---|---|
| `/develop` | Frontend — Giao diện người dùng & Admin | Next.js 16 (App Router) |
| `/developBE` | Backend — REST API Server & WebSocket | NestJS 11 |

---

## ⚙️ Tech Stack

### 🖥️ Frontend (`/develop`)

| Hạng mục | Công nghệ | Phiên bản |
|---|---|---|
| **Framework** | [Next.js](https://nextjs.org/) (App Router) | 16.1.6 |
| **UI Library** | [React](https://react.dev/) | 19.x |
| **Ngôn ngữ** | TypeScript | 5.x |
| **Styling** | Tailwind CSS v4 + shadcn/ui + Radix UI | 4.x |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | 5.x |
| **Form & Validation** | React Hook Form + Zod | 7.x / 3.x |
| **HTTP Client** | Axios | 1.x |
| **Real-time** | Socket.IO Client | 4.x |
| **Charts** | [Recharts](https://recharts.org/) | 3.x |
| **AI Chatbot** | Vercel AI SDK + Google Vertex AI (Gemini 2.5 Flash) | 6.x |
| **Notifications** | React Toastify | 11.x |
| **Icons** | Lucide React + React Icons | — |
| **Package Manager** | pnpm | — |

### 🔧 Backend (`/developBE`)

| Hạng mục | Công nghệ | Phiên bản |
|---|---|---|
| **Framework** | [NestJS](https://nestjs.com/) | 11.x |
| **Ngôn ngữ** | TypeScript | 5.x |
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Cloud |
| **ODM** | [Mongoose](https://mongoosejs.com/) + @nestjs/mongoose | 9.x |
| **Authentication** | JWT (passport-jwt) + Bcrypt | — |
| **Real-time** | Socket.IO (WebSocket Gateway) | 4.x |
| **File Upload** | Multer | 2.x |
| **API Docs** | Swagger / OpenAPI (@nestjs/swagger) | 11.x |
| **Validation** | class-validator + class-transformer | — |
| **Payment** | SePay Webhook Integration | — |
| **Testing** | Jest + Supertest | 30.x |
| **Package Manager** | npm | — |

---

## 🚀 Tính Năng Nổi Bật

### 🛍️ Phía Khách Hàng (Storefront) (https://net-tech-six.vercel.app)

- **Danh mục & Tìm kiếm sản phẩm:** Duyệt theo danh mục (CPU, VGA, RAM, SSD, Laptop...), lọc theo giá, thương hiệu, tìm kiếm full-text.
- **Trang chi tiết sản phẩm:** Hiển thị thông số kỹ thuật, ảnh sản phẩm, tồn kho theo chi nhánh, chính sách bảo hành.
- **Giỏ hàng thông minh:** Lưu giỏ hàng vào database (dành cho user đã đăng nhập), đồng bộ qua Zustand store phía client.
- **Quy trình đặt hàng (Checkout):** Nhập địa chỉ giao hàng, áp mã giảm giá (voucher), chọn phương thức thanh toán (COD / Chuyển khoản QR).
- **Thanh toán QR qua SePay:** Tích hợp Webhook tự động nhận & xác nhận thanh toán chuyển khoản ngân hàng theo mã đơn hàng (`NT-YYYY-XXXX`).
- **Lịch sử đơn hàng:** Theo dõi trạng thái đơn hàng theo luồng: `Chờ xác nhận → Đang đóng gói → Đang giao → Hoàn thành`.
- **Tra cứu bảo hành:** Khách hàng tra cứu thông tin bảo hành theo số Serial Number.
- **Build PC với AI:** Tích hợp trợ lý AI (Gemini 2.5 Flash qua Vertex AI) giúp tư vấn và gợi ý cấu hình PC phù hợp ngân sách, trực tiếp hiển thị sản phẩm từ trang chi tiết sản phẩm thực tế.
- **Trang Khuyến Mãi:** Hiển thị các chương trình khuyến mãi đang hoạt động.
- **Tài khoản người dùng:** Cập nhật thông tin cá nhân, địa chỉ, đổi mật khẩu, xem lịch sử bảo hành.

### 🔐 Hệ Thống Xác Thực & Phân Quyền

- **Đăng ký / Đăng nhập:** Hỗ trợ đăng nhập bằng Email hoặc Số điện thoại.
- **JWT Authentication:** Access Token được ký và xác thực bảo mật ở mọi API request.
- **Bcrypt Password Hashing:** Mật khẩu người dùng luôn được mã hóa trước khi lưu.
- **Multi-Role System:** Hệ thống phân quyền 5 cấp — `Customer`, `Sales Staff`, `Warehouse Staff`, `Store Manager`, `Super Admin`.
- **Route Protection (Next.js Middleware):** Tự động chuyển hướng nếu chưa xác thực hoặc không đủ quyền.

### 🖥️ Phía Quản Trị (Admin Panel) (https://net-tech-six.vercel.app/super-admin)

- **Dashboard Thống Kê:** Tổng quan doanh thu, số đơn hàng, khách hàng mới, sản phẩm tồn kho thấp theo tháng; biểu đồ doanh thu theo tuần.
- **Quản lý Đơn Hàng:** Xem danh sách đơn, lọc theo trạng thái & kênh bán (Online / Tại quầy), xác nhận & cập nhật trạng thái, in thông tin vận chuyển.
- **Bán Hàng Tại Quầy (POS - O2O):** Nhân viên có thể tạo đơn hàng trực tiếp tại cửa hàng, gắn kênh `O2O` để phân biệt với đơn online.
- **Quản lý Sản Phẩm:** Thêm, sửa, xóa (ẩn) sản phẩm; upload hình ảnh; quản lý SKU, tồn kho theo chi nhánh, thông số kỹ thuật.
- **Quản lý Kho & Serial Number:** Nhập kho, xuất kho; theo dõi từng đơn vị sản phẩm theo Serial Number.
- **Quản lý Khuyến Mãi:** Tạo và quản lý mã giảm giá (voucher), cấu hình điều kiện áp dụng.
- **Quản lý Bảo Hành:** Tra cứu, cấp phiếu bảo hành, ghi nhận lịch sử bảo hành theo Serial Number.
- **Quản lý Nhân Sự & Thành Viên:** CRUD nhân viên, phân quyền theo vai trò, quản lý khách hàng.
- **Thông Báo Đơn Hàng Mới Real-time:** Khi có đơn đặt hàng mới, hệ thống tự động push thông báo (kèm âm thanh) tới toàn bộ Admin/Staff đang online qua WebSocket.

---

## 🏗️ Kiến Trúc Hệ Thống

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                            │
│                                                                 │
│   ┌──────────────────────────────────────────────────────┐     │
│   │          Next.js 16 Frontend (/develop)              │     │
│   │                                                      │     │
│   │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐ │     │
│   │  │  Storefront │  │ Admin Panel  │  │  AI Chat   │ │     │
│   │  │  (Customer) │  │ (Multi-role) │  │ (Gemini)   │ │     │
│   │  └─────────────┘  └──────────────┘  └────────────┘ │     │
│   │         │                 │                │         │     │
│   │  Zustand Store    Next.js Middleware  Vertex AI SDK  │     │
│   └──────────────────────────────────────────────────────┘     │
│          │ HTTP/REST (Axios)         │ WebSocket (Socket.IO)    │
└──────────┼───────────────────────────┼─────────────────────────┘
           │                           │
           ▼                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                  NestJS Backend (/developBE)  — Port 3001       │
│                                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐│
│  │  Auth    │ │ Products │ │  Sales   │ │  Notification      ││
│  │ Module   │ │ Module   │ │  Module  │ │  Gateway (WS)      ││
│  └──────────┘ └──────────┘ └──────────┘ └────────────────────┘│
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────────────┐│
│  │Dashboard │ │Inventory │ │ Warranty │ │  SePay Webhook     ││
│  │ Module   │ │ Module   │ │ Module   │ │  (Payment)         ││
│  └──────────┘ └──────────┘ └──────────┘ └────────────────────┘│
│                                                                 │
│              Mongoose ODM + ValidationPipe + JWT Guard          │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │      MongoDB Atlas (Cloud)      │
              │                                │
              │  Collections: users, products, │
              │  orders, transactions, warranty,│
              │  inventory, promotions, ...     │
              └────────────────────────────────┘
```

### Luồng Dữ Liệu Chính

1. **Mua hàng Online:**
   `Khách chọn SP → Thêm giỏ hàng (Zustand + API) → Checkout (POST /sales/orders) → Backend tạo đơn, trừ tồn kho → WebSocket push thông báo tới Admin → Khách thanh toán QR → SePay Webhook (POST /sepay/webhook) → Backend xác nhận thanh toán → Admin duyệt đơn & giao hàng`

2. **Xác thực:**
   `Đăng nhập (POST /auth/login) → Backend trả JWT → FE lưu cookie → Mỗi request gửi kèm Bearer Token → NestJS JwtAuthGuard kiểm tra`

3. **Real-time Notification:**
   `Frontend kết nối Socket.IO (kèm role & userId) → Backend phân phòng (admin-room / user-{id}) → Khi có đơn mới → Backend emit 'NEW_ORDER_RECEIVED' → Frontend nhận & hiển thị popup + phát âm thanh`

---

## 📁 Cấu Trúc Dự Án

```
KLTN/
├── develop/                          # Next.js 16 Frontend
│   ├── app/
│   │   ├── (storefront)/        # Route group: Giao diện khách hàng
│   │   │   ├── page.tsx         # Trang chủ
│   │   │   ├── products/        # Danh sách & chi tiết sản phẩm
│   │   │   ├── cart/            # Giỏ hàng
│   │   │   ├── checkout/        # Thanh toán
│   │   │   ├── profile/         # Tài khoản, đơn hàng, bảo hành
│   │   │   ├── build-pc/        # Công cụ Build PC
│   │   │   ├── khuyen-mai/      # Trang khuyến mãi
│   │   │   └── category/        # Danh mục sản phẩm
│   │   ├── super-admin/         # Dashboard quản trị (Super Admin)
│   │   ├── admin/               # Đăng nhập admin
│   │   ├── central-warehouse/   # Quản lý kho trung tâm
│   │   ├── staff/               # Giao diện nhân viên
│   │   └── api/chat/            # Next.js API Route — AI Chatbot
│   ├── components/              # UI Components tái sử dụng
│   ├── features/                # Feature-based modules
│   ├── store/                   # Zustand global stores
│   │   ├── useAuthStore.ts
│   │   ├── useCartStore.ts
│   │   ├── useChatStore.ts
│   │   └── useNotificationStore.ts
│   ├── lib/                     # Utilities, API clients
│   ├── constants/               # Hằng số, cấu hình
│   └── middleware.ts            # Route protection middleware
│
├── developBE/                          # NestJS Backend
│   └── src/
│       ├── auth/                # Xác thực: JWT, Bcrypt
│       ├── users/               # Quản lý người dùng & phân quyền
│       ├── products/            # Quản lý sản phẩm
│       ├── categories/          # Danh mục sản phẩm
│       ├── sales/               # Đơn hàng (Orders)
│       ├── cart/                # Giỏ hàng
│       ├── inventory/           # Quản lý kho & Serial Number
│       ├── promotions/          # Khuyến mãi & Voucher
│       ├── warranty/            # Bảo hành sản phẩm
│       ├── transactions/        # Giao dịch thanh toán
│       ├── dashboard/           # Thống kê & báo cáo
│       ├── notifications/       # WebSocket Gateway
│       ├── sepay/               # Tích hợp thanh toán SePay
│       ├── branches/            # Quản lý chi nhánh
│       └── main.ts              # Entry point, Swagger, CORS
│
└── README.md
```

---

## 🛠️ Hướng Dẫn Cài Đặt & Chạy Dự Án

### Yêu Cầu Hệ Thống

| Công cụ | Phiên bản tối thiểu |
|---|---|
| Node.js | >= 20.x |
| npm | >= 10.x |
| pnpm | >= 9.x |
| Git | Mới nhất |

---

### 🔧 Bước 1: Clone Repository

Tạo folder cha để sẵn sàng chứa 2 folder con đại diện cho Front-end và Back-end
+ Đối với folder chứa Front-end
```bash
cd develop
git clone -b develop https://github.com/KNguyn0511/KLTN-GR19.git .
```
+ Đối với folder chứa Back-end
```bash
cd developBE
git clone -b developBE https://github.com/KNguyn0511/KLTN-GR19.git .
```
---

### 🔙 Bước 2: Cài Đặt & Khởi Chạy Backend (`/developBE`)

```bash
# Di chuyển vào thư mục backend
cd developBE

# Cài đặt các dependencies
pnpm install

# Tạo file biến môi trường
cp .env.example .env
# Sau đó cấu hình các giá trị trong file .env (xem mục Biến Môi Trường)

# Khởi chạy server ở chế độ development (hot-reload)
pnpm run dev
```

> 🚀 Backend sẽ chạy tại: **`http://localhost:3001`**  
> 📖 Tài liệu Swagger API: **`http://localhost:3001/api/docs`**

---

### 🖥️ Bước 3: Cài Đặt & Khởi Chạy Frontend (`/develop`)

Mở terminal mới (giữ nguyên terminal Backend đang chạy):

```bash
# Di chuyển vào thư mục frontend
cd develop

# Cài đặt các dependencies bằng pnpm
pnpm install

# Tạo file biến môi trường
cp .env.example .env.local
# Sau đó cấu hình các giá trị trong file .env.local (xem mục Biến Môi Trường)

# Khởi chạy development server
pnpm dev
```

> 🌐 Frontend sẽ chạy tại: **`http://localhost:3000`**

---

### 📦 Build Production

```bash
# Backend
cd developBE
npm run build
npm run start:prod

# Frontend
cd develop
pnpm build
pnpm start
```

---

## 🔑 Biến Môi Trường

### Backend (`/developBE/.env`)

```env
# MongoDB Atlas Connection String
MONGODB_URI=mongodb://nettech_db:nettech19@ac-asb4ixc-shard-00-00.z1l7rpg.mongodb.net:27017,ac-asb4ixc-shard-00-01.z1l7rpg.mongodb.net:27017,ac-asb4ixc-shard-00-02.z1l7rpg.mongodb.net:27017/my_store_db?ssl=true&replicaSet=atlas-qv0230-shard-0&authSource=admin&appName=NettechDatabase

# JWT Secret Key (tối thiểu 32 ký tự)
JWT_SECRET=NetTech_Secret_Key_2026_KLTN_GR19_Security_Auth

# Server Port (mặc định: 3001)
PORT=3001
```

### Frontend (`/develop/.env.local`)

```env
# URL Backend API
NEXT_PUBLIC_API_URL=http://localhost:3001

# URL của ứng dụng (dùng cho AI Chat)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Google Cloud Vertex AI (cho tính năng AI Chat)
GOOGLE_VERTEX_PROJECT=AIzaSyDY9GH27qystx8_WkMSvhb1oX4BEyI4ElE
GOOGLE_VERTEX_LOCATION=asia-southeast2
```

---

## 📖 API Documentation

Backend cung cấp tài liệu API đầy đủ thông qua **Swagger UI**:

```
http://localhost:3001/api/docs
```

Tài liệu bao gồm tất cả các endpoints được phân nhóm theo module:

| Module | Mô tả |
|---|---|
| `Auth` | Đăng ký, đăng nhập |
| `Products` | CRUD sản phẩm, tìm kiếm, upload ảnh |
| `Categories` | Danh mục sản phẩm |
| `Sales / Orders` | Tạo đơn, cập nhật trạng thái, lịch sử |
| `Cart` | Thêm/xóa/cập nhật giỏ hàng |
| `Inventory` | Nhập xuất kho, Serial Number |
| `Promotions` | Mã giảm giá, chương trình khuyến mãi |
| `Warranty` | Tra cứu và quản lý bảo hành |
| `Transactions` | Lịch sử giao dịch thanh toán |
| `Dashboard` | Thống kê tổng quan, biểu đồ doanh thu |
| `SePay` | Webhook xử lý thanh toán QR |
| `Users` | Quản lý người dùng, phân quyền |
| `Branches` | Quản lý chi nhánh |

---

## ✅ Lời Kết

Dự án **NetTech** đã được phát triển, tích hợp và kiểm thử đầy đủ trong khuôn khổ Khóa Luận Tốt Nghiệp. Toàn bộ hệ thống — từ giao diện người dùng cuối, quy trình đặt hàng & thanh toán tự động qua SePay, hệ thống thông báo real-time qua WebSocket, đến dashboard quản trị đa vai trò — đã được hoàn thiện và vận hành ổn định.

Các tính năng trọng điểm đã được kiểm thử thực tế bao gồm: luồng mua hàng end-to-end, xác nhận thanh toán tự động, phân quyền đa cấp, đồng bộ tồn kho theo Serial Number, và tích hợp AI tư vấn cấu hình PC.

Frontend đã được **deploy lên Vercel** tại địa chỉ [https://net-tech-six.vercel.app](https://net-tech-six.vercel.app), Backend được **deploy lên Render** — sẵn sàng cho môi trường production.

---

<div align="center">

**Nhóm 19 — KLTN 2026**  
Made with ❤️ using Next.js & NestJS

</div>
