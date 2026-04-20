"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockManagementModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const stock_management_controller_1 = require("./stock-management.controller");
const stock_management_service_1 = require("./stock-management.service");
const stock_management_repository_1 = require("./stock-management.repository");
const stock_request_schema_1 = require("./schemas/stock-request.schema");
const stock_transfer_schema_1 = require("./schemas/stock-transfer.schema");
const branch_inventory_schema_1 = require("./schemas/branch-inventory.schema");
let StockManagementModule = class StockManagementModule {
};
exports.StockManagementModule = StockManagementModule;
exports.StockManagementModule = StockManagementModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: stock_request_schema_1.StockRequest.name, schema: stock_request_schema_1.StockRequestSchema },
                { name: stock_transfer_schema_1.StockTransfer.name, schema: stock_transfer_schema_1.StockTransferSchema },
                { name: branch_inventory_schema_1.BranchInventory.name, schema: branch_inventory_schema_1.BranchInventorySchema },
            ]),
        ],
        controllers: [
            stock_management_controller_1.StockRequestsController,
            stock_management_controller_1.StockTransfersController,
            stock_management_controller_1.BranchInventoryController,
        ],
        providers: [stock_management_service_1.StockManagementService, stock_management_repository_1.StockManagementRepository],
        exports: [stock_management_service_1.StockManagementService],
    })
], StockManagementModule);
//# sourceMappingURL=stock-management.module.js.map