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
exports.BranchInventoryController = exports.StockTransfersController = exports.StockRequestsController = void 0;
const common_1 = require("@nestjs/common");
const stock_management_service_1 = require("./stock-management.service");
let StockRequestsController = class StockRequestsController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(body) {
        return await this.service.createRequest(body);
    }
    async findAll(status, branchId) {
        return await this.service.getAllRequests(status, branchId);
    }
    async findOne(id) {
        return await this.service.getRequestById(id);
    }
    async updateStatus(id, body) {
        return await this.service.updateRequestStatus(id, body.status, body.note, body.sourceBranchId);
    }
};
exports.StockRequestsController = StockRequestsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StockRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __param(1, (0, common_1.Query)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], StockRequestsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockRequestsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StockRequestsController.prototype, "updateStatus", null);
exports.StockRequestsController = StockRequestsController = __decorate([
    (0, common_1.Controller)('stock-requests'),
    __metadata("design:paramtypes", [stock_management_service_1.StockManagementService])
], StockRequestsController);
let StockTransfersController = class StockTransfersController {
    service;
    constructor(service) {
        this.service = service;
    }
    async create(body) {
        return await this.service.createTransfer(body);
    }
    async findAll(status) {
        return await this.service.getAllTransfers(status);
    }
    async findOne(id) {
        return await this.service.getTransferById(id);
    }
    async updateStatus(id, body) {
        return await this.service.updateTransferStatus(id, body.status);
    }
};
exports.StockTransfersController = StockTransfersController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StockTransfersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockTransfersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], StockTransfersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], StockTransfersController.prototype, "updateStatus", null);
exports.StockTransfersController = StockTransfersController = __decorate([
    (0, common_1.Controller)('stock-transfers'),
    __metadata("design:paramtypes", [stock_management_service_1.StockManagementService])
], StockTransfersController);
let BranchInventoryController = class BranchInventoryController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getByBranch(branchId) {
        return await this.service.getInventoryByBranch(branchId);
    }
};
exports.BranchInventoryController = BranchInventoryController;
__decorate([
    (0, common_1.Get)(':branchId'),
    __param(0, (0, common_1.Param)('branchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BranchInventoryController.prototype, "getByBranch", null);
exports.BranchInventoryController = BranchInventoryController = __decorate([
    (0, common_1.Controller)('branch-inventory'),
    __metadata("design:paramtypes", [stock_management_service_1.StockManagementService])
], BranchInventoryController);
//# sourceMappingURL=stock-management.controller.js.map