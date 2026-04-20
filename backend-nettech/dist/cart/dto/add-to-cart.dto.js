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
exports.AddToCartDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class AddToCartDto {
    userId;
    productId;
    cartItemId;
    name;
    price;
    image;
    quantity;
    configName;
    sku;
}
exports.AddToCartDto = AddToCartDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user_abc123',
        description: 'ID của người dùng (lấy từ session hoặc JWT sau này)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '65af3000f123456789abcdef',
        description: 'MongoDB _id của sản phẩm (= id trong CartItem FE)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'abc123-Core i7 - 16GB',
        description: 'ID phân biệt dòng trong giỏ (productId + configName). ' +
            'Nếu cartItemId đã tồn tại trong giỏ thì tăng số lượng thay vì thêm mới',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "cartItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Laptop Asus ROG Strix G16' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 32990000, minimum: 0 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AddToCartDto.prototype, "price", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://cdn.example.com/img/rog.jpg',
        required: false,
        default: '',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, minimum: 1, default: 1 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddToCartDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Core i7 - 16GB - 512GB',
        required: false,
        description: 'Cấu hình được chọn (configName trong FE)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "configName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'G614JV-N3014W',
        required: false,
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], AddToCartDto.prototype, "sku", void 0);
//# sourceMappingURL=add-to-cart.dto.js.map