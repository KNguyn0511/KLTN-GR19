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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cart_service_1 = require("./cart.service");
const add_to_cart_dto_1 = require("./dto/add-to-cart.dto");
const update_quantity_dto_1 = require("./dto/update-quantity.dto");
let CartController = class CartController {
    cartService;
    constructor(cartService) {
        this.cartService = cartService;
    }
    addItem(dto) {
        return this.cartService.addItem(dto);
    }
    getCart(userId) {
        return this.cartService.getCart(userId);
    }
    updateQuantity(dto) {
        return this.cartService.updateQuantity(dto);
    }
    removeItem(userId, cartItemId) {
        return this.cartService.removeItem(userId, cartItemId);
    }
    clearCart(userId) {
        return this.cartService.clearCart(userId);
    }
};
exports.CartController = CartController;
__decorate([
    (0, common_1.Post)('add'),
    (0, swagger_1.ApiOperation)({
        summary: 'Thêm sản phẩm vào giỏ hàng (hoặc tăng số lượng nếu đã có)',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [add_to_cart_dto_1.AddToCartDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "addItem", null);
__decorate([
    (0, common_1.Get)(':userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy giỏ hàng của một user theo userId' }),
    (0, swagger_1.ApiParam)({
        name: 'userId',
        example: 'user_abc123',
        description: 'ID của người dùng',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "getCart", null);
__decorate([
    (0, common_1.Patch)('update-quantity'),
    (0, swagger_1.ApiOperation)({
        summary: 'Cập nhật số lượng của một sản phẩm trong giỏ hàng',
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_quantity_dto_1.UpdateQuantityDto]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "updateQuantity", null);
__decorate([
    (0, common_1.Delete)('remove/:userId/:cartItemId'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa một sản phẩm khỏi giỏ hàng theo cartItemId' }),
    (0, swagger_1.ApiParam)({ name: 'userId', example: 'user_abc123' }),
    (0, swagger_1.ApiParam)({
        name: 'cartItemId',
        example: 'abc123-Core i7 - 16GB',
        description: 'cartItemId phân biệt dòng trong giỏ (= productId + configName)',
    }),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('cartItemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "removeItem", null);
__decorate([
    (0, common_1.Delete)('clear/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa toàn bộ giỏ hàng sau khi đặt hàng thành công' }),
    (0, swagger_1.ApiParam)({ name: 'userId', example: 'user_abc123' }),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CartController.prototype, "clearCart", null);
exports.CartController = CartController = __decorate([
    (0, swagger_1.ApiTags)('Cart'),
    (0, common_1.Controller)('cart'),
    __metadata("design:paramtypes", [cart_service_1.CartService])
], CartController);
//# sourceMappingURL=cart.controller.js.map