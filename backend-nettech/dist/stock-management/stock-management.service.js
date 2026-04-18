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
exports.StockManagementService = void 0;
const common_1 = require("@nestjs/common");
const stock_management_repository_1 = require("./stock-management.repository");
const stock_request_schema_1 = require("./schemas/stock-request.schema");
const stock_transfer_schema_1 = require("./schemas/stock-transfer.schema");
let StockManagementService = class StockManagementService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async createRequest(data) {
        return await this.repo.createRequest(data);
    }
    async getAllRequests(status, branchId) {
        return await this.repo.findAllRequests({
            status: status,
            branchId,
        });
    }
    async getRequestById(id) {
        const request = await this.repo.findRequestById(id);
        if (!request)
            throw new common_1.NotFoundException('Không tìm thấy phiếu yêu cầu!');
        return request;
    }
    async updateRequestStatus(id, status, note, sourceBranchId) {
        const updateData = { status };
        if (note !== undefined)
            updateData.note = note;
        if (sourceBranchId)
            updateData.sourceBranchId = sourceBranchId;
        const updated = await this.repo.updateRequest(id, updateData);
        if (!updated)
            throw new common_1.NotFoundException('Không tìm thấy phiếu yêu cầu!');
        if (status === stock_request_schema_1.StockRequestStatus.APPROVED) {
            const raw = await this.repo.findRequestByIdRaw(id);
            if (raw) {
                await this.repo.createTransfer({
                    fromBranch: sourceBranchId ?? raw.sourceBranchId ?? null,
                    toBranch: raw.branchId,
                    items: raw.items.map(({ productId, quantity }) => ({ productId, quantity })),
                    status: 'SHIPPING',
                    sourceRequestId: raw._id,
                    transferDate: new Date(),
                });
            }
        }
        return updated;
    }
    async createTransfer(data) {
        return await this.repo.createTransfer(data);
    }
    async getAllTransfers(status) {
        return await this.repo.findAllTransfers({
            status: status,
        });
    }
    async getTransferById(id) {
        const transfer = await this.repo.findTransferById(id);
        if (!transfer)
            throw new common_1.NotFoundException('Không tìm thấy phiếu chuyển hàng!');
        return transfer;
    }
    async updateTransferStatus(id, status) {
        const raw = await this.repo.findTransferByIdRaw(id);
        if (!raw)
            throw new common_1.NotFoundException('Không tìm thấy phiếu chuyển hàng!');
        if (raw.status === stock_transfer_schema_1.StockTransferStatus.CANCELLED) {
            throw new common_1.BadRequestException('Phiếu đã bị huỷ, không thể cập nhật trạng thái!');
        }
        const updated = await this.repo.updateTransfer(id, { status });
        if (status === stock_transfer_schema_1.StockTransferStatus.DELIVERED) {
            const fromBranchId = raw.fromBranch;
            const toBranchId = raw.toBranch;
            const inventoryUpdates = raw.items.map(({ productId, quantity }) => Promise.all([
                this.repo.adjustInventory(fromBranchId, productId, -quantity),
                this.repo.adjustInventory(toBranchId, productId, quantity),
            ]));
            await Promise.all(inventoryUpdates);
        }
        return updated;
    }
    async getInventoryByBranch(branchId) {
        return await this.repo.findInventoryByBranch(branchId);
    }
};
exports.StockManagementService = StockManagementService;
exports.StockManagementService = StockManagementService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stock_management_repository_1.StockManagementRepository])
], StockManagementService);
//# sourceMappingURL=stock-management.service.js.map