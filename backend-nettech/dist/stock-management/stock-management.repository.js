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
exports.StockManagementRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const stock_request_schema_1 = require("./schemas/stock-request.schema");
const stock_transfer_schema_1 = require("./schemas/stock-transfer.schema");
const branch_inventory_schema_1 = require("./schemas/branch-inventory.schema");
let StockManagementRepository = class StockManagementRepository {
    stockRequestModel;
    stockTransferModel;
    inventoryModel;
    constructor(stockRequestModel, stockTransferModel, inventoryModel) {
        this.stockRequestModel = stockRequestModel;
        this.stockTransferModel = stockTransferModel;
        this.inventoryModel = inventoryModel;
    }
    async createRequest(data) {
        return await this.stockRequestModel.create(data);
    }
    async findAllRequests(filter) {
        const query = {};
        if (filter.status)
            query.status = filter.status;
        if (filter.branchId)
            query.branchId = new mongoose_2.Types.ObjectId(filter.branchId);
        return await this.stockRequestModel
            .find(query)
            .populate('requester', 'fullName email')
            .populate('branchId', 'name address')
            .populate('items.productId', 'name sku')
            .sort({ createdAt: -1 })
            .lean();
    }
    async findRequestById(id) {
        return await this.stockRequestModel
            .findById(id)
            .populate('requester', 'fullName email')
            .populate('branchId', 'name address')
            .populate('items.productId', 'name sku')
            .lean();
    }
    async findRequestByIdRaw(id) {
        return await this.stockRequestModel.findById(id).lean();
    }
    async updateRequest(id, data) {
        return await this.stockRequestModel
            .findByIdAndUpdate(id, { $set: data }, { new: true })
            .lean();
    }
    async createTransfer(data) {
        return await this.stockTransferModel.create(data);
    }
    async findAllTransfers(filter) {
        const query = {};
        if (filter.status)
            query.status = filter.status;
        return await this.stockTransferModel
            .find(query)
            .populate('fromBranch', 'name address')
            .populate('toBranch', 'name address')
            .populate('items.productId', 'name sku')
            .sort({ transferDate: -1 })
            .lean();
    }
    async findTransferById(id) {
        return await this.stockTransferModel
            .findById(id)
            .populate('fromBranch', 'name address')
            .populate('toBranch', 'name address')
            .populate('items.productId', 'name sku')
            .lean();
    }
    async findTransferByIdRaw(id) {
        return await this.stockTransferModel.findById(id).lean();
    }
    async updateTransfer(id, data) {
        return await this.stockTransferModel
            .findByIdAndUpdate(id, { $set: data }, { new: true })
            .lean();
    }
    async findInventoryByBranch(branchId) {
        return await this.inventoryModel
            .find({ branchId: new mongoose_2.Types.ObjectId(branchId) })
            .populate('productId', 'name sku price')
            .lean();
    }
    async adjustInventory(branchId, productId, delta) {
        return await this.inventoryModel.findOneAndUpdate({ branchId, productId }, { $inc: { quantity: delta } }, { upsert: true, new: true });
    }
};
exports.StockManagementRepository = StockManagementRepository;
exports.StockManagementRepository = StockManagementRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(stock_request_schema_1.StockRequest.name)),
    __param(1, (0, mongoose_1.InjectModel)(stock_transfer_schema_1.StockTransfer.name)),
    __param(2, (0, mongoose_1.InjectModel)(branch_inventory_schema_1.BranchInventory.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], StockManagementRepository);
//# sourceMappingURL=stock-management.repository.js.map