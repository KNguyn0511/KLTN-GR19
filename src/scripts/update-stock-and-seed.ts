/* eslint-disable @typescript-eslint/no-require-imports */
import 'reflect-metadata';
import mongoose, { Types } from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

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
    importPrice: { type: Number, min: 0 },
    specifications: { type: Object },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    stockByLocation: [
      {
        location: { type: String, required: true },
        stock: { type: Number, default: 0, min: 0 },
      },
    ],
    totalStock: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
    description: String,
    images: [String],
    sku: { type: String, unique: true, sparse: true },
  },
  { collection: 'products', timestamps: true },
);

const CategoryModel = mongoose.model(
  'UpdateStockCategory',
  categorySchema,
  'categories',
);
const ProductModel = mongoose.model(
  'UpdateStockProduct',
  productSchema,
  'products',
);

type SeedProduct = {
  name: string;
  brand: string;
  price: number;
  importPrice: number;
  specifications: Record<string, string>;
  categoryKey: 'mouse' | 'keyboard';
  totalStock: number;
  isActive: boolean;
  description: string;
  images: string[];
  sku: string;
  stockByLocation: Array<{ location: string; stock: number }>;
};

const newProducts: SeedProduct[] = [
  {
    name: 'Logitech G Pro X Superlight 2',
    brand: 'Logitech',
    price: 2990000,
    importPrice: 2190000,
    specifications: {
      type: 'Wireless Gaming Mouse',
      sensor: 'HERO 2',
      dpi: '32000',
      weight: '60g',
      connectivity: '2.4GHz / USB',
    },
    categoryKey: 'mouse',
    totalStock: 18,
    isActive: true,
    description:
      'Chuột gaming siêu nhẹ cho eSports, cảm biến HERO 2, kết nối không dây Lightspeed.',
    images: ['https://bizweb.dktcdn.net/100/329/122/products/chuot-gaming-khong-day-logitech-g-pro-x-superlight-2-d9fa496b-1eb8-49e5-a9a1-4c275aa234a3.jpg?v=1775013013570'],
    sku: 'SEED-MOUSE-LOGI-GPROX-SL2',
    stockByLocation: [
      { location: 'Kho HCM', stock: 10 },
      { location: 'Kho HN', stock: 8 },
    ],
  },
  {
    name: 'Razer DeathAdder V3 Pro',
    brand: 'Razer',
    price: 2890000,
    importPrice: 2120000,
    specifications: {
      type: 'Wireless Gaming Mouse',
      sensor: 'Focus Pro 30K',
      dpi: '30000',
      weight: '63g',
      connectivity: '2.4GHz / USB',
    },
    categoryKey: 'mouse',
    totalStock: 15,
    isActive: true,
    description: 'Chuột công thái học gaming cao cấp, trọng lượng nhẹ, tối ưu FPS.',
    images: ['https://bizweb.dktcdn.net/100/329/122/products/chuot-gaming-khong-day-razer-deathadder-v3-pro-0a5a68a8-10c5-433d-bece-b49ec8828fc5.jpg?v=1775011722150'],
    sku: 'SEED-MOUSE-RAZ-DEATHADDER-V3PRO',
    stockByLocation: [
      { location: 'Kho HCM', stock: 9 },
      { location: 'Kho HN', stock: 6 },
    ],
  },
  {
    name: 'SteelSeries Aerox 5 Wireless',
    brand: 'SteelSeries',
    price: 2590000,
    importPrice: 1890000,
    specifications: {
      type: 'Wireless Gaming Mouse',
      sensor: 'TrueMove Air',
      dpi: '18000',
      weight: '74g',
      connectivity: '2.4GHz / Bluetooth',
    },
    categoryKey: 'mouse',
    totalStock: 12,
    isActive: true,
    description: 'Chuột gaming nhẹ, 9 nút lập trình, phù hợp cả MMO và FPS.',
    images: ['https://images.ctfassets.net/hmm5mo4qf4mf/38UAy46w6SLE1AAz0d4HCK/504897ba060c4698a3905b6562ddd6e0/aerox_5_destiny2_lightfall_pdp_img_buy_04.png__1920x1080_crop-fit_optimize_subsampling-2-883.png'],
    sku: 'SEED-MOUSE-SS-AEROX5-WL',
    stockByLocation: [
      { location: 'Kho HCM', stock: 7 },
      { location: 'Kho HN', stock: 5 },
    ],
  },
  {
    name: 'Logitech MX Master 3S',
    brand: 'Logitech',
    price: 2390000,
    importPrice: 1720000,
    specifications: {
      type: 'Wireless Office Mouse',
      sensor: 'Darkfield',
      dpi: '8000',
      weight: '141g',
      connectivity: '2.4GHz / Bluetooth',
    },
    categoryKey: 'mouse',
    totalStock: 22,
    isActive: true,
    description: 'Chuột văn phòng cao cấp, cuộn siêu nhanh, làm việc đa thiết bị rất mượt.',
    images: ['https://product.hstatic.net/200000837185/product/mx-master-3s-mouse-top-side-view-graphite-copy_efd6357117584008b534ce91af794961_master.jpg'],
    sku: 'SEED-MOUSE-LOGI-MXMASTER3S',
    stockByLocation: [
      { location: 'Kho HCM', stock: 12 },
      { location: 'Kho HN', stock: 10 },
    ],
  },
  {
    name: 'Microsoft Bluetooth Ergonomic Mouse',
    brand: 'Microsoft',
    price: 890000,
    importPrice: 640000,
    specifications: {
      type: 'Wireless Office Mouse',
      sensor: 'BlueTrack',
      dpi: '4000',
      weight: '90g',
      connectivity: 'Bluetooth',
    },
    categoryKey: 'mouse',
    totalStock: 30,
    isActive: true,
    description: 'Chuột văn phòng công thái học, cầm thoải mái cho thời gian làm việc dài.',
    images: ['https://surfacepro.vn/thumb/468/upload/surfacepro.vn/phu-kien/microsoft-bluetooth-ergonomic-mouse/new-microsoft-bluetooth-ergonomic-mouse_3.jpg'],
    sku: 'SEED-MOUSE-MS-ERGOBT',
    stockByLocation: [
      { location: 'Kho HCM', stock: 16 },
      { location: 'Kho HN', stock: 14 },
    ],
  },
  {
    name: 'Corsair Harpoon RGB Wireless',
    brand: 'Corsair',
    price: 1290000,
    importPrice: 930000,
    specifications: {
      type: 'Wireless Gaming Mouse',
      sensor: 'PixArt',
      dpi: '10000',
      weight: '99g',
      connectivity: '2.4GHz / Bluetooth / USB',
    },
    categoryKey: 'mouse',
    totalStock: 14,
    isActive: true,
    description: 'Chuột gaming giá tốt, gọn nhẹ, RGB đẹp, kết nối kép tiện lợi.',
    images: ['https://i.rtings.com/assets/products/Mw66Kedd/corsair-harpoon-rgb-wireless/design-medium.jpg?format=auto'],
    sku: 'SEED-MOUSE-COR-HARPOON-RGB-WL',
    stockByLocation: [
      { location: 'Kho HCM', stock: 8 },
      { location: 'Kho HN', stock: 6 },
    ],
  },
  {
    name: 'ASUS ROG Keris II Ace',
    brand: 'ASUS',
    price: 2790000,
    importPrice: 2050000,
    specifications: {
      type: 'Wireless Gaming Mouse',
      sensor: 'ROG AimPoint Pro',
      dpi: '42000',
      weight: '54g',
      connectivity: '2.4GHz / Bluetooth / USB',
    },
    categoryKey: 'mouse',
    totalStock: 10,
    isActive: true,
    description: 'Chuột eSports siêu nhẹ, pin tốt, tối ưu cho game bắn súng cạnh tranh.',
    images: ['https://dlcdnwebimgs.asus.com/files/media/BCABBC17-8970-4EF2-8DD5-7720E66A593F/v2/img/features/rog-patterned-grip-tape.jpg'],
    sku: 'SEED-MOUSE-ASUS-KERIS2-ACE',
    stockByLocation: [
      { location: 'Kho HCM', stock: 5 },
      { location: 'Kho HN', stock: 5 },
    ],
  },
  {
    name: 'HyperX Pulsefire Haste 2',
    brand: 'HyperX',
    price: 1490000,
    importPrice: 1080000,
    specifications: {
      type: 'Wired Gaming Mouse',
      sensor: 'HyperX 26K',
      dpi: '26000',
      weight: '53g',
      connectivity: 'USB',
    },
    categoryKey: 'mouse',
    totalStock: 16,
    isActive: true,
    description: 'Chuột gaming siêu nhẹ, cảm giác bấm nhanh, hợp cho FPS.',
    images: ['https://row.hyperx.com/cdn/shop/files/hyperx_pulsefire_haste_2_pro_4k_wireless_a1ky5aa_angle_9.jpg?v=1772642477'],
    sku: 'SEED-MOUSE-HX-HASTE2',
    stockByLocation: [
      { location: 'Kho HCM', stock: 9 },
      { location: 'Kho HN', stock: 7 },
    ],
  },
  {
    name: 'Rapoo MT760L',
    brand: 'Rapoo',
    price: 990000,
    importPrice: 720000,
    specifications: {
      type: 'Wireless Office Mouse',
      sensor: 'High Precision',
      dpi: '4000',
      weight: '82g',
      connectivity: '2.4GHz / Bluetooth',
    },
    categoryKey: 'mouse',
    totalStock: 28,
    isActive: true,
    description: 'Chuột đa thiết bị, công thái học, hợp văn phòng và học tập.',
    images: ['https://m.media-amazon.com/images/I/613-r1RUz6L.jpg'],
    sku: 'SEED-MOUSE-RAPOO-MT760L',
    stockByLocation: [
      { location: 'Kho HCM', stock: 15 },
      { location: 'Kho HN', stock: 13 },
    ],
  },
  {
    name: 'Lenovo Legion M600s Qi',
    brand: 'Lenovo',
    price: 1790000,
    importPrice: 1290000,
    specifications: {
      type: 'Wireless Gaming Mouse',
      sensor: 'PixArt PAW3335',
      dpi: '16000',
      weight: '75g',
      connectivity: '2.4GHz / Bluetooth / Qi',
    },
    categoryKey: 'mouse',
    totalStock: 11,
    isActive: true,
    description: 'Chuột gaming pin lâu, hỗ trợ sạc Qi, thiết kế cân bằng cho cả game và work.',
    images: ['https://static-media.laptopoutlet.co.uk/catalog/product/8/3/8341d51cd254ba177a978742f7ce4c65.jpg?height=650'],
    sku: 'SEED-MOUSE-LENOVO-M600S-QI',
    stockByLocation: [
      { location: 'Kho HCM', stock: 6 },
      { location: 'Kho HN', stock: 5 },
    ],
  },
  {
    name: 'Keychron K8 Pro',
    brand: 'Keychron',
    price: 2590000,
    importPrice: 1890000,
    specifications: {
      type: 'Mechanical Keyboard',
      layout: 'TKL',
      switch: 'Hot-swap',
      connectivity: 'Bluetooth / USB-C',
      keycaps: 'Double-shot PBT',
    },
    categoryKey: 'keyboard',
    totalStock: 16,
    isActive: true,
    description: 'Bàn phím cơ TKL hot-swap, phù hợp làm việc lẫn chơi game.',
    images: ['https://tawin.vn/wp-content/uploads/2022/11/design-medium.jpg'],
    sku: 'SEED-KB-KEYCHRON-K8PRO',
    stockByLocation: [
      { location: 'Kho HCM', stock: 9 },
      { location: 'Kho HN', stock: 7 },
    ],
  },
  {
    name: 'Logitech MX Keys S',
    brand: 'Logitech',
    price: 2690000,
    importPrice: 1940000,
    specifications: {
      type: 'Office Keyboard',
      layout: 'Full-size',
      switch: 'Scissor',
      connectivity: 'Bluetooth / USB',
      keycaps: 'Low-profile',
    },
    categoryKey: 'keyboard',
    totalStock: 24,
    isActive: true,
    description: 'Bàn phím văn phòng mỏng, gõ êm, kết nối đa thiết bị, pin cực tốt.',
    images: ['https://m.media-amazon.com/images/I/71G7uXAb9BL._AC_UF894,1000_QL80_.jpg'],
    sku: 'SEED-KB-LOGI-MXKEYS-S',
    stockByLocation: [
      { location: 'Kho HCM', stock: 13 },
      { location: 'Kho HN', stock: 11 },
    ],
  },
  {
    name: 'Razer BlackWidow V4 Pro',
    brand: 'Razer',
    price: 4590000,
    importPrice: 3320000,
    specifications: {
      type: 'Mechanical Keyboard',
      layout: 'Full-size',
      switch: 'Razer Green',
      connectivity: 'USB',
      keycaps: 'Double-shot ABS',
    },
    categoryKey: 'keyboard',
    totalStock: 9,
    isActive: true,
    description: 'Bàn phím gaming full-size cao cấp, RGB mạnh, nhiều nút macro.',
    images: ['https://m.media-amazon.com/images/I/81L4FpeS3VL._AC_UF894,1000_QL80_.jpg'],
    sku: 'SEED-KB-RAZ-BW-V4PRO',
    stockByLocation: [
      { location: 'Kho HCM', stock: 5 },
      { location: 'Kho HN', stock: 4 },
    ],
  },
  {
    name: 'ASUS ROG Azoth',
    brand: 'ASUS',
    price: 5490000,
    importPrice: 3990000,
    specifications: {
      type: 'Mechanical Keyboard',
      layout: '75%',
      switch: 'Hot-swap',
      connectivity: '2.4GHz / Bluetooth / USB-C',
      keycaps: 'PBT',
    },
    categoryKey: 'keyboard',
    totalStock: 8,
    isActive: true,
    description: 'Bàn phím custom gaming 75%, gasket mount, màn hình OLED nhỏ.',
    images: ['https://bizweb.dktcdn.net/thumb/1024x1024/100/443/218/products/71809-ban-phim-gaming-khong-day-asus-rog-azoth-nx-den-red-switch-wireless-bluetooth-usb-oled-scr-90mp03-4-jpeg.jpg?v=1744454681563'],
    sku: 'SEED-KB-ASUS-ROG-AZOTH',
    stockByLocation: [
      { location: 'Kho HCM', stock: 4 },
      { location: 'Kho HN', stock: 4 },
    ],
  },
  {
    name: 'Corsair K70 RGB Pro',
    brand: 'Corsair',
    price: 3290000,
    importPrice: 2390000,
    specifications: {
      type: 'Mechanical Keyboard',
      layout: 'Full-size',
      switch: 'Cherry MX / OPX',
      connectivity: 'USB',
      keycaps: 'Double-shot PBT',
    },
    categoryKey: 'keyboard',
    totalStock: 13,
    isActive: true,
    description: 'Bàn phím gaming full-size, switch quang, polling rate cao.',
    images: ['https://nguyencongpc.vn/media/lib/27-01-2023/bnphmgamecorsairk70rgbprobluesw2.jpg'],
    sku: 'SEED-KB-COR-K70-RGB-PRO',
    stockByLocation: [
      { location: 'Kho HCM', stock: 7 },
      { location: 'Kho HN', stock: 6 },
    ],
  },
  {
    name: 'Ducky One 3 TKL',
    brand: 'Ducky',
    price: 2490000,
    importPrice: 1790000,
    specifications: {
      type: 'Mechanical Keyboard',
      layout: 'TKL',
      switch: 'Cherry MX',
      connectivity: 'USB-C',
      keycaps: 'PBT',
    },
    categoryKey: 'keyboard',
    totalStock: 17,
    isActive: true,
    description: 'Bàn phím cơ TKL gõ sướng, build quality tốt, hợp văn phòng và game.',
    images: ['https://product.hstatic.net/200000722513/product/earvn-ban-phim-ducky-one-3-tkl-fuji-2_c7cd851a613a4abe8da353868a48b8c2_7d1f4f439d7d4329a25f7484bdd7baab.jpg'],
    sku: 'SEED-KB-DUCKY-ONE3-TKL',
    stockByLocation: [
      { location: 'Kho HCM', stock: 9 },
      { location: 'Kho HN', stock: 8 },
    ],
  },
  {
    name: 'Akko 5075B Plus',
    brand: 'Akko',
    price: 1990000,
    importPrice: 1450000,
    specifications: {
      type: 'Mechanical Keyboard',
      layout: '75%',
      switch: 'Hot-swap',
      connectivity: '2.4GHz / Bluetooth / USB-C',
      keycaps: 'PBT',
    },
    categoryKey: 'keyboard',
    totalStock: 20,
    isActive: true,
    description: 'Bàn phím cơ 75% hot-swap, kết nối 3 chế độ, âm gõ dễ chịu.',
    images: ['https://truonggiang.vn/wp-content/uploads/2023/04/ban-phim-AKKO-5075B-Plus-Naruto.png'],
    sku: 'SEED-KB-AKKO-5075B-PLUS',
    stockByLocation: [
      { location: 'Kho HCM', stock: 11 },
      { location: 'Kho HN', stock: 9 },
    ],
  },
  {
    name: 'SteelSeries Apex Pro TKL Wireless',
    brand: 'SteelSeries',
    price: 5190000,
    importPrice: 3790000,
    specifications: {
      type: 'Mechanical Keyboard',
      layout: 'TKL',
      switch: 'OmniPoint 2.0',
      connectivity: '2.4GHz / Bluetooth / USB-C',
      keycaps: 'PBT',
    },
    categoryKey: 'keyboard',
    totalStock: 7,
    isActive: true,
    description: 'Bàn phím gaming cao cấp với switch OmniPoint, wireless tiện lợi.',
    images: ['https://azaudio.vn/wp-content/uploads/2024/03/steelseries-apex-pro-tkl-wireless-2023-1.jpg'],
    sku: 'SEED-KB-SS-APEXPRO-TKL-WL',
    stockByLocation: [
      { location: 'Kho HCM', stock: 4 },
      { location: 'Kho HN', stock: 3 },
    ],
  },
  {
    name: 'Logitech G Pro X TKL Lightspeed',
    brand: 'Logitech',
    price: 3890000,
    importPrice: 2820000,
    specifications: {
      type: 'Mechanical Keyboard',
      layout: 'TKL',
      switch: 'GX / Hot-swap',
      connectivity: '2.4GHz / Bluetooth / USB-C',
      keycaps: 'PBT',
    },
    categoryKey: 'keyboard',
    totalStock: 14,
    isActive: true,
    description: 'Bàn phím eSports TKL, wireless Lightspeed, thiết kế tối giản.',
    images: ['https://bizweb.dktcdn.net/100/329/122/files/pro-x-tkl-01.jpg?v=1694598001954'],
    sku: 'SEED-KB-LOGI-GPROX-TKL',
    stockByLocation: [
      { location: 'Kho HCM', stock: 8 },
      { location: 'Kho HN', stock: 6 },
    ],
  },
  {
    name: 'NuPhy Air75 V2',
    brand: 'NuPhy',
    price: 2790000,
    importPrice: 1990000,
    specifications: {
      type: 'Low-profile Keyboard',
      layout: '75%',
      switch: 'Low-profile hot-swap',
      connectivity: '2.4GHz / Bluetooth / USB-C',
      keycaps: 'PBT',
    },
    categoryKey: 'keyboard',
    totalStock: 19,
    isActive: true,
    description: 'Bàn phím low-profile 75%, mỏng nhẹ, phù hợp văn phòng hiện đại.',
    images: ['https://cdn.mos.cms.futurecdn.net/Zs9xkoB4gaq9Qw8vvgkweP.jpg'],
    sku: 'SEED-KB-NUPHY-AIR75-V2',
    stockByLocation: [
      { location: 'Kho HCM', stock: 10 },
      { location: 'Kho HN', stock: 9 },
    ],
  },
  {
    name: 'Keychron Q1 Pro',
    brand: 'Keychron',
    price: 4990000,
    importPrice: 3590000,
    specifications: {
      type: 'Mechanical Keyboard',
      layout: '75%',
      switch: 'Hot-swap',
      connectivity: '2.4GHz / Bluetooth / USB-C',
      keycaps: 'PBT',
    },
    categoryKey: 'keyboard',
    totalStock: 6,
    isActive: true,
    description: 'Bàn phím custom premium 75%, vỏ nhôm, âm gõ đầm tay.',
    images: ['https://siliconz.vn/cdn/shop/files/keychron-q1-pro-2.jpg?v=1719914487&width=1445'],
    sku: 'SEED-KB-KEYCHRON-Q1PRO',
    stockByLocation: [
      { location: 'Kho HCM', stock: 3 },
      { location: 'Kho HN', stock: 3 },
    ],
  },
  {
    name: 'Testing Purchase Product',
    brand: 'Keychron',
    price: 5000,
    importPrice: 2000,
    specifications: {
      type: 'Mechanical Keyboard',
      layout: '75%',
      switch: 'Hot-swap',
      connectivity: '2.4GHz / Bluetooth / USB-C',
      keycaps: 'PBT',
    },
    categoryKey: 'keyboard',
    totalStock: 62,
    isActive: true,
    description: 'Bàn phím custom premium 75%, vỏ nhôm, âm gõ đầm tay.',
    images: ['https://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://gcs.tripi.vn/public-tripi/tripi-feed/img/474387znX/tong-hop-meme-tien-hai-huoc_092058812.jpg'],
    sku: 'SEED-TEST',
    stockByLocation: [
      { location: 'Kho HCM', stock: 3 },
      { location: 'Kho HN', stock: 3 },
    ],
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI không tìm thấy trong .env');
    process.exit(1);
  }

  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('✅ Connected to MongoDB');

  const existingCategories = await CategoryModel.find({
    slug: { $in: ['mouse', 'keyboard'] },
  })
    .select('_id slug name')
    .lean()
    .exec();

  const categoryMap = new Map<string, Types.ObjectId>();
  for (const category of existingCategories) {
    categoryMap.set(String(category.slug), category._id as Types.ObjectId);
  }

  const missingCategories = [] as Array<{
    name: string;
    slug: string;
    pcBuilderVisible: boolean;
    isDeleted: boolean;
  }>;

  if (!categoryMap.has('mouse')) {
    missingCategories.push({
      name: 'Mouse',
      slug: 'mouse',
      pcBuilderVisible: true,
      isDeleted: false,
    });
  }

  if (!categoryMap.has('keyboard')) {
    missingCategories.push({
      name: 'Keyboard',
      slug: 'keyboard',
      pcBuilderVisible: true,
      isDeleted: false,
    });
  }

  if (missingCategories.length > 0) {
    const createdCategories = await CategoryModel.create(missingCategories);
    const createdArray = Array.isArray(createdCategories)
      ? createdCategories
      : [createdCategories];

    for (const category of createdArray) {
      categoryMap.set(String(category.slug), category._id as Types.ObjectId);
    }
  }

  const mouseCategoryId = categoryMap.get('mouse');
  const keyboardCategoryId = categoryMap.get('keyboard');

  if (!mouseCategoryId || !keyboardCategoryId) {
    throw new Error(
      'Missing Mouse or Keyboard category in the database. Please ensure both categories exist before seeding.',
    );
  }

  const productsToInsert = newProducts.map((product) => ({
    name: product.name,
    brand: product.brand,
    price: product.price,
    importPrice: product.importPrice,
    specifications: product.specifications,
    category:
      product.categoryKey === 'mouse' ? mouseCategoryId : keyboardCategoryId,
    stockByLocation: product.stockByLocation,
    totalStock: product.totalStock,
    isActive: product.isActive,
    description: product.description,
    images: product.images,
    sku: product.sku,
  }));

  const inserted = await ProductModel.insertMany(productsToInsert, {
    ordered: false,
  });

  console.log(
    `Successfully generated and inserted ${inserted.length} new products across ${new Set(productsToInsert.map((item) => String(item.category))).size} categories`,
  );

  await mongoose.disconnect();
  console.log('🔌 Disconnected from MongoDB');
}

main().catch(async (err) => {
  console.error('❌ Script failed:', err);
  try {
    await mongoose.disconnect();
  } catch {
    // ignore
  }
  process.exit(1);
});
