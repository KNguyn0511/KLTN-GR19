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
exports.UpdateQuantityDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateQuantityDto {
    userId;
    cartItemId;
    quantity;
}
exports.UpdateQuantityDto = UpdateQuantityDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user_abc123',
        description: 'ID của người dùng sở hữu giỏ hàng',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateQuantityDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'abc123-Core i7 - 16GB',
        description: 'cartItemId của dòng cần cập nhật (khớp với cartItemId trong useCartStore.ts của FE)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateQuantityDto.prototype, "cartItemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3,
        minimum: 1,
        description: 'Số lượng mới — tối thiểu là 1 (khớp với Math.max(1, quantity) trong FE)',
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateQuantityDto.prototype, "quantity", void 0);
//# sourceMappingURL=update-quantity.dto.js.map