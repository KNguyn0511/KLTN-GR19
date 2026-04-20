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
exports.CartRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cart_schema_1 = require("./schemas/cart.schema");
let CartRepository = class CartRepository {
    cartModel;
    constructor(cartModel) {
        this.cartModel = cartModel;
    }
    async findOrCreateByUserId(userId) {
        const cart = await this.cartModel.findOne({ userId }).exec();
        if (cart)
            return cart;
        return await this.cartModel.create({ userId, items: [] });
    }
    async findByUserId(userId) {
        return await this.cartModel.findOne({ userId }).exec();
    }
    async pushItem(userId, item) {
        return await this.cartModel
            .findOneAndUpdate({ userId }, { $push: { items: item } }, { new: true })
            .exec();
    }
    async incrementQuantity(userId, cartItemId, amount) {
        return await this.cartModel
            .findOneAndUpdate({ userId, 'items.cartItemId': cartItemId }, { $inc: { 'items.$.quantity': amount } }, { new: true })
            .exec();
    }
    async setQuantity(userId, cartItemId, quantity) {
        return await this.cartModel
            .findOneAndUpdate({ userId, 'items.cartItemId': cartItemId }, { $set: { 'items.$.quantity': quantity } }, { new: true })
            .exec();
    }
    async removeItem(userId, cartItemId) {
        return await this.cartModel
            .findOneAndUpdate({ userId }, { $pull: { items: { cartItemId } } }, { new: true })
            .exec();
    }
    async clearCart(userId) {
        return await this.cartModel
            .findOneAndUpdate({ userId }, { $set: { items: [] } }, { new: true })
            .exec();
    }
};
exports.CartRepository = CartRepository;
exports.CartRepository = CartRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(cart_schema_1.Cart.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CartRepository);
//# sourceMappingURL=cart.repository.js.map