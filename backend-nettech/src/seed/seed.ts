/**
 * SEED SCRIPT — Dữ liệu mẫu linh kiện PC cho Build PC Compatibility Tool
 *
 * Cách chạy:
 *   cd backend-nettech
 *   npx ts-node -r tsconfig-paths/register src/seed/seed.ts
 *
 * Script sẽ:
 *   1. Kết nối MongoDB Atlas (đọc từ .env)
 *   2. Upsert 8 danh mục linh kiện (categories)
 *   3. Xoá các sản phẩm seed cũ (theo sku prefix "SEED-")
 *   4. Insert 28 sản phẩm mới với dữ liệu tương thích nhau
 */

import 'reflect-metadata';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ─── Mongoose Schemas (inline để script tự chạy độc lập) ─────────────────────

const categorySchema = new mongoose.Schema(
  {
    name: String,
    slug: { type: String, unique: true },
    pcBuilderVisible: { type: Boolean, default: true },
    compatibilityAttributes: { type: Array, default: [] },
    isDeleted: { type: Boolean, default: false },
  },
  { collection: 'categories', timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    specifications: { type: Object },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    totalStock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    description: String,
    images: [String],
    sku: { type: String, unique: true, sparse: true },
  },
  { collection: 'products', timestamps: true },
);

const CategoryModel = mongoose.model('SeedCategory', categorySchema, 'categories');
const ProductModel = mongoose.model('SeedProduct', productSchema, 'products');

// ─── Category Definitions ─────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'CPU', slug: 'cpu', pcBuilderVisible: true },
  { name: 'Mainboard', slug: 'mainboard', pcBuilderVisible: true },
  { name: 'RAM', slug: 'ram', pcBuilderVisible: true },
  { name: 'GPU', slug: 'gpu', pcBuilderVisible: true },
  { name: 'PSU', slug: 'psu', pcBuilderVisible: true },
  { name: 'Case', slug: 'case', pcBuilderVisible: true },
  { name: 'Cooler', slug: 'cooler', pcBuilderVisible: true },
  { name: 'SSD', slug: 'ssd', pcBuilderVisible: true },
];

// ─── Image URL helpers (dùng ảnh placeholder chất lượng cao) ─────────────────
// Thay bằng URL thật nếu có CDN

const IMG = {
  cpu: (name: string) =>
    `https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80&auto=format&fit=crop`,
  gpu: () =>
    `https://images.unsplash.com/photo-1714267853925-573c698e6a38?w=600&q=80&auto=format&fit=crop`,
  mb: () =>
    `https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80&auto=format&fit=crop`,
  ram: () =>
    `https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80&auto=format&fit=crop`,
  psu: () =>
    `https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80&auto=format&fit=crop`,
  case: () =>
    `https://images.unsplash.com/photo-1726059668440-1e7f5b58b0ea?w=600&q=80&auto=format&fit=crop`,
  cooler: () =>
    `https://images.unsplash.com/photo-1695728481082-ffb1e4b23e8e?w=600&q=80&auto=format&fit=crop`,
  ssd: () =>
    `https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&q=80&auto=format&fit=crop`,
};

// ─── Seed Product Factory ─────────────────────────────────────────────────────

function makeProducts(catIds: Record<string, mongoose.Types.ObjectId>) {
  return [
    // ══════════════════════════════════════════════════════════════════════════
    // CPU — 6 sản phẩm (LGA1700 x3, AM5 x3)
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: 'Intel Core i9-14900K',
      brand: 'Intel',
      sku: 'SEED-CPU-I9-14900K',
      price: 13_500_000,
      category: catIds.cpu,
      totalStock: 15,
      description:
        '24 nhân (8P+16E) / 32 luồng, boost 6.0 GHz. Flagship dành cho workstation và gaming cao cấp.',
      images: [IMG.cpu('i9-14900k')],
      specifications: {
        socket: 'LGA1700',
        ramType: 'DDR5',        // Bo mạch chủ cần hỗ trợ DDR5
        tdp: 125,               // Watts — dùng để tính nguồn tổng
        cores: '24 (8P+16E)',
        threads: '32',
        baseClock: '3.2 GHz',
        boostClock: '6.0 GHz',
        cache: '36 MB L3',
        pcie: 'PCIe 5.0',
      },
    },
    {
      name: 'Intel Core i7-14700K',
      brand: 'Intel',
      sku: 'SEED-CPU-I7-14700K',
      price: 9_800_000,
      category: catIds.cpu,
      totalStock: 20,
      description: '20 nhân (8P+12E) / 28 luồng, boost 5.6 GHz. Lý tưởng cho gaming + streaming.',
      images: [IMG.cpu('i7-14700k')],
      specifications: {
        socket: 'LGA1700',
        ramType: 'DDR5',
        tdp: 125,
        cores: '20 (8P+12E)',
        threads: '28',
        baseClock: '3.4 GHz',
        boostClock: '5.6 GHz',
        cache: '33 MB L3',
        pcie: 'PCIe 5.0',
      },
    },
    {
      name: 'Intel Core i5-13600K',
      brand: 'Intel',
      sku: 'SEED-CPU-I5-13600K',
      price: 6_200_000,
      category: catIds.cpu,
      totalStock: 30,
      description: '14 nhân (6P+8E) / 20 luồng, boost 5.1 GHz. Bộ xử lý tầm trung tốt nhất 2024.',
      images: [IMG.cpu('i5-13600k')],
      specifications: {
        socket: 'LGA1700',
        ramType: 'DDR4',        // Bo mạch chủ cần hỗ trợ DDR4
        tdp: 125,
        cores: '14 (6P+8E)',
        threads: '20',
        baseClock: '3.5 GHz',
        boostClock: '5.1 GHz',
        cache: '24 MB L3',
        pcie: 'PCIe 5.0',
      },
    },
    {
      name: 'AMD Ryzen 9 7950X',
      brand: 'AMD',
      sku: 'SEED-CPU-R9-7950X',
      price: 16_200_000,
      category: catIds.cpu,
      totalStock: 10,
      description: '16 nhân / 32 luồng, boost 5.7 GHz. Flagship AMD Zen 4 cho AI, rendering và workstation.',
      images: [IMG.cpu('r9-7950x')],
      specifications: {
        socket: 'AM5',
        ramType: 'DDR5',
        tdp: 170,
        cores: '16',
        threads: '32',
        baseClock: '4.5 GHz',
        boostClock: '5.7 GHz',
        cache: '64 MB L3',
        pcie: 'PCIe 5.0',
      },
    },
    {
      name: 'AMD Ryzen 7 7800X3D',
      brand: 'AMD',
      sku: 'SEED-CPU-R7-7800X3D',
      price: 10_500_000,
      category: catIds.cpu,
      totalStock: 18,
      description: '8 nhân / 16 luồng, 3D V-Cache 96 MB. CPU gaming tốt nhất cho AM5.',
      images: [IMG.cpu('r7-7800x3d')],
      specifications: {
        socket: 'AM5',
        ramType: 'DDR5',
        tdp: 120,
        cores: '8',
        threads: '16',
        baseClock: '4.5 GHz',
        boostClock: '5.0 GHz',
        cache: '96 MB L3 (3D V-Cache)',
        pcie: 'PCIe 5.0',
      },
    },
    {
      name: 'AMD Ryzen 5 7600X',
      brand: 'AMD',
      sku: 'SEED-CPU-R5-7600X',
      price: 5_900_000,
      category: catIds.cpu,
      totalStock: 25,
      description: '6 nhân / 12 luồng, boost 5.3 GHz. Bộ xử lý tầm trung AM5 tiết kiệm.',
      images: [IMG.cpu('r5-7600x')],
      specifications: {
        socket: 'AM5',
        ramType: 'DDR5',
        tdp: 105,
        cores: '6',
        threads: '12',
        baseClock: '4.7 GHz',
        boostClock: '5.3 GHz',
        cache: '32 MB L3',
        pcie: 'PCIe 5.0',
      },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // MAINBOARD — 4 sản phẩm (LGA1700 DDR5, LGA1700 DDR4, AM5 DDR5 x2)
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: 'ASUS ROG MAXIMUS Z790 Hero',
      brand: 'ASUS',
      sku: 'SEED-MB-ROG-Z790-HERO',
      price: 18_500_000,
      category: catIds.mainboard,
      totalStock: 8,
      description: 'Bo mạch Z790 cao cấp cho Intel Gen 12/13/14. DDR5, WiFi 6E, Thunderbolt 4.',
      images: [IMG.mb()],
      specifications: {
        socket: 'LGA1700',     // Phải khớp CPU.socket
        ramType: 'DDR5',       // Phải khớp RAM.ramType
        formFactor: 'ATX',     // Phải khớp Case.supportedForms
        tdp: 20,               // Công suất tiêu thụ bo mạch
        maxRamSpeed: '7800 MHz',
        ramSlots: '4',
        pcie: 'PCIe 5.0 x16',
        m2Slots: '5',
        usb: 'USB 3.2 Gen 2x2, Thunderbolt 4',
      },
    },
    {
      name: 'Gigabyte B760 AORUS Elite AX DDR4',
      brand: 'Gigabyte',
      sku: 'SEED-MB-B760-AORUS-DDR4',
      price: 5_800_000,
      category: catIds.mainboard,
      totalStock: 20,
      description: 'Bo mạch B760 tầm trung cho Intel Gen 12/13/14. Hỗ trợ DDR4, WiFi 6.',
      images: [IMG.mb()],
      specifications: {
        socket: 'LGA1700',
        ramType: 'DDR4',       // ← DDR4, khớp với i5-13600K
        formFactor: 'ATX',
        tdp: 15,
        maxRamSpeed: '5333 MHz',
        ramSlots: '4',
        pcie: 'PCIe 4.0 x16',
        m2Slots: '3',
        usb: 'USB 3.2 Gen 2',
      },
    },
    {
      name: 'MSI MEG X670E ACE',
      brand: 'MSI',
      sku: 'SEED-MB-X670E-ACE',
      price: 15_000_000,
      category: catIds.mainboard,
      totalStock: 10,
      description: 'Bo mạch X670E flagship cho AMD AM5. DDR5, PCIe 5.0 x2, WiFi 6E.',
      images: [IMG.mb()],
      specifications: {
        socket: 'AM5',
        ramType: 'DDR5',
        formFactor: 'ATX',
        tdp: 20,
        maxRamSpeed: '7200 MHz',
        ramSlots: '4',
        pcie: 'PCIe 5.0 x16',
        m2Slots: '4',
        usb: 'USB 3.2 Gen 2x2',
      },
    },
    {
      name: 'ASUS TUF Gaming B650-Plus WiFi',
      brand: 'ASUS',
      sku: 'SEED-MB-B650-TUF-PLUS',
      price: 6_500_000,
      category: catIds.mainboard,
      totalStock: 22,
      description: 'Bo mạch B650 tầm trung cho AM5. DDR5, WiFi 6, PCIe 5.0 NVMe.',
      images: [IMG.mb()],
      specifications: {
        socket: 'AM5',
        ramType: 'DDR5',
        formFactor: 'ATX',
        tdp: 15,
        maxRamSpeed: '6400 MHz',
        ramSlots: '4',
        pcie: 'PCIe 4.0 x16',
        m2Slots: '3',
        usb: 'USB 3.2 Gen 2',
      },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // RAM — 4 sản phẩm (DDR5 x3, DDR4 x1)
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: 'G.Skill Trident Z5 RGB 32GB DDR5-6000',
      brand: 'G.Skill',
      sku: 'SEED-RAM-GS-TZ5-32G-6000',
      price: 3_800_000,
      category: catIds.ram,
      totalStock: 30,
      description: 'Kit DDR5 32GB (2x16GB) 6000MHz CL30. Đồng hồ cao, tản nhiệt RGB đẹp.',
      images: [IMG.ram()],
      specifications: {
        ramType: 'DDR5',       // Phải khớp Mainboard.ramType
        tdp: 6,
        capacity: '32GB (2×16GB)',
        speed: '6000 MHz',
        latency: 'CL30',
        voltage: '1.35V',
      },
    },
    {
      name: 'Corsair Dominator Titanium 64GB DDR5-6400',
      brand: 'Corsair',
      sku: 'SEED-RAM-COR-DOM-64G-6400',
      price: 8_200_000,
      category: catIds.ram,
      totalStock: 12,
      description: 'Kit DDR5 64GB (2x32GB) 6400MHz CL32. Hiệu suất đỉnh cho workstation.',
      images: [IMG.ram()],
      specifications: {
        ramType: 'DDR5',
        tdp: 7,
        capacity: '64GB (2×32GB)',
        speed: '6400 MHz',
        latency: 'CL32',
        voltage: '1.40V',
      },
    },
    {
      name: 'Crucial Pro 32GB DDR5-5600',
      brand: 'Crucial',
      sku: 'SEED-RAM-CRU-PRO-32G-5600',
      price: 2_600_000,
      category: catIds.ram,
      totalStock: 40,
      description: 'Kit DDR5 32GB (2x16GB) 5600MHz CL46. Giải pháp DDR5 tầm trung giá tốt.',
      images: [IMG.ram()],
      specifications: {
        ramType: 'DDR5',
        tdp: 5,
        capacity: '32GB (2×16GB)',
        speed: '5600 MHz',
        latency: 'CL46',
        voltage: '1.10V',
      },
    },
    {
      name: 'Kingston Fury Beast 32GB DDR4-3600',
      brand: 'Kingston',
      sku: 'SEED-RAM-KNG-FURY-32G-3600',
      price: 1_900_000,
      category: catIds.ram,
      totalStock: 35,
      description: 'Kit DDR4 32GB (2x16GB) 3600MHz CL18. Chuẩn vàng cho nền tảng DDR4.',
      images: [IMG.ram()],
      specifications: {
        ramType: 'DDR4',       // ← DDR4, khớp với B760/i5-13600K
        tdp: 4,
        capacity: '32GB (2×16GB)',
        speed: '3600 MHz',
        latency: 'CL18',
        voltage: '1.35V',
      },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // GPU — 4 sản phẩm
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: 'NVIDIA GeForce RTX 4090 24GB',
      brand: 'NVIDIA',
      sku: 'SEED-GPU-RTX4090',
      price: 42_000_000,
      category: catIds.gpu,
      totalStock: 5,
      description: 'Card đồ hoạ flagship Ada Lovelace. 24GB GDDR6X. Unmatched 4K gaming & AI.',
      images: [IMG.gpu()],
      specifications: {
        length: 336,           // mm — Case cần maxGPULength > 336
        tdp: 450,
        vram: '24GB GDDR6X',
        boostClock: '2520 MHz',
        powerConnectors: '3× 8-pin (hoặc 1× 16-pin)',
        outputs: 'HDMI 2.1, 3× DP 1.4a',
        pcie: 'PCIe 4.0 x16',
      },
    },
    {
      name: 'NVIDIA GeForce RTX 4070 Ti Super 16GB',
      brand: 'NVIDIA',
      sku: 'SEED-GPU-RTX4070TIS',
      price: 23_000_000,
      category: catIds.gpu,
      totalStock: 12,
      description: 'RTX 4070 Ti Super. 16GB GDDR6X. 1440p / 4K gaming hiệu năng cao.',
      images: [IMG.gpu()],
      specifications: {
        length: 285,
        tdp: 285,
        vram: '16GB GDDR6X',
        boostClock: '2610 MHz',
        powerConnectors: '3× 8-pin',
        outputs: 'HDMI 2.1, 3× DP 1.4a',
        pcie: 'PCIe 4.0 x16',
      },
    },
    {
      name: 'NVIDIA GeForce RTX 4070 12GB',
      brand: 'NVIDIA',
      sku: 'SEED-GPU-RTX4070',
      price: 16_500_000,
      category: catIds.gpu,
      totalStock: 18,
      description: 'RTX 4070. 12GB GDDR6X. 1440p gaming cực mượt, tiêu thụ điện thấp.',
      images: [IMG.gpu()],
      specifications: {
        length: 240,
        tdp: 200,
        vram: '12GB GDDR6X',
        boostClock: '2475 MHz',
        powerConnectors: '2× 8-pin',
        outputs: 'HDMI 2.1, 3× DP 1.4a',
        pcie: 'PCIe 4.0 x16',
      },
    },
    {
      name: 'AMD Radeon RX 7900 XTX 24GB',
      brand: 'AMD',
      sku: 'SEED-GPU-RX7900XTX',
      price: 28_000_000,
      category: catIds.gpu,
      totalStock: 7,
      description: 'Radeon RX 7900 XTX. 24GB GDDR6. Đối thủ xứng tầm RTX 4080 của AMD.',
      images: [IMG.gpu()],
      specifications: {
        length: 287,
        tdp: 355,
        vram: '24GB GDDR6',
        boostClock: '2500 MHz',
        powerConnectors: '2× 8-pin',
        outputs: 'HDMI 2.1, 2× DP 2.1',
        pcie: 'PCIe 4.0 x16',
      },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // PSU — 3 sản phẩm
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: 'Corsair HX1000i 1000W Platinum',
      brand: 'Corsair',
      sku: 'SEED-PSU-COR-HX1000I',
      price: 5_800_000,
      category: catIds.psu,
      totalStock: 15,
      description: '1000W 80+ Platinum, fully modular. Đủ sức nuôi RTX 4090 + i9-14900K.',
      images: [IMG.psu()],
      specifications: {
        wattage: 1000,         // Watt — phải >= Tổng TDP * 1.5
        efficiency: '80+ Platinum',
        modular: 'Full',
        formFactor: 'ATX',
        fanSize: '135mm',
        protections: 'OVP, UVP, OCP, OTP, SCP',
      },
    },
    {
      name: 'Seasonic Prime TX-850 850W Titanium',
      brand: 'Seasonic',
      sku: 'SEED-PSU-SEA-TX850',
      price: 5_200_000,
      category: catIds.psu,
      totalStock: 12,
      description: '850W 80+ Titanium, fully modular. Hiệu suất đỉnh, cực im lặng.',
      images: [IMG.psu()],
      specifications: {
        wattage: 850,
        efficiency: '80+ Titanium',
        modular: 'Full',
        formFactor: 'ATX',
        fanSize: '135mm',
        protections: 'OVP, UVP, OCP, OTP, SCP',
      },
    },
    {
      name: 'EVGA SuperNOVA 650 G6 Gold',
      brand: 'EVGA',
      sku: 'SEED-PSU-EVGA-650G6',
      price: 2_900_000,
      category: catIds.psu,
      totalStock: 25,
      description: '650W 80+ Gold, fully modular. Lựa chọn tầm trung đáng tin cậy.',
      images: [IMG.psu()],
      specifications: {
        wattage: 650,
        efficiency: '80+ Gold',
        modular: 'Full',
        formFactor: 'ATX',
        fanSize: '92mm',
        protections: 'OVP, UVP, OCP, OTP, SCP',
      },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // CASE — 3 sản phẩm
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: 'Lian Li PC-O11D EVO XL',
      brand: 'Lian Li',
      sku: 'SEED-CASE-O11D-EVO-XL',
      price: 5_500_000,
      category: catIds.case,
      totalStock: 10,
      description: 'Full Tower. Khoang VGA 420mm, tản nhiệt tối đa 167mm. Hỗ trợ ATX / E-ATX.',
      images: [IMG.case()],
      specifications: {
        maxGPULength: 420,     // mm — GPU.length phải < giá trị này
        maxCPUCoolerHeight: 167, // mm — Cooler.height phải < giá trị này
        supportedForms: ['ATX', 'E-ATX', 'm-ATX'], // Mainboard.formFactor phải có trong list này
        formFactor: 'Full Tower',
        material: 'Nhôm + Kính cường lực',
        driveBays: '4× 3.5", 4× 2.5"',
      },
    },
    {
      name: 'Fractal Design Meshify 2 XL',
      brand: 'Fractal Design',
      sku: 'SEED-CASE-MESHIFY2-XL',
      price: 4_200_000,
      category: catIds.case,
      totalStock: 14,
      description: 'Full Tower tản nhiệt đỉnh. GPU 461mm, tản nhiệt 185mm. ATX / E-ATX.',
      images: [IMG.case()],
      specifications: {
        maxGPULength: 461,
        maxCPUCoolerHeight: 185,
        supportedForms: ['ATX', 'E-ATX', 'm-ATX'],
        formFactor: 'Full Tower',
        material: 'Thép + Kính cường lực',
        driveBays: '2× 3.5", 6× 2.5"',
      },
    },
    {
      name: 'NZXT H7 Flow 2024',
      brand: 'NZXT',
      sku: 'SEED-CASE-H7-FLOW',
      price: 3_100_000,
      category: catIds.case,
      totalStock: 20,
      description: 'Mid Tower tản nhiệt tốt. GPU 380mm, tản nhiệt 185mm. ATX / m-ATX.',
      images: [IMG.case()],
      specifications: {
        maxGPULength: 380,
        maxCPUCoolerHeight: 185,
        supportedForms: ['ATX', 'm-ATX'],
        formFactor: 'Mid Tower',
        material: 'Thép + Kính cường lực',
        driveBays: '2× 3.5", 3× 2.5"',
      },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // COOLER — 3 sản phẩm
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: 'Noctua NH-D15 chromax.black',
      brand: 'Noctua',
      sku: 'SEED-COOL-NOCTUA-NHD15',
      price: 2_800_000,
      category: catIds.cooler,
      totalStock: 18,
      description: 'Tản nhiệt khí đôi tháp. Cao 165mm, TDP 250W. Hỗ trợ LGA1700 + AM5.',
      images: [IMG.cooler()],
      specifications: {
        height: 165,           // mm — Case cần maxCPUCoolerHeight > 165
        tdpSupport: 250,       // W — TDP CPU phải <= tdpSupport
        sockets: ['LGA1700', 'LGA1200', 'AM5', 'AM4'],
        type: 'Air (Dual Tower)',
        fanCount: '2× 140mm',
        noise: '24.6 dB(A)',
      },
    },
    {
      name: 'be quiet! Dark Rock Pro 4',
      brand: 'be quiet!',
      sku: 'SEED-COOL-BQ-DRP4',
      price: 2_200_000,
      category: catIds.cooler,
      totalStock: 15,
      description: 'Tản nhiệt khí siêu im lặng. Cao 162mm, TDP 250W. Dual Tower.',
      images: [IMG.cooler()],
      specifications: {
        height: 162,
        tdpSupport: 250,
        sockets: ['LGA1700', 'LGA1200', 'AM5', 'AM4'],
        type: 'Air (Dual Tower)',
        fanCount: '2× 135mm',
        noise: '24.3 dB(A)',
      },
    },
    {
      name: 'Cooler Master Hyper 212 Halo Black',
      brand: 'Cooler Master',
      sku: 'SEED-COOL-CM-H212-HALO',
      price: 680_000,
      category: catIds.cooler,
      totalStock: 40,
      description: 'Tản nhiệt giá rẻ phổ biến. Cao 158mm, TDP 150W. Phù hợp mọi build tầm trung.',
      images: [IMG.cooler()],
      specifications: {
        height: 158,
        tdpSupport: 150,
        sockets: ['LGA1700', 'LGA1200', 'AM5', 'AM4'],
        type: 'Air (Single Tower)',
        fanCount: '1× 120mm ARGB',
        noise: '27 dB(A)',
      },
    },

    // ══════════════════════════════════════════════════════════════════════════
    // SSD — 2 sản phẩm
    // ══════════════════════════════════════════════════════════════════════════
    {
      name: 'Samsung 990 Pro 2TB NVMe PCIe 4.0',
      brand: 'Samsung',
      sku: 'SEED-SSD-SAM-990PRO-2T',
      price: 3_200_000,
      category: catIds.ssd,
      totalStock: 25,
      description: 'SSD NVMe M.2 2TB. Đọc 7450 MB/s / Ghi 6900 MB/s. Ổ tốt nhất tầm trung.',
      images: [IMG.ssd()],
      specifications: {
        tdp: 8,
        capacity: '2TB',
        interface: 'PCIe 4.0 x4 (NVMe)',
        readSpeed: '7450 MB/s',
        writeSpeed: '6900 MB/s',
        formFactor: 'M.2 2280',
        warranty: '5 năm',
      },
    },
    {
      name: 'WD Black SN850X 1TB NVMe PCIe 4.0',
      brand: 'Western Digital',
      sku: 'SEED-SSD-WD-SN850X-1T',
      price: 2_100_000,
      category: catIds.ssd,
      totalStock: 30,
      description: 'SSD NVMe M.2 1TB. Đọc 7300 MB/s. Được khuyến nghị cho PS5 và gaming PC.',
      images: [IMG.ssd()],
      specifications: {
        tdp: 7,
        capacity: '1TB',
        interface: 'PCIe 4.0 x4 (NVMe)',
        readSpeed: '7300 MB/s',
        writeSpeed: '6300 MB/s',
        formFactor: 'M.2 2280',
        warranty: '5 năm',
      },
    },
  ];
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI không tìm thấy trong .env!');
    process.exit(1);
  }

  console.log('🔌  Đang kết nối MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅  Kết nối thành công!\n');

  // 1. Upsert categories -------------------------------------------------------
  console.log('📂  Đang tạo / cập nhật danh mục...');
  const catIds: Record<string, mongoose.Types.ObjectId> = {};

  for (const cat of CATEGORIES) {
    const doc = await CategoryModel.findOneAndUpdate(
      { slug: cat.slug },
      { $set: cat },
      { upsert: true, new: true },
    );
    catIds[cat.slug] = doc!._id as mongoose.Types.ObjectId;
    console.log(`   ✔  ${cat.name} (${doc!._id})`);
  }

  // 2. Xoá sản phẩm seed cũ ---------------------------------------------------
  console.log('\n🗑   Xoá sản phẩm seed cũ (sku bắt đầu bằng "SEED-")...');
  const deleteResult = await ProductModel.deleteMany({
    sku: { $regex: /^SEED-/ },
  });
  console.log(`   Đã xoá ${deleteResult.deletedCount} sản phẩm cũ.`);

  // 3. Insert sản phẩm mới -----------------------------------------------------
  console.log('\n📦  Đang thêm sản phẩm mới...');
  const products = makeProducts(catIds);
  const inserted = await ProductModel.insertMany(products, { ordered: false });
  console.log(`   ✅  Đã thêm thành công ${inserted.length} sản phẩm!\n`);

  // 4. Summary -----------------------------------------------------------------
  const summary: Record<string, number> = {};
  for (const p of inserted as any[]) {
    const slug = Object.entries(catIds).find(
      ([, id]) => id.equals(p.category),
    )?.[0] ?? 'other';
    summary[slug] = (summary[slug] ?? 0) + 1;
  }
  console.log('📊  Tổng kết:');
  for (const [slug, count] of Object.entries(summary)) {
    console.log(`   ${slug.padEnd(12)} : ${count} sản phẩm`);
  }
  console.log(
    '\n💡  Ví dụ build tương thích (Intel DDR5):\n' +
    '   CPU      : Intel Core i9-14900K  (LGA1700, DDR5)\n' +
    '   Mainboard: ASUS ROG Z790 Hero    (LGA1700, DDR5, ATX)\n' +
    '   RAM      : G.Skill Trident Z5    (DDR5 6000MHz)\n' +
    '   GPU      : RTX 4090              (336mm, 450W)\n' +
    '   PSU      : Corsair HX1000i       (1000W ≥ (125+20+6+450+20)*1.5 = 934W ✔)\n' +
    '   Cooler   : Noctua NH-D15         (165mm, ≤167mm case ✔, 250W ≥ 125W TDP ✔)\n' +
    '   Case     : Lian Li O11D EVO XL   (ATX ✔, GPU<420mm ✔, Cooler<167mm ✔)\n' +
    '   SSD      : Samsung 990 Pro 2TB\n',
  );

  await mongoose.disconnect();
  console.log('🔌  Đã ngắt kết nối. Seed hoàn tất!');
}

main().catch((err) => {
  console.error('❌  Seed thất bại:', err);
  process.exit(1);
});
