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
exports.StockRequestSchema = exports.StockRequest = exports.StockRequestItemSchema = exports.StockRequestItem = exports.StockRequestStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var StockRequestStatus;
(function (StockRequestStatus) {
    StockRequestStatus["PENDING"] = "PENDING";
    StockRequestStatus["APPROVED"] = "APPROVED";
    StockRequestStatus["REJECTED"] = "REJECTED";
    StockRequestStatus["COMPLETED"] = "COMPLETED";
})(StockRequestStatus || (exports.StockRequestStatus = StockRequestStatus = {}));
let StockRequestItem = class StockRequestItem {
    productId;
    quantity;
};
exports.StockRequestItem = StockRequestItem;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Product', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StockRequestItem.prototype, "productId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], StockRequestItem.prototype, "quantity", void 0);
exports.StockRequestItem = StockRequestItem = __decorate([
    (0, mongoose_1.Schema)({ _id: false })
], StockRequestItem);
exports.StockRequestItemSchema = mongoose_1.SchemaFactory.createForClass(StockRequestItem);
let StockRequest = class StockRequest extends mongoose_2.Document {
    requester;
    branchId;
    sourceBranchId;
    items;
    status;
    note;
};
exports.StockRequest = StockRequest;
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StockRequest.prototype, "requester", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Branch', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StockRequest.prototype, "branchId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Branch', default: null }),
    __metadata("design:type", Object)
], StockRequest.prototype, "sourceBranchId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [exports.StockRequestItemSchema], default: [] }),
    __metadata("design:type", Array)
], StockRequest.prototype, "items", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: StockRequestStatus,
        default: StockRequestStatus.PENDING,
    }),
    __metadata("design:type", String)
], StockRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: '' }),
    __metadata("design:type", String)
], StockRequest.prototype, "note", void 0);
exports.StockRequest = StockRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], StockRequest);
exports.StockRequestSchema = mongoose_1.SchemaFactory.createForClass(StockRequest);
//# sourceMappingURL=stock-request.schema.js.map