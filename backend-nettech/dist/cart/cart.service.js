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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const cart_repository_1 = require("./cart.repository");
let CartService = class CartService {
    cartRepository;
    constructor(cartRepository) {
        this.cartRepository = cartRepository;
    }
    async getCart(userId) {
        return await this.cartRepository.findOrCreateByUserId(userId);
    }
    async addItem(dto) {
        const cart = await this.cartRepository.findOrCreateByUserId(dto.userId);
        const exists = cart.items.some((item) => item.cartItemId === dto.cartItemId);
        if (exists) {
            const updated = await this.cartRepository.incrementQuantity(dto.userId, dto.cartItemId, dto.quantity);
            return updated;
        }
        const newItem = {
            cartItemId: dto.cartItemId,
            productId: dto.productId,
            name: dto.name,
            price: dto.price,
            image: dto.image ?? '',
            quantity: dto.quantity,
            configName: dto.configName,
            sku: dto.sku,
        };
        const updated = await this.cartRepository.pushItem(dto.userId, newItem);
        return updated;
    }
    async updateQuantity(dto) {
        const cart = await this.cartRepository.findByUserId(dto.userId);
        if (!cart)
            throw new common_1.NotFoundException('Không tìm thấy giỏ hàng của user này!');
        const itemExists = cart.items.some((item) => item.cartItemId === dto.cartItemId);
        if (!itemExists)
            throw new common_1.NotFoundException(`Không tìm thấy sản phẩm với cartItemId "${dto.cartItemId}" trong giỏ!`);
        const updated = await this.cartRepository.setQuantity(dto.userId, dto.cartItemId, dto.quantity);
        return updated;
    }
    async removeItem(userId, cartItemId) {
        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart)
            throw new common_1.NotFoundException('Không tìm thấy giỏ hàng của user này!');
        const updated = await this.cartRepository.removeItem(userId, cartItemId);
        return updated;
    }
    async clearCart(userId) {
        const cart = await this.cartRepository.findByUserId(userId);
        if (!cart)
            throw new common_1.NotFoundException('Không tìm thấy giỏ hàng của user này!');
        await this.cartRepository.clearCart(userId);
        return { message: 'Đã xóa toàn bộ giỏ hàng!' };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [cart_repository_1.CartRepository])
], CartService);
//# sourceMappingURL=cart.service.js.map