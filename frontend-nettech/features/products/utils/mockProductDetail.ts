import mockAvt from "@/public/images/pink.jpg";

export interface ProductConfig {
  id: string;
  name: string;
  priceDelta: number; // Chênh lệch giá so với giá gốc
}

export interface DetailedProduct {
  id: string | number; // MongoDB trả về string (_id), mock dùng number
  name: string;
  sku: string;
  availability: "In Stock" | "Out of Stock";
  basePrice: number;
  originalPrice: number | null;
  discount: string | null;
  images: (string | { src: string })[];
  configurations: ProductConfig[];
  features: string[];
  specs: {
    cpu: string;
    ram: string;
    storage: string;
    vga: string;
    display: string;
    battery: string;
    weight: string;
  };
  highlights: string[];
}

// Kiểu dữ liệu trả về từ API Backend GET /products/:id
export interface ApiProductResponse {
  _id: string;
  name: string;
  brand: string;
  price: number;
  specifications?: Record<string, string>; // Thông số kỹ thuật dạng key-value
  totalStock: number;
  isActive: boolean;
  description?: string;
  images?: string[];
  sku?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Hàm chuyển đổi dữ liệu từ API sang định dạng DetailedProduct dùng cho UI
export const mapApiToDetailedProduct = (
  data: ApiProductResponse
): DetailedProduct => {
  const specs = data.specifications ?? {};

  return {
    id: data._id,
    name: data.name,
    sku: data.sku ?? `SKU-${data._id}`,
    availability: data.totalStock > 0 ? "In Stock" : "Out of Stock",
    basePrice: data.price,
    originalPrice: null, // API chưa có trường giá gốc
    discount: null,       // API chưa có trường giảm giá

    // Dùng ảnh từ API nếu có, fallback sang ảnh mặc định
    images: data.images && data.images.length > 0 ? data.images : [mockAvt],

    // Tạo 1 cấu hình mặc định từ chính sản phẩm (API chưa hỗ trợ nhiều cấu hình)
    configurations: [
      {
        id: "default",
        name: data.name,
        priceDelta: 0,
      },
    ],

    // Nếu có mô tả thì đưa vào danh sách ưu đãi, không thì để trống
    features: data.description ? [data.description] : [],

    // Map thông số kỹ thuật từ specifications, dùng "—" nếu thiếu field
    specs: {
      cpu: specs["cpu"] ?? specs["CPU"] ?? "—",
      ram: specs["ram"] ?? specs["RAM"] ?? "—",
      storage: specs["storage"] ?? specs["Ổ cứng"] ?? "—",
      vga: specs["vga"] ?? specs["VGA"] ?? specs["gpu"] ?? specs["GPU"] ?? "—",
      display: specs["display"] ?? specs["Màn hình"] ?? "—",
      battery: specs["battery"] ?? specs["Pin"] ?? "—",
      weight: specs["weight"] ?? specs["Trọng lượng"] ?? "—",
    },

    // Dùng mô tả làm điểm nổi bật nếu có
    highlights: data.description ? [data.description] : [],
  };
};

export const mockProductDetail: DetailedProduct = {
  id: 1,
  name: "Laptop Asus ROG Strix G16",
  sku: "G614JV-N3014W",
  availability: "In Stock",
  basePrice: 32990000,
  originalPrice: 36990000,
  discount: "-11%",
  images: [mockAvt, mockAvt, mockAvt, mockAvt, mockAvt],
  configurations: [
    {
      id: "config-1",
      name: "Core i7 - 16GB - 512GB",
      priceDelta: 0,
    },
    {
      id: "config-2",
      name: "Core i9 - 32GB - 1TB",
      priceDelta: 8000000,
    },
  ],
  features: [
    "Tặng Balo ROG Gaming trị giá 1.500.000đ",
    "Giảm thêm 300.000đ khi thanh toán qua VNPay",
    "Bảo hành chính hãng 24 tháng",
  ],
  specs: {
    cpu: "Intel Core i7-13650HX (Up to 4.9GHz)",
    ram: "16GB DDR5 4800MHz (2 khe, tối đa 32GB)",
    storage: "512GB SSD NVMe PCIe Gen 4",
    vga: "NVIDIA GeForce RTX 4060 8GB GDDR6",
    display: "16 inch FHD+ (1920x1200), 165Hz, 100% sRGB",
    battery: "90WHrs, 4S1P, 4-cell Li-ion",
    weight: "2.50 kg",
  },
  highlights: [
    "Thiết kế Gaming hầm hố, LED RGB đẹp mắt.",
    "Hiệu năng đỉnh cao với chip i7 Gen 13.",
    "Chiến tốt mọi tựa game AAA hiện nay.",
    "Hệ thống tản nhiệt 3 quạt mát mẻ.",
    "Màn hình 16:10 rộng rãi cho làm việc.",
  ],
};
