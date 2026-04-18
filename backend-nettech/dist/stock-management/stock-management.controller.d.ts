import { StockManagementService } from './stock-management.service';
import { StockRequestStatus } from './schemas/stock-request.schema';
import { StockTransferStatus } from './schemas/stock-transfer.schema';
export declare class StockRequestsController {
    private readonly service;
    constructor(service: StockManagementService);
    create(body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/stock-request.schema").StockRequest, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/stock-request.schema").StockRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(status?: string, branchId?: string): Promise<(import("./schemas/stock-request.schema").StockRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("./schemas/stock-request.schema").StockRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStatus(id: string, body: {
        status: StockRequestStatus;
        sourceBranchId?: string;
        note?: string;
    }): Promise<import("./schemas/stock-request.schema").StockRequest & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
}
export declare class StockTransfersController {
    private readonly service;
    constructor(service: StockManagementService);
    create(body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/stock-transfer.schema").StockTransfer, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/stock-transfer.schema").StockTransfer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(status?: string): Promise<(import("./schemas/stock-transfer.schema").StockTransfer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("./schemas/stock-transfer.schema").StockTransfer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    updateStatus(id: string, body: {
        status: StockTransferStatus;
    }): Promise<(import("./schemas/stock-transfer.schema").StockTransfer & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
}
export declare class BranchInventoryController {
    private readonly service;
    constructor(service: StockManagementService);
    getByBranch(branchId: string): Promise<(import("./schemas/branch-inventory.schema").BranchInventory & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
}
