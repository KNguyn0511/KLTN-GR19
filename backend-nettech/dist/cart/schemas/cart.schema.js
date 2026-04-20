"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartSchema = exports.Cart = exports.CartItemSchema = exports.CartItem = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
let CartItem = class CartItem {
    cartItemId;
    productId;
    name;
    price;
    image;
    quantity;
    configName;
    sku;
};
exports.CartItem = CartItem;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'abc123-Core i7 - 16GB',
        description: 'ID phân biệt mỗi dòng trong giỏ hàng (= productId + configName). ' +
            'Khớp với cartItemId trong useCartStore.ts của FE',
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CartItem.prototype, "cartItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '65af3000f123456789abcdef',
        description: 'MongoDB _id của sản phẩm (tương ứng với id trong CartItem FE)',
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CartItem.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Laptop Asus ROG Strix G16', description: 'Tên sản phẩm' }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CartItem.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 32990000, description: 'Đơn giá tại thời điểm thêm vào giỏ' }),
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], CartItem.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://cdn.example.com/img/rog.jpg',
        description: 'URL ảnh đại diện sản phẩm (tương ứng với image trong CartItem FE)',
    }),
    (0, mongoose_1.Prop)({ default: '' }),
    __metadata("design:type", String)
], CartItem.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Số lượng, tối thiểu là 1', minimum: 1 }),
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], CartItem.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Core i7 - 16GB - 512GB',
        description: 'Tên cấu hình được chọn (không bắt buộc)',
        required: false,
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CartItem.prototype, "configName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'G614JV-N3014W',
        description: 'Mã SKU của sản phẩm (không bắt buộc)',
        required: false,
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CartItem.prototype, "sku", void 0);
exports.CartItem = CartItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], CartItem);
exports.CartItemSchema = mongoose_1.SchemaFactory.createForClass(CartItem);
let Cart = class Cart extends mongoose_2.Document {
    userId;
    items;
};
exports.Cart = Cart;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user_abc123',
        description: 'ID của người dùng sở hữu giỏ hàng (mỗi user có đúng 1 giỏ)',
    }),
    (0, mongoose_1.Prop)({ required: true, unique: true, index: true }),
    __metadata("design:type", String)
], Cart.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [CartItem],
        description: 'Danh sách sản phẩm trong giỏ hàng',
    }),
    (0, mongoose_1.Prop)({ type: [exports.CartItemSchema], default: [] }),
    __metadata("design:type", Array)
], Cart.prototype, "items", void 0);
exports.Cart = Cart = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Cart);
exports.CartSchema = mongoose_1.SchemaFactory.createForClass(Cart);
//# sourceMappingURL=cart.schema.js.map