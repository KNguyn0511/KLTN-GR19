import http from "@/lib/axios";
/** Cấu hình kỹ thuật của sản phẩm (specifications) */
export interface ProductSpecifications {
  cpu?: string;
  vga?: string;
  ram?: string;
  storage?: string;
  display?: string;
  battery?: string;
  os?: string;
  [key: string]: string | undefined;
}

/** Một unit sản phẩm trong kho (ProductItem schema) */
export interface ProductItem {
  _id: string;
  product: string;
  serialNumber: string;
  status: "AVAILABLE" | "SOLD" | "MAINTENANCE";
  createdAt: string;
  updatedAt: string;
}

/** Sản phẩm trả về từ GET /products (danh sách) */
export interface Product {
  _id: string;
  name: string;
  brand: string;
  price: number;
  specifications: ProductSpecifications;
  category: string;
  totalStock: number;
  isActive: boolean;
  description: string;
  images: string[];
  sku: string;
  createdAt: string;
  updatedAt: string;
}

/** Sản phẩm trả về từ GET /products/:id (chi tiết, có thêm items) */
export interface ProductDetail extends Product {
  availableItems: ProductItem[];
}

/** Phân trang trả về từ API */
export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

/** Response của GET /products */
export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ProductQueryParams {
  /** Số trang hiện tại (mặc định: 1) */
  page?: number;
  /** Số sản phẩm mỗi trang (mặc định: 10) */
  limit?: number;
  /** Sắp xếp (ví dụ: "price" | "-price" | "name") */
  sort?: string;
  /** Lọc theo CPU (tìm kiếm regex) */
  cpu?: string;
  /** Lọc theo VGA (tìm kiếm regex) */
  vga?: string;
  /** Giá tối thiểu */
  minPrice?: number;
  /** Giá tối đa */
  maxPrice?: number;
}
/**
 * Lấy danh sách sản phẩm (có phân trang, lọc giá, lọc CPU/VGA)
 * Endpoint: GET /products
 */
export const getProducts = async (params: ProductQueryParams = {}): Promise<ProductListResponse> => {
  const response = await http.get<ProductListResponse>("/products", {
    params,
  });
  return response.data;
};

/**
 * Lấy chi tiết một sản phẩm theo ID
 * Endpoint: GET /products/:id
 */
export const getProductById = async (id: string): Promise<ProductDetail> => {
  const response = await http.get<ProductDetail>(`/products/${id}`);
  return response.data;
};

// HELPER - chuyển Product (backend) → ProductType (ProductCard)

/**
 * Map dữ liệu từ backend sang format mà ProductCard hiểu.
 * Tạo chuỗi specs từ CPU + VGA/RAM của sản phẩm.
 */
export const mapProductToCard = (product: Product) => {
  const { cpu, vga, ram } = product.specifications || {};

  const specParts: string[] = [];
  if (cpu) specParts.push(cpu);
  if (vga) specParts.push(vga);
  else if (ram) specParts.push(ram);

  return {
    id: product._id,
    name: product.name,
    specs: specParts.join(" / ") || product.brand,
    price: product.price,
    originalPrice: null,
    discount: null,
    image: product.images?.[0] ?? null,
  };
};
