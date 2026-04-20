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
exports.StockTransferSchema = exports.StockTransfer = exports.StockTransferItemSchema = exports.StockTransferItem = exports.StockTransferStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var StockTransferStatus;
(function (StockTransferStatus) {
    StockTransferStatus["SHIPPING"] = "SHIPPING";
    StockTransferStatus["DELIVERED"] = "DELIVERED";
    StockTransferStatus["CANCELLED"] = "CANCELLED";
})(StockTransferStatus || (exports.StockTransferStatus = StockTransferStatus = {}));
let StockTransferItem = class StockTransferItem {
    productId;
    quantity;
};
exports.StockTransferItem = StockTransferItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StockTransferItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], StockTransferItem.prototype, "quantity", void 0);
exports.StockTransferItem = StockTransferItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], StockTransferItem);
exports.StockTransferItemSchema = mongoose_1.SchemaFactory.createForClass(StockTransferItem);
let StockTransfer = class StockTransfer extends mongoose_2.Document {
    fromBranch;
    sourceRequestId;
    toBranch;
    items;
    status;
    transferDate;
};
exports.StockTransfer = StockTransfer;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Branch', default: null }),
    __metadata("design:type", Object)
], StockTransfer.prototype, "fromBranch", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'StockRequest', default: null }),
    __metadata("design:type", Object)
], StockTransfer.prototype, "sourceRequestId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Branch', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StockTransfer.prototype, "toBranch", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.StockTransferItemSchema], default: [] }),
    __metadata("design:type", Array)
], StockTransfer.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: StockTransferStatus,
        default: StockTransferStatus.SHIPPING,
    }),
    __metadata("design:type", String)
], StockTransfer.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Date, default: Date.now }),
    __metadata("design:type", Date)
], StockTransfer.prototype, "transferDate", void 0);
exports.StockTransfer = StockTransfer = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], StockTransfer);
exports.StockTransferSchema = mongoose_1.SchemaFactory.createForClass(StockTransfer);
//# sourceMappingURL=stock-transfer.schema.js.map